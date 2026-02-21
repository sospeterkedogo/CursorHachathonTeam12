import React from "react";
import { Globe, Trophy, Zap, TreePine, Sparkles } from "lucide-react";
import { formatCompactNumber } from "@/lib/format";
import { motion } from "framer-motion";

interface GlobalBannerProps {
    globalScore: number;
    globalCO2: number;
    userRank: number | null;
}

export const GlobalBanner: React.FC<GlobalBannerProps> = ({ globalScore, globalCO2, userRank }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 mb-6"
        >
            <div className="luxury-card bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/20 p-5 sm:p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-[2s]">
                    <Globe className="w-48 h-48 text-emerald-500" />
                </div>

                <div className="relative z-10 flex flex-col gap-6 sm:gap-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">Global Impact</span>
                        </div>
                        {userRank && (
                            <div className="text-right">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 block mb-1">Global Standing</span>
                                <span className="text-2xl sm:text-3xl luxury-data text-white">#{userRank}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:gap-12">
                        <div className="space-y-1 sm:space-y-2">
                            <div className="text-3xl sm:text-5xl luxury-data text-white drop-shadow-lg">
                                {formatCompactNumber(globalCO2)}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                                    mg CO2 Saved
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <div className="text-3xl sm:text-5xl luxury-data text-luxury-gold drop-shadow-lg">
                                {formatCompactNumber(globalScore)}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-luxury-gold rounded-full" />
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                                    Community Points
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <GlobalMilestones globalCO2={globalCO2} />
        </motion.div>
    );
};

interface GlobalMilestonesProps {
    globalCO2: number;
}

export const GlobalMilestones: React.FC<GlobalMilestonesProps> = ({ globalCO2 }) => {
    const milestones = [
        { limit: 10000, label: "Offset Hackathon", icon: <Zap className="w-3 h-3" /> },
        { limit: 100000, label: "Plant 10 Trees", icon: <TreePine className="w-3 h-3" /> },
        { limit: 1000000, label: "Unlock 'Aura'", icon: <Sparkles className="w-3 h-3" /> },
    ];

    const currentMilestone = milestones.find(m => globalCO2 < m.limit) || milestones[milestones.length - 1];
    const prevLimit = milestones[milestones.indexOf(currentMilestone) - 1]?.limit || 0;
    const progress = Math.min(((globalCO2 - prevLimit) / (currentMilestone.limit - prevLimit)) * 100, 100);

    return (
        <div className="luxury-card bg-luxury-glass p-6 border-white/5">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        {currentMilestone.icon}
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Next Community Milestone</span>
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                    {currentMilestone.label}
                </span>
            </div>

            <div className="relative h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                />
            </div>

            <div className="flex justify-between mt-3">
                <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
                    {formatCompactNumber(currentMilestone.limit - globalCO2)} mg Remaining
                </p>
                <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest luxury-data">
                    {Math.round(progress)}%
                </p>
            </div>
        </div>
    );
};

interface GoalCardProps {
    userScore: number;
    className?: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({ userScore, className = "" }) => {
    const milestones = [
        { limit: 100, label: "Eco-Novice", reward: "Digital Badge 🏅" },
        { limit: 500, label: "Planet Advocate", reward: "15% Voucher 🎫" },
        { limit: 1000, label: "Carbon Neutral", reward: "Founders Wall 🏛️" },
    ];

    const currentMilestone = milestones.find(m => userScore < m.limit) || milestones[milestones.length - 1];
    const prevLimit = milestones[milestones.indexOf(currentMilestone) - 1]?.limit || 0;
    const progress = Math.min(((userScore - prevLimit) / (currentMilestone.limit - prevLimit)) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`luxury-card bg-luxury-glass p-8 border-white/5 flex flex-col justify-between ${className}`}
        >
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 opacity-60 mb-1">
                            <Trophy className="w-3 h-3 text-luxury-gold" />
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Personal Odyssey</span>
                        </div>
                        <h3 className="text-2xl luxury-heading text-white">{currentMilestone.label}</h3>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Reward</span>
                        <div className="bg-luxury-gold/10 px-4 py-2 rounded-2xl border border-luxury-gold/20">
                            <span className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest">
                                {currentMilestone.reward}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[24px] luxury-data text-white">{userScore} <span className="text-xs text-neutral-500 uppercase font-black">pts</span></span>
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{currentMilestone.limit} Goal</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-luxury-gold to-yellow-200"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
                    {currentMilestone.limit - userScore > 0
                        ? `Magnificent effort. Acquire ${currentMilestone.limit - userScore} more points to unlock the next level.`
                        : "You have achieved environmental transcendence. 🏛️"}
                </p>
            </div>
        </motion.div>
    );
};

export const ImpactSummary: React.FC<GlobalBannerProps & GoalCardProps> = (props) => {
    return (
        <div className="flex flex-col gap-6">
            <GlobalBanner globalScore={props.globalScore} globalCO2={props.globalCO2} userRank={props.userRank} />
            <GoalCard userScore={props.userScore} />
        </div>
    );
};
