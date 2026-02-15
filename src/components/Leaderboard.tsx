"use client";

import { Trophy, Medal, User, Loader2 } from "lucide-react";

import { LeaderboardProps } from "@/types";

export default function Leaderboard({ entries, currentUserId, loading }: LeaderboardProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-amber-500/50" />
                <p>Scaling the heights...</p>
                <p className="text-sm">Fetching global rankings</p>
            </div>
        );
    }
    // If no entries, show empty state
    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <Trophy className="w-12 h-12 mb-4 opacity-20" />
                <p>No verified champions yet.</p>
                <p className="text-sm">Be the first to claim the throne!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="glass-panel overflow-hidden border-none shadow-xl">
                <div className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar divide-y divide-neutral-100/5 dark:divide-white/5">
                    {entries.map((user, index) => {
                        const rank = index + 1;
                        const isCurrentUser = user.userId === currentUserId;

                        let rankColor;
                        if (rank === 1) rankColor = "text-amber-400";
                        else if (rank === 2) rankColor = "text-neutral-400";
                        else if (rank === 3) rankColor = "text-amber-700";
                        else rankColor = "text-neutral-500";

                        return (
                            <div
                                key={user.userId}
                                className={`flex items-center gap-4 p-4 transition-all animate-slide-up ${isCurrentUser
                                    ? "bg-emerald-500/10"
                                    : "hover:bg-white/5"
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className={`flex-shrink-0 w-8 font-black text-center ${rankColor}`}>
                                    {rank}
                                </div>

                                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xl overflow-hidden border-2 border-white/10 shadow-sm relative group">
                                    {user.avatar || <User className="w-6 h-6 text-neutral-400" />}
                                    {isCurrentUser && <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-pulse" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold truncate ${isCurrentUser ? "text-emerald-500" : "text-neutral-800 dark:text-neutral-200"}`}>
                                        {user.username}
                                        {isCurrentUser && <span className="ml-2 text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                                    </p>
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Eco Champion</p>
                                </div>

                                <div className="text-right">
                                    <p className="font-black tabular-nums text-lg text-emerald-500">{user.totalScore.toLocaleString()}</p>
                                    <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">Points</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
