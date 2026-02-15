import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const LOG_FILE = path.join(process.cwd(), "verification-debug.log");
function logToFile(msg: string) {
  try {
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) {
    console.error("LOG FAILED:", e);
  }
}


import { VisionResult } from "@/types";

function generateRandomCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

const VerifySchema = z.object({
  image: z.string().optional(),
  userId: z.string().min(1),
  username: z.string().optional(),
  avatar: z.string().optional(),
  simulated: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  honeypot: z.string().optional(), // Bot detection
});

async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 25000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

async function callMiniMaxVision(imageBase64: string): Promise<VisionResult> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    console.warn("MINIMAX_API_KEY not set. Using random fallback.");
    const randomScore = Math.floor(Math.random() * 91) + 10;
    return {
      verified: true,
      score: randomScore,
      actionType: "eco-action",
      message: "Great eco-action! (Dev mode: Key missing)"
    };
  }

  const prompt =
    "You are the Eco-Verify AI. Your tone is witty, encouraging, and slightly sarcastic. You use modern internet slang (e.g., 'W,' 'huge if true,' 'main character energy') but stay professional enough for a hackathon. Goal: Analyze the image for eco-friendly behavior. If you see a green action (recycling, reusable cups, public transit, turning off lights): Give a high score (80-100) and a punchy, 1-sentence validation. If you see a 'neutral' or 'bad' action (plastic waste, idling car, unnecessary power use): Give a low score and a cheeky, slightly judgmental roast. Return strictly JSON with keys: verified (boolean), score (number, optional when false), actionType (string, optional when false), message (string).";

  try {
    // We use the v2 endpoint for standardized vision/chat capabilities.
    const response = await fetchWithTimeout("https://api.minimax.io/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "MiniMax-Text-01",
        messages: [
          {
            role: "system",
            content: "You are an eco-sustainability vision assistant. Always reply with strictly valid JSON."
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }
        ]
      })
    });

    const resText = await response.text();
    logToFile(`VISION API (${response.status}) RAW RESPONSE: ${resText}`);

    if (!response.ok) {
      throw new Error(`MiniMax Vision API error: ${response.status}`);
    }

    const json = JSON.parse(resText);

    // Some API errors return 200 OK but contain internal error codes (e.g., rate limits).
    if (json.base_resp?.status_code && json.base_resp?.status_code !== 0) {
      throw new Error(`MiniMax API Error: ${json.base_resp.status_msg} (${json.base_resp.status_code})`);
    }

    const rawContent = json.choices?.[0]?.message?.content ?? "";

    let content = rawContent.trim();
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      content = match[0];
    } else if (resText.includes("base_resp") && !rawContent) {
      // Handle cases where the API returns a response but NO content (like silent errors)
      throw new Error("MiniMax returned empty content");
    }

    const parsed = JSON.parse(content);

    // Enforce 0 score for non-verified actions while providing fallbacks for missing AI scores.
    if (parsed.verified === false) {
      parsed.score = 0;
    } else if (typeof parsed.score !== "number") {
      parsed.score = Math.floor(Math.random() * 91) + 10;
    }

    return parsed;
  } catch (error: any) {
    logToFile(`MINIMAX VISION EXCEPTION: ${error.message}`);
    const randomScore = Math.floor(Math.random() * 91) + 10;
    return {
      verified: true,
      score: randomScore,
      actionType: "eco-action",
      message: "Thanks for sharing! We couldn't verify the details, but here's a score for your effort."
    };
  }
}

async function callMiniMaxT2A(text: string): Promise<string | null> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetchWithTimeout("https://api.minimax.io/v1/t2a_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "speech-2.8-hd",
        text,
        stream: false,
        language_boost: "auto",
        output_format: "url",
        voice_setting: { voice_id: "English_expressive_narrator" },
        audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3", channel: 1 }
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.data?.audio || null;
  } catch {
    return null;
  }
}

