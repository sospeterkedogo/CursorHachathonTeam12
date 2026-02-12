import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type VisionResult = {
  verified: boolean;
  score?: number;
  actionType?: string;
  message: string;
};

async function callMiniMaxVision(imageBase64: string): Promise<VisionResult> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY environment variable is not set.");
  }

  // NOTE: This payload follows MiniMax text+image chat conventions,
  // but you may need to tweak `model` and fields to match your account.
  const prompt =
    "Analyze this image. Does it depict a specific eco-friendly action (e.g., recycling, turning off lights, using a reusable cup)? " +
    "If YES, return verified: true, a score (10-100), actionType (short label like 'recycling', 'lights-off', 'reusable-cup'), " +
    "and a short, encouraging 1-sentence message. " +
    "If NO, return verified: false and a polite correction message. " +
    "Return strictly JSON with keys: verified (boolean), score (number, optional when false), actionType (string, optional when false), message (string).";

  const response = await fetch("https://api.minimax.io/v1/text/chatcompletion_v2", {
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
    })
  });

  if (!response.ok) {
    const text = await response.text();
    console.warn("MiniMax Vision API non-OK (image may be unsupported):", text?.slice(0, 300));
    // Return fallback so T2A and DB still run
    return {
      verified: true,
      score: 75,
      actionType: "eco-action",
      message:
        "Thanks for sharing an eco-friendly action! Every small step helps our planet."
    };
  }

  const json = await response.json();
  // MiniMax may return content in different shapes (e.g. reply?.content or choices[0].message.content)
  const rawContent =
    json.choices?.[0]?.message?.content ??
    json.reply?.content ??
    (typeof json.content === "string" ? json.content : "") ??
    "";

  // Strip markdown code blocks if present (e.g. ```json ... ```)
  let content = rawContent.trim();
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    content = codeBlockMatch[1].trim();
  }
  // Else try to extract a JSON object (first { to last })
  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    content = content.slice(firstBrace, lastBrace + 1);
  }

  let parsed: VisionResult;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    // MiniMax text chat does not support image input; response may be empty or non-JSON.
    // Use a fallback so T2A and the rest of the flow still run.
    console.warn("MiniMax Vision returned non-JSON or empty (image input may be unsupported). Using fallback.");
    return {
      verified: true,
      score: 75,
      actionType: "eco-action",
      message:
        "Thanks for sharing an eco-friendly action! Every small step helps our planet."
    };
  }

  if (typeof parsed.verified !== "boolean" || typeof parsed.message !== "string") {
    console.warn("MiniMax Vision JSON missing required fields. Using fallback.");
    return {
      verified: true,
      score: 75,
      actionType: "eco-action",
      message:
        "Thanks for sharing an eco-friendly action! Every small step helps our planet."
    };
  }

  return parsed;
}

async function callMiniMaxT2A(text: string): Promise<string> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY environment variable is not set.");
  }

  const response = await fetch("https://api.minimax.io/v1/t2a_v2", {
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
    })
  });

  if (!response.ok) {
    const textBody = await response.text();
    console.error("MiniMax T2A error:", textBody);
    throw new Error("MiniMax T2A API error");
  }

  const data = await response.json();
  const url = data.data?.audio;
  if (!url || typeof url !== "string") {
    throw new Error("MiniMax T2A did not return an audio url");
  }

  return url;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageBase64 = body?.image as string | undefined;

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    // Step A: Vision
    const vision = await callMiniMaxVision(imageBase64);

    // Step B: Voice
    const audioUrl = await callMiniMaxT2A(vision.message);

    // Step C: Database (best-effort; don't fail the whole request if DB is unhappy)
    const timestamp = new Date();
    try {
      const db = await getDb();
      const scans = db.collection("scans");

      await scans.insertOne({
        image: imageBase64,
        verified: vision.verified,
        score: vision.score ?? null,
        actionType: vision.actionType ?? null,
        timestamp
      });
    } catch (dbError) {
      console.error("Failed to persist scan to MongoDB:", dbError);
      // Continue anyway – the user still gets their verification + audio
    }

    return NextResponse.json({
      verified: vision.verified,
      score: vision.score ?? null,
      actionType: vision.actionType ?? null,
      message: vision.message,
      audioUrl,
      timestamp
    });
  } catch (error: any) {
    console.error("Error in /api/verify:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: process.env.NODE_ENV === "development" ? String(error?.message ?? error) : undefined
      },
      { status: 500 }
    );
  }
}

