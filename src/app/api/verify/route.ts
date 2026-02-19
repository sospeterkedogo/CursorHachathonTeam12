import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import sharp from "sharp";
import { ObjectId } from "mongodb";

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
  source: z.string().optional(), // camera or gallery
  honeypot: z.string().optional(), // Bot detection
});

async function compressImage(base64Data: string): Promise<string> {
  try {
    const buffer = Buffer.from(base64Data.split(",")[1] || base64Data, "base64");
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 1000, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
    return `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Compression failed:", error);
    return base64Data; // Fallback to original
  }
}

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
    "You are an Environmental Auditor. Your job is to verify eco-actions with scientific rigour but practical understanding. RULES: 1. REJECT single-use plastics, disposables, or greenwashing (Score 0). 2. ACCEPT 'passive' eco-signals like Bicycles (alternative transport), Repair Tools (circular economy), Public Transit scenes, or Plant-based meals. These implied actions SAVE emissions. 3. Calculate estimated CO2 saved in milligrams (mg). 4. Output a 'reasoning' string. Return strictly JSON: { verified: boolean, score: number (mg CO2), actionType: string, message: string, reasoning: string }.";

  try {
    // Ensure image has exactly one prefix
    const finalImageUrl = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

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
              { type: "image_url", image_url: { url: finalImageUrl } }
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
      parsed.co2_saved = 0;
    } else if (typeof parsed.score !== "number") {
      // Fallback for CO2 estimation if AI fails to provide a number but verifies it
      parsed.score = Math.floor(Math.random() * 500) + 100; // 100-600mg CO2
      parsed.co2_saved = parsed.score;
    } else {
      parsed.co2_saved = parsed.score;
    }

    // Default reasoning if missing
    if (!parsed.reasoning) {
      parsed.reasoning = parsed.verified
        ? "Verified eco-friendly action based on visual evidence."
        : "Could not verify impactful eco-action.";
    }

    return parsed;
  } catch (error: any) {
    logToFile(`MINIMAX VISION EXCEPTION: ${error.message}`);
    return {
      verified: false,
      score: 0,
      actionType: "failed-verification",
      message: "We couldn't verify this action. Make sure the eco-activity is clear in the frame!"
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

    const { image, userId, username, avatar, simulated, isPublic, honeypot, source } = result.data;

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

    const timestamp = new Date();
    const scanId = new ObjectId();

    // Compress image if present
    let finalImage = image;
    if (image && !simulated) {
      finalImage = await compressImage(image);
    }

    // Create the initial scan record
    const db = await getDb();
    await db.collection("scans").insertOne({
      _id: scanId,
      userId: userId || "anon",
      username,
      avatar,
      image: finalImage,
      verified: false,
      score: 0,
      status: "pending",
      timestamp,
      isPublic: !!isPublic,
      source: source || "camera" // Save source
    });

    // Background the AI processing
    // NOTE: In Vercel, we should ideally use waitUntil, but for this implementation
    // we return immediately and the client will poll. The background processing
    // continues in the same execution context.
    (async () => {
      try {
        let vision;
        let voucher = null;
        let audioUrl = null;

        if (simulated) {
          const simulatedScore = Math.floor(Math.random() * 91) + 10;
          vision = { verified: true, score: simulatedScore, actionType: "simulated-action", message: "Simulated Success!" };
          voucher = await callMiniMaxVoucherGen("simulated-action", simulatedScore) || {
            title: `${simulatedScore > 50 ? "£10" : "£5"} Off Eco-Shop`,
            description: `Simulated reward for your high-impact action (${simulatedScore} points).`,
            code: generateRandomCode(),
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
        } else if (finalImage) {
          // Only process vision if there's an image

          // Calculate CO2 and Points
          // Default: 1 Point = 10mg CO2 (Adjust as needed)
          const POINTS_PER_MG = 0.1;

          vision = await callMiniMaxVision(finalImage);
          audioUrl = await callMiniMaxT2A(vision.message);

          // AI returns score in 'mg CO2' as per prompt
          vision.co2_saved = vision.score || 0;

          // Calculate 'Points'
          let points = Math.floor(vision.co2_saved * POINTS_PER_MG);

          // Force 0 POINTS for gallery uploads, but keep CO2
          if (source === "gallery") {
            logToFile(`Gallery upload detected for user ${userId}. Awarding 0 points but tracking CO2.`);
            vision.score = 0; // Score = Points
          } else {
            vision.score = points; // Score = Points
          }

          if (vision.verified && vision.co2_saved && vision.co2_saved >= 50) {
            // ... voucher logic uses points or CO2? Let's use Points? Or CO2?
            // User said "reward in points". 
            // Let's pass points to voucher gen?
            // The voucher prompt says "earned ${score} points". So we use points.
            // If source is gallery (0 points), they get no voucher? "Do not award in points". 
            // Usually vouchers are for gamified points. So yes, gallery = no voucher usually.
            if (vision.score > 0) {
              voucher = await callMiniMaxVoucherGen(vision.actionType || "eco-action", vision.score);
            }
          }
        }

        // ...

        if (vision) {
          await completeVerification(scanId, userId, username, avatar, vision.verified, vision.score || 0, vision.co2_saved || 0, vision.actionType || "eco-action", vision.message, voucher, audioUrl, timestamp, vision.reasoning);
        }
      } catch (error) {
        console.error("Background processing failed:", error);
        await db.collection("scans").updateOne({ _id: scanId }, { $set: { status: "failed", error: "Processing failed" } });
      }
    })();

    return NextResponse.json({
      scanId: scanId.toString(),
      status: "pending",
      message: "Processing started"
    });

  } catch (error: any) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function completeVerification(scanId: ObjectId, userId: any, username: any, avatar: any, verified: boolean, score: number, co2_saved: number, actionType: string, message: string, voucher: any, audioUrl: string | null, timestamp: Date, reasoning?: string) {
  try {
    const db = await getDb();
    const scans = db.collection("scans");
    const users = db.collection("users");
    const vouchers = db.collection("vouchers");

    await scans.updateOne(
      { _id: scanId },
      {
        $set: {
          verified,
          score, // POINTS
          co2_saved, // MG CO2
          actionType,
          message,
          reasoning: reasoning || null,
          audioUrl,
          voucher,
          status: "completed"
        }
      }
    );

    if (userId && score > 0) {
      try {
        await users.updateOne(
          { userId },
          { $inc: { totalScore: score, totalCO2: co2_saved }, $set: { lastActive: timestamp, ...(username && { username }), ...(avatar && { avatar }) }, $setOnInsert: { username: "Guest", avatar: "👤" } },
          { upsert: true }
        );
      } catch {
        await users.updateOne({ userId }, { $inc: { totalScore: score, totalCO2: co2_saved }, $set: { lastActive: timestamp } }, { upsert: true });
      }

      if (voucher) {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyVoucherCount = await vouchers.countDocuments({
          userId,
          createdAt: { $gte: twentyFourHoursAgo }
        });

        if (dailyVoucherCount < 5) {
          await vouchers.insertOne({ userId, ...voucher, used: false, createdAt: timestamp, expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
        }
      }
    }
  } catch (e) {
    console.error("Persistence failed:", e);
  }
}
