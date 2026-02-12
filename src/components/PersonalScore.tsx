'use client';

import { useEffect, useState, useCallback } from "react";
import { getUserId } from "@/lib/userId";
import { fetchPersonalStats } from "@/lib/api";

type PersonalStats = {
  userId: string;
  totalScore: number;
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

  // Shared header component - DRY principle
  const Header = () => (
    <div className="flex items-center gap-2 mb-4 opacity-80">
      <div className="w-1 h-4 bg-[var(--primary)] rounded-full" />
      <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
        Your Impact
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

      {/* Main Score */}
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[var(--foreground)] tabular-nums tracking-tight">
            {stats.totalScore.toLocaleString()}
          </span>
          <span className="text-sm text-neutral-500 font-medium">points</span>
        </div>
        <p className="text-sm text-neutral-400 mt-1">
          Across {stats.totalActions} verified action{stats.totalActions !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Average Score */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
            Avg Score
          </p>
          <p className="text-xl font-semibold text-[var(--foreground)] tabular-nums">
            {stats.averageScore}
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
            This Week
          </p>
          <p className="text-xl font-semibold text-[var(--foreground)]">
            {stats.recentActions}
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
