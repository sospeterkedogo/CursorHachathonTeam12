import { getDb } from "@/lib/mongodb";
import EcoVerifyClient from "@/components/EcoVerifyClient";

async function getInitialData() {
  try {
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
  } catch (error) {
    console.error("Error fetching initial data:", error);
    // Return empty data on error so the page still loads
    return {
      totalScore: 0,
      lastTen: []
    };
  }
}

export default async function Page() {
  const { totalScore, lastTen } = await getInitialData();

  return (
    <main className="flex min-h-screen flex-col items-center px-3 py-6 sm:px-4 sm:py-8">
      <section className="w-full max-w-[468px] sm:max-w-[630px] space-y-6 sm:space-y-8">
        <EcoVerifyClient
          initialTotalScore={totalScore}
          initialScans={lastTen}
        />
      </section>
    </main>
  );
}

