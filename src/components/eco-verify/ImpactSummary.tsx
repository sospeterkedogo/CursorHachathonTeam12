import React from "react";
import { Globe, Trophy } from "lucide-react";
import { formatCompactNumber } from "@/lib/format";

interface GlobalBannerProps {
    globalScore: number; // This will trigger points
    globalCO2: number;
    userRank: number | null;
}

export const GlobalBanner: React.FC<GlobalBannerProps> = ({ globalScore, globalCO2, userRank }) => {
    return (
        <div className="bg-emerald-500 text-white rounded-2xl p-4 shadow-lg shadow-emerald-500/20 relative overflow-hidden mb-4">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe className="w-24 h-24" />
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1 opacity-80">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Global Impact</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-2xl font-black tabular-nums tracking-tight">
                            {formatCompactNumber(globalCO2)}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                            mg CO2 Saved
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-black tabular-nums tracking-tight">
                            {formatCompactNumber(globalScore)}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                            Global Points
                        </div>
                    </div>
                </div>

                {userRank && (
                    <div className="absolute top-4 right-4 text-right">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block">Rank</span>
                        <span className="text-xl font-black">#{userRank}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

interface GoalCardProps {
    userScore: number;
    className?: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({ userScore, className = "" }) => {
    // Derive Points from User Score (which is mg CO2). 
    // Wait, `userScore` prop usually comes from `totalScore` in DB.
    // If DB `totalScore` acts as Points now (per my route.ts update where `score = points`), then `userScore` IS points.
    // But previously it was mg.
    // The route update sets `score` (points) and `co2_saved` (mg).

    // EXISTING USERS: Their `totalScore` is accumulated mg.
    // NEW SCANS: `score` will be smaller (mg/100).
    // This creates a data mismatch. 
    // Ideally I should migrate legacy scores: `totalScore = totalScore / 100`.
    // For now, let's treat `userScore` as POINTS.

    // Dynamic Goal Logic: Nearest 100 block above userScore
    const step = 100;
    const currentGoal = Math.ceil((userScore + 1) / step) * step;
    const progress = Math.min((userScore / currentGoal) * 100, 100);

    return (
        <div className={`bg-blue-500/5 border border-blue-500/10 rounded-2xl p-3 ${className}`}>
            <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Trophy className="w-3 h-3 text-blue-500" />
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Next Goal</span>
                    </div>
                    <span className="text-sm font-bold text-neutral-800 dark:text-white">
                        <span className="text-blue-500">{userScore}</span>/{currentGoal} pts
                    </span>
                </div>
                {/* 
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    Unlock Voucher
                </span>
                */}
            </div>

            <div className="h-2 w-full bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden border border-neutral-200 dark:border-white/5">
                <div
                    className="h-full bg-blue-500 transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="text-[10px] text-neutral-400 mt-2 font-medium text-right">
                {currentGoal - userScore} pts to go
            </p>
        </div>
    );
};

// Keep ImpactSummary for backward compatibility if needed, but we will use components directly
export const ImpactSummary: React.FC<GlobalBannerProps & GoalCardProps> = (props) => {
    return (
        <div className="flex flex-col">
            <GlobalBanner globalScore={props.globalScore} globalCO2={props.globalCO2} userRank={props.userRank} />
            <GoalCard userScore={props.userScore} />
        </div>
    );
};
