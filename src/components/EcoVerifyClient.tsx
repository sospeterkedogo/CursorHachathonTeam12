'use client';

import { useRef, useState } from "react";
import { Camera, Loader2, Leaf } from "lucide-react";
import dynamic from "next/dynamic";

const confettiPromise = import("canvas-confetti").then((m) => m.default);

type Scan = {
  image: string;
  actionType: string;
  score: number;
  timestamp: string;
};

type Props = {
  initialTotalScore: number;
  initialScans: Scan[];
};

export default function EcoVerifyClient({ initialTotalScore, initialScans }: Props) {
  const [globalScore, setGlobalScore] = useState(initialTotalScore);
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];
      await submitImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const submitImage = async (imageBase64: string) => {
    try {
      setLoading(true);
      setFeedback(null);
      setVerified(null);
      setScore(null);
      setAudioUrl(null);

      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const message =
          error?.details || error?.error || "Verification failed";
        throw new Error(message);
      }

      const data = await res.json();

      setVerified(data.verified);
      setScore(typeof data.score === "number" ? data.score : null);
      setFeedback(data.message);
      setAudioUrl(data.audioUrl || null);

      if (data.verified) {
        const addedScore = typeof data.score === "number" ? data.score : 0;
        setGlobalScore((prev) => prev + addedScore);
        // Add to live feed
        const newScan: Scan = {
          image: imageBase64,
          actionType: data.actionType || "eco-action",
          score: addedScore,
          timestamp: data.timestamp || new Date().toISOString()
        };
        setScans((prev) => [newScan, ...prev].slice(0, 10));

        // Fire confetti
        try {
          const confetti = await confettiPromise;
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.7 },
            colors: ["#22c55e", "#a3e635", "#bbf7d0"]
          });
        } catch (err) {
          console.warn("Confetti failed:", err);
        }

        // Auto play audio
        if (data.audioUrl && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {
            // Ignore autoplay errors
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setFeedback(err.message || "Something went wrong. Please try again.");
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6 sm:space-y-8">
      {/* Hero + Global Impact Score */}
      <header className="flex flex-col gap-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-900/60 via-emerald-800/60 to-slate-900/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 eco-glow">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2.5">
            <Leaf className="h-6 w-6 text-emerald-400 sm:h-7 sm:w-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">Eco-Verify</p>
            <h1 className="text-lg font-semibold text-emerald-50 sm:text-xl">
              Gamified Sustainability Scanner
            </h1>
          </div>
        </div>
        <div className="rounded-xl bg-black/40 px-4 py-2.5 text-right shadow-inner shadow-emerald-500/30 sm:px-5 sm:py-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-300/70 sm:text-xs">
            Global Impact Score
          </p>
          <p className="mt-0.5 text-2xl font-bold tabular-nums text-emerald-400 sm:text-3xl">
            {globalScore}
          </p>
          <p className="text-[10px] text-emerald-200/70 sm:text-xs">Sum of all verified eco-actions</p>
        </div>
      </header>

      {/* Action Area */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/50 via-slate-950 to-black p-4 sm:p-6 scan-gradient">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(74,222,128,0.22),transparent_55%),radial-gradient(circle_at_90%_80%,rgba(45,212,191,0.2),transparent_55%)]" />
        <div className="relative z-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex-1 space-y-2 sm:space-y-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-emerald-50 sm:text-lg">
              <Leaf className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
              Snap your eco-action
            </h2>
            <p className="text-sm text-emerald-100/80 sm:text-base">
              Capture recycling, switching off lights, using reusables, and more. Eco-Verify will
              scan your photo, validate the action, award you a score, and cheer you on with
              audio feedback.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <button
              onClick={triggerFileInput}
              disabled={loading}
              className="relative inline-flex items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/90 px-8 py-3 text-base font-semibold text-emerald-950 shadow-xl shadow-emerald-500/50 transition hover:scale-[1.03] hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-70 sm:px-10 sm:py-4 sm:text-lg"
            >
              <span className="absolute inset-0 -z-10 animate-ping-fast rounded-full bg-emerald-400/40 blur-xl" />
              <Camera className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              {loading ? "Scanning..." : "Verify Action"}
            </button>
            <p className="text-[10px] text-emerald-100/80 sm:text-xs">
              Works with camera or gallery photos.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Loading overlay with scanning animation */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                <div className="absolute inset-2 animate-spin-slow rounded-full border-4 border-t-emerald-400 border-l-emerald-500/60 border-r-transparent border-b-transparent" />
                <div className="absolute inset-6 animate-pulse rounded-full bg-emerald-500/25 blur-md" />
                <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-emerald-200" />
              </div>
              <p className="text-sm font-medium text-emerald-50">Analyzing your eco-action...</p>
              <p className="text-xs text-emerald-200/80">
                Vision → Score → Voice — hang tight.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Feedback */}
      {(feedback || verified !== null) && (
        <div
          className={`rounded-2xl border p-4 sm:p-5 ${
            verified
              ? "border-emerald-400/60 bg-emerald-900/40"
              : "border-red-400/60 bg-red-900/40"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">
                {verified ? "Verified eco-action" : "Not quite eco-action"}
              </p>
              {feedback && <p className="text-sm md:text-base">{feedback}</p>}
            </div>
            {verified && typeof score === "number" && (
              <div className="flex flex-col items-end rounded-2xl bg-black/40 px-4 py-2 text-right">
                <span className="text-xs text-emerald-200/80">Score</span>
                <span className="text-2xl font-bold text-emerald-400">{score}</span>
              </div>
            )}
          </div>
          {audioUrl && (
            <div className="mt-3">
              <audio ref={audioRef} src={audioUrl} controls className="w-full" />
            </div>
          )}
        </div>
      )}

      {/* Live Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
            Live Eco-Action Feed
          </h3>
          <p className="text-xs text-emerald-200/70">
            Showing the last {Math.min(scans.length, 10)} verified actions
          </p>
        </div>
        {scans.length === 0 ? (
          <p className="rounded-xl border border-emerald-500/20 bg-slate-950/60 p-4 text-sm text-emerald-100/80">
            No verified actions yet. Be the first to earn points for the planet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3">
            {scans.map((scan, idx) => (
              <div
                key={scan.timestamp + idx}
                className="group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-black/40"
              >
                <img
                  src={`data:image/jpeg;base64,${scan.image}`}
                  alt={scan.actionType}
                  className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate text-emerald-50">{scan.actionType}</span>
                  <span className="rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-950">
                    +{scan.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

