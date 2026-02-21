import React, { useState } from 'react';
import { Camera, Sparkles, Trophy, ChevronDown, ChevronUp, Info } from 'lucide-react';

export const HowItWorks = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`bg-neutral-100/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 rounded-2xl p-3 ${className}`}>
            <div className="flex items-center gap-2 mb-3">
                <Info className="w-3 h-3 text-neutral-400" />
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">How It Works</span>
            </div>

            <div className="flex items-center justify-between relative px-2">
                {/* Connecting Line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-200 dark:bg-white/10 -z-10" />

                {/* Step 1 */}
                <div className="flex flex-col items-center gap-1 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm text-[10px] font-bold">
                        1
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">Scan Waste</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm text-[10px] font-bold">
                        2
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">Audit AI</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm text-[10px] font-bold">
                        3
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">Earn Pts</span>
                </div>
            </div>
        </div>
    );
};
