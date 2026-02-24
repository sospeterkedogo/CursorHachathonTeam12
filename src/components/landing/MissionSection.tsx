'use client';

import { Target, Rocket, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function MissionSection() {
    return (
        <section id="mission" className="max-w-6xl mx-auto px-6 py-32">
            <div className="flex flex-col lg:flex-row items-center gap-20">
                <div className="flex-1 space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3">
                            <Target className="w-4 h-4" /> The Mission
                        </h2>
                        <div className="text-sm md:text-base leading-relaxed font-light text-neutral-500 dark:text-neutral-400">
                            EcoVerify is an environmental ledger for the circular age. We believe environmental action should be as rewarding as it is impactful. Our goal is to verify <strong className="text-emerald-500 font-bold">1 Million</strong> eco-actions by 2027, creating a global standard for personal sustainability auditing.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-luxury-gold/5 dark:bg-luxury-gold/10 flex items-center justify-center">
                                <Rocket className="w-6 h-6 text-luxury-gold" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest">Why we do it</h4>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed font-light">To bridge the gap between intent and impact through gamified verification.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest">The Goal</h4>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed font-light">Creating a verifiable record of humanity's small wins for the planet.</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full lg:w-auto relative group">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="luxury-card p-2 relative overflow-hidden group shadow-2xl transition-all duration-700 border-black/5 bg-white/40 dark:border-white/5 dark:bg-black/40">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                        <Image
                            src="/screenshots/Untitled3.png"
                            alt="Auditing the Planet"
                            width={800}
                            height={600}
                            className="w-full h-auto rounded-lg grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-70 group-hover:opacity-100 shadow-2xl"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
