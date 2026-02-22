import { getDb } from "@/lib/mongodb";
import LandingPage from "@/components/LandingPage";

export const dynamic = 'force-dynamic';

async function getLandingData() {
  try {
    const db = await getDb();

    // Global Stats
    const globalPointsAgg = await db.collection("users").aggregate([
      { $group: { _id: null, total: { $sum: "$totalScore" } } }
    ]).toArray();
    const totalScore = globalPointsAgg[0]?.total || 0;

    const globalCO2Agg = await db.collection("users").aggregate([
      { $group: { _id: null, total: { $sum: "$totalCO2" } } }
    ]).toArray();
    const totalGlobalCO2 = globalCO2Agg[0]?.total || 0;

    const totalVerifiedUsers = await db.collection("users").countDocuments({ totalScore: { $gt: 0 } });
    const totalVouchers = await db.collection("vouchers").countDocuments({});

    // Community Proof (Recent verified scans)
    const communityScans = await db.collection("scans")
      .find({
        verified: true,
        isPublic: { $ne: false },
        message: {
          $exists: true,
          $ne: ""
        }
      })
      .sort({ timestamp: -1 })
      .limit(12)
      .toArray();

    return {
      stats: {
        totalScore,
        totalGlobalCO2,
        totalVerifiedUsers,
        totalVouchers
      },
      communityScans: communityScans.map(s => ({
        id: s._id.toString(),
        image: s.image,
        actionType: s.actionType,
        message: s.message,
        username: s.username,
        avatar: s.avatar,
        score: s.score || 0,
        co2_saved: s.co2_saved || 0
      }))
    };
  } catch (error) {
    console.error("Error fetching landing data:", error);
    return {
      stats: { totalScore: 0, totalGlobalCO2: 0, totalVerifiedUsers: 0, totalVouchers: 0 },
      communityScans: []
    };
  }
}

export default async function Page() {
  const data = await getLandingData();
  return <LandingPage {...data} />;
}
