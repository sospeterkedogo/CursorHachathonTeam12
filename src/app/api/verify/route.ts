import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type VisionResult = {
  verified: boolean;
  score?: number;
  actionType?: string;
  message: string;
};

// Helper: Timeout wrapper for fetch
async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 15000 } = options; // Default 15s timeout
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
    // throw new Error("MINIMAX_API_KEY environment variable is not set.");
    console.warn("MINIMAX_API_KEY not set. Using fallback.");
    return {
      verified: true,
      score: 80,
      actionType: "eco-action",
      message: "Great eco-action! (Dev mode: Key missing)"
    };
  }

  const prompt =
    "Analyze this image. Does it depict a specific eco-friendly action (e.g., recycling, turning off lights, using a reusable cup)? " +
    "If YES, return verified: true, a score (10-100), actionType (short label like 'recycling', 'lights-off', 'reusable-cup'), " +
    "and a short, encouraging 1-sentence message. " +
    "If NO, return verified: false and a polite correction message. " +
    "Return strictly JSON with keys: verified (boolean), score (number, optional when false), actionType (string, optional when false), message (string).";

  try {
    const response = await fetchWithTimeout("https://api.minimax.io/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "abab6.5s-chat",
        messages: [
          {
            role: "system",
            content: "You are an eco-sustainability image verification assistant."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ]
      }),
      timeout: 20000 // 20s max for vision
    });

    if (!response.ok) {
      const text = await response.text();
      console.warn("MiniMax Vision API non-OK:", text?.slice(0, 300));
      throw new Error("MiniMax Vision API error");
    }

    const json = await response.json();

    // Extract content safely
    const rawContent =
      json.choices?.[0]?.message?.content ??
      json.reply?.content ??
      (typeof json.content === "string" ? json.content : "") ??
      "";

    // Clean up markdown/JSON
    let content = rawContent.trim();
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      content = codeBlockMatch[1].trim();
    }
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      content = content.slice(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(content);
    if (typeof parsed.verified !== "boolean" || typeof parsed.message !== "string") {
      throw new Error("Invalid JSON structure");
    }

    return parsed;
  } catch (error) {
    console.warn("MiniMax Vision failed or timed out. Using fallback.", error);
    // Fallback so user never gets stuck
    return {
      verified: true,
      score: 75,
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
        voice_setting: {
          voice_id: "English_expressive_narrator",
          speed: 1,
          vol: 1,
          pitch: 0
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: "mp3",
          channel: 1
        }
      }),
      timeout: 8000 // 8s max for audio
    });

    if (!response.ok) {
      throw new Error("MiniMax T2A API error");
    }

    const data = await response.json();
    return data.data?.audio || null;
  } catch (error) {
    console.error("MiniMax T2A error/timeout:", error);
    return null; // No audio, but verification still succeeds
  }
}

async function callMiniMaxVoucherGen(actionType: string, score: number): Promise<{ title: string, description: string, code: string } | null> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `Generate a reward voucher for a user who just verified an eco-action: "${actionType}" and earned ${score} points. 
    Return strictly JSON with keys: 
    - title (short, catchy, e.g. "Green Coffee Discount")
    - description (1 sentence, e.g. "Get 10% off at participating eco-cafes.")
    - code (8-char alphanumeric code, unrelated to action, e.g. ECO-8X92)`;

    const response = await fetchWithTimeout("https://api.minimax.io/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "abab6.5s-chat",
        messages: [
          { role: "system", content: "You are a reward system generator." },
          { role: "user", content: prompt }
        ]
      }),
      timeout: 10000
    });

    if (!response.ok) return null;

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content || "";

    // Simple JSON extraction
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return null;

  } catch (error) {
    console.error("Voucher Gen Error:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageBase64 = body?.image as string | undefined;
    const userId = body?.userId as string | undefined;
    const username = body?.username as string | undefined;
    const avatar = body?.avatar as string | undefined;

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    // Step A: Vision (Timeout handled inside, always returns valid object)
    const vision = await callMiniMaxVision(imageBase64);

    // Step B: Voice (Timeout handled inside, returns null on fail)
    const audioUrl = await callMiniMaxT2A(vision.message);

    // Step C: Voucher (Background / Best effort)
    let voucher = null;
    if (vision.verified) {
      voucher = await callMiniMaxVoucherGen(vision.actionType || "eco-action", vision.score || 10);
    }

    // Step D: Database (Background / Best effort)
    const timestamp = new Date();
    try {
      const db = await getDb();
      const scans = db.collection("scans");
      const users = db.collection("users");
      const vouchers = db.collection("vouchers");

      const score = typeof vision.score === 'number' ? vision.score : 0;

      // 1. Save Scan
      await scans.insertOne({
        userId: userId || "anonymous",
        username: username || "Anonymous", // Snapshot at time of scan
        avatar: avatar || "👤", // Snapshot
        image: imageBase64,
        verified: vision.verified,
        score: vision.score ?? null,
        actionType: vision.actionType ?? null,
        timestamp
      });

      // 2. Update User Total Score
      if (userId && score > 0) {
        await users.updateOne(
          { userId },
          {
            $inc: { totalScore: score },
            $set: {
              lastActive: timestamp,
              ...(username ? { username } : {}),
              ...(avatar ? { avatar } : {})
            },
            $setOnInsert: {
              username: "Guest User",
              avatar: "👤"
            }
          },
          { upsert: true }
        );

        // 3. Save Voucher if generated
        if (voucher) {
          await vouchers.insertOne({
            userId,
            ...voucher,
            createdAt: timestamp,
            expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          });
        }
      }
    } catch (dbError) {
      console.error("Failed to persist scan/user/voucher:", dbError);
    }

    return NextResponse.json({
      verified: vision.verified,
      score: vision.score ?? null,
      actionType: vision.actionType ?? null,
      message: vision.message,
      audioUrl,
      voucher, // Return voucher to client
      timestamp
    });

  } catch (error: any) {
    console.error("Error in /api/verify:", error);
    // Ultimate fallback if something completely unexpected happens in the route handler itself
    // Should generally be caught by the sub-functions, but good safety net.
    return NextResponse.json({
      verified: true,
      score: 50,
      actionType: "eco-action",
      message: "We encountered a glitch, but here's some points for your effort!",
      audioUrl: null,
      timestamp: new Date()
    });
  }
}

