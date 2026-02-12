import { getDb } from "@/lib/mongodb";
import EcoVerifyClient from "@/components/EcoVerifyClient";
import { Leaf } from "lucide-react";

async function getInitialData() {
  const db = await getDb();
  const scans = db.collection("scans");

  const verifiedScans = await scans
    .find<{ score?: number | null }>({ verified: true })
    .sort({ timestamp: -1 })
    .limit(50)
    .toArray();

  const totalScore = verifiedScans.reduce((sum, s) => sum + (s.score ?? 0), 0);

  const lastTen = await scans
    .find<{ image: string; actionType?: string | null; score?: number | null; timestamp?: Date }>({
      verified: true
    })
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray();

  return {
    totalScore,
    lastTen: lastTen.map((s) => ({
      image: s.image,
      actionType: s.actionType ?? "eco-action",
      score: s.score ?? 0,
      timestamp: s.timestamp?.toISOString() ?? new Date().toISOString()
    }))
  };
}

export default async function Page() {
  const { totalScore, lastTen } = await getInitialData();

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 md:px-8">
      <section className="w-full max-w-5xl space-y-8">
        <header className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-900/60 via-emerald-800/60 to-slate-900/80 p-6 md:flex-row md:p-8 eco-glow">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3">
              <Leaf className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/70">Eco-Verify</p>
              <h1 className="text-2xl font-semibold text-emerald-50 md:text-3xl">
                Gamified Sustainability Scanner
              </h1>
            </div>
          </div>
          <div className="rounded-2xl bg-black/40 px-5 py-3 text-right shadow-inner shadow-emerald-500/30">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/70">
              Global Impact Score
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-400 md:text-4xl">
              {totalScore}
            </p>
            <p className="text-xs text-emerald-200/70">Sum of all verified eco-actions</p>
          </div>
        </header>

        <EcoVerifyClient initialScans={lastTen} />
      </section>
    </main>
  );
}

