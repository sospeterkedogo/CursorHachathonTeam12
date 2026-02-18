import React, { useState } from "react";
import { ChevronDown, ChevronUp, Globe, Trophy } from "lucide-react";

interface ImpactSummaryProps {
    globalScore: number;
    userScore: number;
    userRank: number | null;
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({ globalScore, userScore, userRank }) => {
    const [expandedSection, setExpandedSection] = useState<'global' | 'goal' | null>(null);

    // Dynamic Goal Logic: Nearest 500 block above userScore
    const step = 500;
    const currentGoal = Math.ceil((userScore + 1) / step) * step;
    const progress = Math.min((userScore / currentGoal) * 100, 100);

    const toggleSection = (section: 'global' | 'goal') => {
        setExpandedSection(prev => prev === section ? null : section);
    };

    return (
        <div className="flex flex-col gap-4 mb-6 animate-fade-in">
            <div className="flex gap-3">
                {/* Global Impact Button */}
                <button
                    onClick={() => toggleSection('global')}
                    className={`flex-1 flex items-center justify-between p-3 rounded-2xl transition-all ${expandedSection === 'global' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20'}`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${expandedSection === 'global' ? 'bg-white/20' : 'bg-emerald-500/10'}`}>
                            <Globe className={`w-4 h-4 ${expandedSection === 'global' ? 'text-white' : 'text-emerald-500'}`} />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${expandedSection === 'global' ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                            Global
                        </span>
                    </div>
                    {expandedSection === 'global' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                </button>

                {/* Goal Progress Button */}
                <button
                    onClick={() => toggleSection('goal')}
                    className={`flex-1 flex items-center justify-between p-3 rounded-2xl transition-all ${expandedSection === 'goal' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20'}`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${expandedSection === 'goal' ? 'bg-white/20' : 'bg-blue-500/10'}`}>
                            <Trophy className={`w-4 h-4 ${expandedSection === 'goal' ? 'text-white' : 'text-blue-500'}`} />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${expandedSection === 'goal' ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                            My Goal
                        </span>
                    </div>
                    {expandedSection === 'goal' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                </button>
            </div>

            {/* Collapsible Content: Global */}
            {expandedSection === 'global' && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 animate-slide-up">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Community Score</span>
                        <span className="text-2xl font-black text-emerald-500 tabular-nums">{globalScore.toLocaleString()}</span>
                    </div>
                    {userRank && (
                        <div className="flex items-center justify-between border-t border-emerald-500/10 pt-2">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Your Global Rank</span>
                            <span className="text-lg font-black text-neutral-800 dark:text-neutral-200">#{userRank}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Collapsible Content: Goal */}
            {expandedSection === 'goal' && (
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 animate-slide-up">
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Next Reward</span>
                            <span className="text-sm font-bold text-neutral-800 dark:text-white">
                                <span className="text-blue-500">{userScore}</span>/{currentGoal} Points
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                            Unlock Voucher
                        </span>
                    </div>

                    <div className="h-3 w-full bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden border border-neutral-200 dark:border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                    </div>

                    <p className="text-[10px] text-neutral-500 mt-2 font-medium">
                        {currentGoal - userScore} more points to reach your next goal!
                    </p>
                </div>
            )}
        </div>
    );
};
