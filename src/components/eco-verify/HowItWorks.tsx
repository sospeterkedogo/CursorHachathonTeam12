import React, { useState } from 'react';
import { Camera, Sparkles, Trophy, ChevronDown, ChevronUp, Info } from 'lucide-react';

export const HowItWorks = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4 flex flex-col items-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors bg-neutral-100 dark:bg-white/5 px-4 py-2 rounded-full border border-neutral-200 dark:border-white/5 active:scale-95"
            >
                <Info className="w-3 h-3" />
                <span>How it Works</span>
                {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {isOpen && (
                <div className="w-full mt-6 px-2 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="flex items-start justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-10 right-10 h-0.5 bg-neutral-200 dark:bg-white/10 -z-10" />

                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-2 flex-1 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                                <Camera className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">Snap</span>
                                <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Capture your<br />green deed</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-2 flex-1 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">AI Verify</span>
                                <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Get instant<br />feedback</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center gap-2 flex-1 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">Earn</span>
                                <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Unlock rewards<br />& badges</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
