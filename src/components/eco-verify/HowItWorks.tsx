import React from 'react';
import { Camera, Sparkles, Trophy, Info, ShieldCheck } from 'lucide-react';

export const HowItWorks = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`luxury-card p-4 sm:p-6 bg-luxury-glass border-white/5 relative overflow-hidden group ${className}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                <span className="text-[9px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Audit Protocol</span>
            </div>

            <div className="flex items-center justify-between relative px-1 sm:px-2 gap-2 sm:gap-4">
                {/* Connecting Line */}
                <div className="absolute top-3.5 sm:top-4 left-6 right-6 h-px bg-white/5 -z-10" />

                {/* Step 1 */}
                <div className="flex flex-col items-center gap-2 sm:gap-3 relative z-10 group/step">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/5 group-hover/step:scale-110 transition-transform duration-500">
                        <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[7px] sm:text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] opacity-60 group-hover/step:opacity-100 transition-opacity">Capture</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-2 sm:gap-3 relative z-10 group/step">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold shadow-2xl shadow-luxury-gold/5 group-hover/step:scale-110 transition-transform duration-500">
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[7px] sm:text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] opacity-60 group-hover/step:opacity-100 transition-opacity">Analyze</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-2 sm:gap-3 relative z-10 group/step">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/5 group-hover/step:scale-110 transition-transform duration-500">
                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[7px] sm:text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] opacity-60 group-hover/step:opacity-100 transition-opacity">Ascend</span>
                </div>
            </div>
        </div>
    );
};
