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
    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70 mb-3">
      Your Impact
    </p>
  );

  // Apple-inspired card: clarity + depth
  const containerClass = "apple-card p-4 md:p-5";

  if (loading) {
    return (
      <div className={containerClass}>
        <Header />
        <div className="space-y-2">
          <div className="h-8 bg-emerald-500/10 rounded-lg animate-pulse" />
          <div className="h-4 bg-emerald-500/5 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={containerClass}>
        <Header />
        <p className="text-sm text-emerald-100/60">
          Start verifying actions to see your stats!
        </p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Header />
        {stats.currentStreak > 0 && (
          <div className="rounded-full bg-emerald-500/20 px-2 py-1">
            <span className="text-xs font-semibold text-emerald-300">
              {stats.currentStreak} day{stats.currentStreak !== 1 ? 's' : ''} streak
            </span>
          </div>
        )}
      </div>

      {/* Main Score */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold tabular-nums text-emerald-400 md:text-4xl">
            {stats.totalScore}
          </p>
          <p className="text-xs text-emerald-200/70">points</p>
        </div>
        <p className="text-xs text-emerald-100/60 mt-1">
          {stats.totalActions} verified action{stats.totalActions !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Average Score */}
        <div className="rounded-[var(--apple-radius-md)] bg-black/25 p-3">
          <p className="text-[10px] uppercase tracking-[0.1em] text-emerald-200/70 mb-1">
            Average
          </p>
          <p className="text-lg font-semibold text-emerald-300 tabular-nums">
            {stats.averageScore}
          </p>
        </div>

        <div className="rounded-[var(--apple-radius-md)] bg-black/25 p-3">
          <p className="text-[10px] uppercase tracking-[0.1em] text-emerald-200/70 mb-1">
            This Week
          </p>
          <p className="text-lg font-semibold text-emerald-300">
            {stats.recentActions}
          </p>
        </div>
      </div>

      {/* Most Common Action */}
      {stats.mostCommonAction !== "none" && (
        <div className="mt-3 pt-3 border-t border-emerald-500/20">
          <p className="text-xs text-emerald-200/70 mb-1">Favorite Action</p>
          <p className="text-sm font-medium text-emerald-300 capitalize">
            {stats.mostCommonAction.replace(/-/g, ' ')}
          </p>
        </div>
      )}
    </div>
  );
}
