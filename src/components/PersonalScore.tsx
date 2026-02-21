'use client';

import { useEffect, useState, useCallback } from "react";
import { getUserId } from "@/lib/userId";
import { fetchPersonalStats } from "@/lib/api";

import { formatCO2, formatPoints } from "@/lib/format";

type PersonalStats = {
  userId: string;
  totalScore: number; // Legacy/Compats
  totalPoints: number; // NEW
  totalCO2: number;    // NEW
  totalActions: number;
  averageScore: number;
  mostCommonAction: string;
  currentStreak: number;
  recentActions: number;
  actionTypes: Record<string, number>;
  lastActionDate: string | null;
};

export default function PersonalScore() {
  const [stats, setStats] = useState<PersonalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Single fetch function used for both initial load and refresh
  const loadStats = useCallback(async () => {
    try {
      const userId = getUserId();
      const data = await fetchPersonalStats(userId);
      setStats(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching personal stats:", err);
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Expose refresh function via custom event (cleaner than window global)
  useEffect(() => {
    const handleRefresh = () => loadStats();
    window.addEventListener('refreshPersonalStats', handleRefresh);
    return () => window.removeEventListener('refreshPersonalStats', handleRefresh);
  }, [loadStats]);

  const Header = () => (
    <div className="flex items-center gap-2 mb-4 opacity-80">
      <div className="w-1 h-3 sm:h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-500 font-bold">
        Personal Ledger
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="luxury-card p-6 animate-pulse border-white/5">
        <div className="h-3 w-20 bg-white/5 rounded mb-6" />
        <div className="space-y-3">
          <div className="h-20 bg-white/5 rounded-xl sm:rounded-2xl" />
          <div className="h-20 bg-white/5 rounded-xl sm:rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="luxury-card p-6 text-center border-white/5">
        <Header />
        <p className="text-xs sm:text-sm text-neutral-500 py-4 font-medium uppercase tracking-widest opacity-60">
          Verify records to initialize ledger.
        </p>
      </div>
    );
  }

  // Use new fields if available, fall back to totalScore for legacy
  const points = stats.totalPoints !== undefined ? stats.totalPoints : stats.totalScore;
  const impact = stats.totalCO2 !== undefined ? stats.totalCO2 : stats.totalScore; // Fallback assumes legacy score was mg

  return (
    <div className="luxury-card p-5 sm:p-6 bg-luxury-glass border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Header />
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-1.5 bg-luxury-gold/10 text-luxury-gold px-3 py-1 rounded-full border border-luxury-gold/20 shadow-lg shadow-luxury-gold/5">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
              {stats.currentStreak} Day Continuity 🔥
            </span>
          </div>
        )}
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {/* Points Card */}
        <div className="bg-emerald-500/5 rounded-xl sm:rounded-2xl p-4 border border-emerald-500/10 group transition-all duration-500 hover:bg-emerald-500/10">
          <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-emerald-500/60 font-black mb-1.5 sm:mb-2">
            Eco Credits
          </p>
          <div className="flex items-baseline gap-0.5 sm:gap-1">
            <span className="text-xl sm:text-2xl luxury-data text-emerald-500">
              {formatPoints(points)}
            </span>
            <span className="text-[7px] sm:text-[8px] font-black text-emerald-500/60 uppercase">pts</span>
          </div>
        </div>

        {/* Impact Card */}
        <div className="bg-blue-500/5 rounded-xl sm:rounded-2xl p-4 border border-blue-500/10 group transition-all duration-500 hover:bg-blue-500/10">
          <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-blue-400/60 font-black mb-1.5 sm:mb-2">
            CO2 Offset
          </p>
          <div className="flex items-baseline gap-0.5 sm:gap-1">
            <span className="text-lg sm:text-xl luxury-data text-blue-400">
              {formatCO2(impact)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Actions Count */}
        <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
          <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-black mb-1.5 sm:mb-2">
            Verifications
          </p>
          <p className="text-lg sm:text-xl luxury-data text-neutral-200">
            {stats.totalActions}
          </p>
        </div>

        {/* Avg Score (Points) */}
        <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
          <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-black mb-1.5 sm:mb-2">
            Avg Yield
          </p>
          <p className="text-lg sm:text-xl luxury-data text-neutral-200">
            {stats.averageScore}
          </p>
        </div>
      </div>

      {/* Most Common Action */}
      {stats.mostCommonAction !== "none" && (
        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[8px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-widest">Favoured Action</span>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-500/70 uppercase tracking-widest">
              {stats.mostCommonAction.replace(/-/g, ' ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
