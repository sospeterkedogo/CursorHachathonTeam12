'use client';

import { Globe2 } from "lucide-react";

export default function MultiplierEffectSection() {
    return (
        <div className="mt-32 luxury-card p-12 md:p-20 relative overflow-hidden bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02] border-black/5 dark:border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">The Multiplier Effect</h4>
                        <h3 className="text-3xl luxury-heading italic">Small Wins. <span className="text-luxury-gold">Compounded.</span></h3>
                        <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                            A single verified action seems small. But when 10,000 citizens audit a container correctly,
                            contamination drops by 40%. This single shift increases material value by 3x.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "1 Verified Audit", value: "The Seed", detail: "Correct sorting starts at the source." },
                            { label: "1,000 Audits", value: "System Shift", detail: "Contamination levels fall below critical thresholds." },
                            { label: "1 Million+", value: "Circular Era", detail: "Waste becomes raw material. Value is recaptured." }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                    <span className="text-[8px] font-black text-emerald-500">{i + 1}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                                        <div className="h-px w-4 bg-white/10" />
                                        <span className="text-[10px] font-black text-luxury-gold uppercase tracking-widest">{step.value}</span>
                                    </div>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-light">{step.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="aspect-square rounded-full border border-white/5 flex items-center justify-center relative bg-black/[0.01] dark:bg-white/[0.01]">
                        <div className="absolute inset-0 bg-emerald-500/5 blur-[60px] animate-pulse" />
                        <div className="text-center space-y-4 relative z-10">
                            <Globe2 className="w-16 h-16 text-emerald-500/40 mx-auto mb-6" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Total Savings Goal</p>
                                <p className="text-5xl luxury-data text-neutral-900 dark:text-white">£40B</p>
                                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Global Value Recovery</p>
                            </div>
                        </div>

                        {/* Floating Labels */}
                        <div className="absolute -top-4 -right-4 p-4 luxury-card bg-black/60 backdrop-blur-md border-emerald-500/20">
                            <p className="text-[8px] font-black text-emerald-500">EFFICIENCY</p>
                            <p className="text-lg luxury-data text-white">+84%</p>
                        </div>
                        <div className="absolute -bottom-8 left-1/4 p-4 luxury-card bg-black/60 backdrop-blur-md border-luxury-gold/20">
                            <p className="text-[8px] font-black text-luxury-gold">CONTAMINATION</p>
                            <p className="text-lg luxury-data text-luxury-gold">-42%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
