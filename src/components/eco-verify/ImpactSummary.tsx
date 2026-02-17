import React from "react";

interface ImpactSummaryProps {
    globalScore: number;
    userRank: number | null;
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({ globalScore, userRank }) => (
    <div className="flex items-center justify-between bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 mb-6 animate-fade-in shadow-sm">
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Global Impact</span>
            <span className="text-2xl font-black text-emerald-500 tabular-nums">
                {globalScore.toLocaleString()}
            </span>
        </div>
        {userRank && (
            <div className="text-right">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Global Rank</span>
                <div className="flex items-center justify-end gap-1">
                    <span className="text-xl font-black text-neutral-800 dark:text-neutral-200">#{userRank}</span>
                </div>
            </div>
        )}
    </div>
);