async function callMiniMaxVoucherGen(actionType: string, score: number): Promise<{ title: string, description: string, code: string } | null> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `Generate a realistic reward voucher for a user who performed the eco-action: "${actionType}" and earned ${score} points.
    Requirements:
    - title: Must sound like a real retail voucher (e.g. "£10 Off Eco-Friendly Goods", "25% Discount Coupon", "Free Reusable Bag").
    - description: One sentence explaining the reward and why they earned it (e.g. "You earned £10 off for your incredible recycling efforts!"). Reward value should scale with score.
    - code: 8-char random alphanumeric code.
    Return strictly JSON: { "title": "...", "description": "...", "code": "..." }`;

    const response = await fetchWithTimeout("https://api.minimax.io/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "MiniMax-Text-01",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) return null;
    const resText = await response.text();
    logToFile(`VOUCHER API RAW RESPONSE: ${resText}`);
    const json = JSON.parse(resText);
    const content = json.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      // ALWAYS override with a fresh random code to ensure user's "random" requirement
      parsed.code = generateRandomCode();
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = VerifySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 });
    }

    const { image, userId, username, avatar, simulated, isPublic, honeypot } = result.data;

    if (honeypot) {
      logToFile(`Bot detected for user: ${userId}`);
      return NextResponse.json({ error: "Cloudflare thinks you are a robot" }, { status: 403 });
    }

    // Rate limit to prevent abuse (default: 10 RPM per user).
    const limit = rateLimit(userId, 10, 60000);
    if (!limit.success) {
      return NextResponse.json({
        error: "Too many requests. Please slow down.",
        retryAfter: limit.reset
      }, {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.limit.toString(),
          'X-RateLimit-Remaining': limit.remaining.toString(),
          'X-RateLimit-Reset': limit.reset.toString(),
        }
      });
    }

    if (simulated) {
      const simulatedScore = Math.floor(Math.random() * 91) + 10;
      const voucher = await callMiniMaxVoucherGen("simulated-action", simulatedScore) || {
        title: `${simulatedScore > 50 ? "£10" : "£5"} Off Eco-Shop`,
        description: `Simulated reward for your high-impact action (${simulatedScore} points).`,
        code: generateRandomCode()
      };

      const timestamp = new Date();
      await persistVerification(userId, username, avatar, "simulated", true, simulatedScore, "simulated-action", voucher, timestamp, isPublic ?? true);

      return NextResponse.json({
        verified: true,
        score: simulatedScore,
        actionType: "simulated-action",
        message: "Simulated Success!",
        voucher,
        timestamp
      });
    }

    if (!image) return NextResponse.json({ error: "No image" }, { status: 400 });

    const vision = await callMiniMaxVision(image);
    const audioUrl = await callMiniMaxT2A(vision.message);

    let voucher = null;
    if (vision.verified || (vision.score && vision.score > 0)) {
      vision.verified = true;
      voucher = await callMiniMaxVoucherGen(vision.actionType || "eco-action", vision.score || 10);
    }

    const timestamp = new Date();
    await persistVerification(userId, username, avatar, image, vision.verified, vision.score || 0, vision.actionType || "eco-action", voucher, timestamp, isPublic ?? true);

    return NextResponse.json({
      ...vision,
      audioUrl,
      voucher,
      timestamp
    });

  } catch (error: any) {
    console.error("Error in POST:", error);
    const randomScore = Math.floor(Math.random() * 91) + 10;
    return NextResponse.json({
      verified: true,
      score: randomScore,
      actionType: "eco-action",
      message: "We encountered a glitch, but rewarded your effort!",
      timestamp: new Date()
    });
  }
}

async function persistVerification(userId: any, username: any, avatar: any, image: string, verified: boolean, score: number, actionType: string, voucher: any, timestamp: Date, isPublic: boolean) {
  try {
    const db = await getDb();
    const scans = db.collection("scans");
    const users = db.collection("users");
    const vouchers = db.collection("vouchers");

    await scans.insertOne({
      userId: userId || "anon",
      username,
      avatar,
      image: image,
      verified,
      score,
      actionType,
      timestamp,
      isPublic: !!isPublic
    });

    if (userId && score > 0) {
      try {
        await users.updateOne(
          { userId },
          { $inc: { totalScore: score }, $set: { lastActive: timestamp, ...(username && { username }), ...(avatar && { avatar }) }, $setOnInsert: { username: "Guest", avatar: "👤" } },
          { upsert: true }
        );
      } catch {
        await users.updateOne({ userId }, { $inc: { totalScore: score }, $set: { lastActive: timestamp } }, { upsert: true });
      }

      if (voucher) {
        // Enforce a security limit of 5 vouchers per user per rolling 24-hour window.
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyVoucherCount = await vouchers.countDocuments({
          userId,
          createdAt: { $gte: twentyFourHoursAgo }
        });

        if (dailyVoucherCount < 5) {
          await vouchers.insertOne({ userId, ...voucher, used: false, createdAt: timestamp, expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
        } else {
          logToFile(`Voucher limit reached for user: ${userId}`);
          // We still track the scan but don't issue a voucher
        }
      }
    }
  } catch (e) {
    console.error("Persistence failed:", e);
  }
}
