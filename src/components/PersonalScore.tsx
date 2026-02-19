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
      <div className="w-1 h-4 bg-[var(--primary)] rounded-full" />
      <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
        My Impact
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="glass-panel p-6 animate-pulse">
        <div className="h-4 w-24 bg-white/10 rounded mb-6" />
        <div className="space-y-3">
          <div className="h-20 bg-white/5 rounded-xl" />
          <div className="h-20 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="glass-panel p-6 text-center">
        <Header />
        <p className="text-sm text-neutral-500 py-4">
          Start verifying actions to unlock your personal stats.
        </p>
      </div>
    );
  }

  // Use new fields if available, fall back to totalScore for legacy
  const points = stats.totalPoints !== undefined ? stats.totalPoints : stats.totalScore;
  const impact = stats.totalCO2 !== undefined ? stats.totalCO2 : stats.totalScore; // Fallback assumes legacy score was mg

  return (
    <div className="glass-panel p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Header />
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20">
            <span className="text-xs font-bold">
              {stats.currentStreak} Day Streak 🔥
            </span>
          </div>
        )}
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Points Card */}
        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
          <p className="text-[10px] uppercase tracking-wider text-emerald-600/60 dark:text-emerald-400/60 font-bold mb-1">
            Eco Points
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatPoints(points)}
            </span>
            <span className="text-xs font-medium text-emerald-600/60 dark:text-emerald-400/60">pts</span>
          </div>
        </div>

        {/* Impact Card */}
        <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10">
          <p className="text-[10px] uppercase tracking-wider text-blue-600/60 dark:text-blue-400/60 font-bold mb-1">
            CO2 Offset
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {formatCO2(impact)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Actions Count */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
            Total Actions
          </p>
          <p className="text-xl font-semibold text-[var(--foreground)] tabular-nums">
            {stats.totalActions}
          </p>
        </div>

        {/* Avg Score (Points) */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
            Avg Points
          </p>
          <p className="text-xl font-semibold text-[var(--foreground)]">
            {stats.averageScore}
          </p>
        </div>
      </div>

      {/* Most Common Action */}
      {stats.mostCommonAction !== "none" && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">Favorite Action</span>
            <span className="text-sm font-medium text-[var(--primary)] capitalize">
              {stats.mostCommonAction.replace(/-/g, ' ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
