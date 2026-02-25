"use client";

import { Trophy, Medal, User, Loader2, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { LeaderboardProps } from "@/types";
import { EcoOrb } from "./eco-verify/EcoOrb";

export default function Leaderboard({ entries, currentUserId, loading }: LeaderboardProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 opacity-50">
                <Loader2 className="w-10 h-10 mb-6 animate-spin text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Retrieving Rankings...</p>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="luxury-card p-20 text-center opacity-40 border-dashed border-white/10">
                <Trophy className="w-12 h-12 mb-6 mx-auto text-neutral-600" />
                <p className="luxury-heading text-neutral-500 text-sm uppercase tracking-[0.2em]">The Arena is Dormant</p>
                <p className="text-[8px] text-neutral-600 mt-4 uppercase tracking-[0.5em]">Initiate an audit to claim the throne</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Community Leaderboard</h3>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="luxury-card bg-luxury-glass overflow-hidden border-white/5"
            >
                <div className="flex flex-col divide-y divide-white/5">
                    {entries.map((user, index) => {
                        const rank = index + 1;
                        const isCurrentUser = user.userId === currentUserId;

                        let rankColor;
                        let rankIcon = null;
                        if (rank === 1) {
                            rankColor = "text-luxury-gold";
                            rankIcon = <Sparkles className="w-3 h-3 ml-1 inline animate-pulse" />;
                        }
                        else if (rank === 2) rankColor = "text-neutral-300";
                        else if (rank === 3) rankColor = "text-amber-700";
                        else rankColor = "text-neutral-500";

                        return (
                            <motion.div
                                key={user.userId}
                                variants={itemVariants}
                                className={`flex items-center gap-6 p-6 transition-all duration-500 ${isCurrentUser
                                    ? "bg-emerald-500/5 relative"
                                    : "hover:bg-white/[0.02]"
                                    }`}
                            >
                                {isCurrentUser && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-xl shadow-emerald-500" />
                                )}

                                <div className={`flex-shrink-0 w-8 luxury-data text-xl text-center ${rankColor}`}>
                                    {rank}
                                </div>

                                <div className="flex-shrink-0">
                                    <EcoOrb id={user.avatar || (index === 0 ? "emerald" : index === 1 ? "silver" : index === 2 ? "amber" : "sapphire")} size="lg" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-base sm:text-xl luxury-heading truncate ${isCurrentUser ? "text-white" : "text-neutral-300"}`}>
                                            {user.username}
                                        </p>
                                        {rankIcon}
                                        {isCurrentUser && (
                                            <span className="text-[7px] sm:text-[8px] bg-emerald-500 text-white font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">You</span>
                                        )}
                                    </div>
                                    <p className="text-[8px] sm:text-[9px] text-neutral-600 font-black uppercase tracking-[0.3em] mt-0.5 sm:mt-1 shrink-0">
                                        {rank <= 3 ? "Impact Star" : "Contributor"}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="luxury-data text-xl sm:text-2xl text-emerald-500 leading-none mb-1">
                                        {user.totalScore.toLocaleString()}
                                    </p>
                                    <p className="text-[7px] sm:text-[8px] text-neutral-600 font-black uppercase tracking-widest leading-none">Eco Points</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
