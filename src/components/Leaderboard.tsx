"use client";

import { Trophy, Medal, User, Loader2 } from "lucide-react";

type LeaderboardEntry = {
    rank?: number;
    userId: string;
    username: string;
    avatar: string;
    totalScore: number;
};

type Props = {
    entries: LeaderboardEntry[];
    currentUserId: string | null;
    loading?: boolean;
};

export default function Leaderboard({ entries, currentUserId, loading }: Props) {
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
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Global Leaderboard
                </h2>
            </div>

            <div className="flex flex-col max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar divide-y divide-neutral-200/10 dark:divide-white/5">
                {entries.map((user, index) => {
                    const rank = index + 1;
                    const isCurrentUser = user.userId === currentUserId;

                    let rankIcon;
                    if (rank === 1) rankIcon = <Medal className="w-5 h-5 text-yellow-500" />;
                    else if (rank === 2) rankIcon = <Medal className="w-5 h-5 text-neutral-400" />;
                    else if (rank === 3) rankIcon = <Medal className="w-5 h-5 text-amber-700" />;
                    else rankIcon = <span className="font-mono font-bold text-neutral-500 w-5 text-center">{rank}</span>;

                    return (
                        <div
                            key={user.userId}
                            className={`flex items-center gap-4 p-3 transition-all ${isCurrentUser
                                ? "bg-emerald-500/10 border-l-4 border-emerald-500"
                                : "hover:bg-white/5"
                                }`}
                        >
                            <div className="flex-shrink-0 w-8 flex items-center justify-center">
                                {rankIcon}
                            </div>

                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-lg overflow-hidden border border-emerald-500/20">
                                {user.avatar || <User className="w-5 h-5 text-emerald-500" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold truncate ${isCurrentUser ? "text-emerald-500" : ""}`}>
                                    {user.username}
                                    {isCurrentUser && <span className="ml-2 text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-500 uppercase tracking-wide">You</span>}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold tabular-nums text-lg">{user.totalScore.toLocaleString()}</p>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Points</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
