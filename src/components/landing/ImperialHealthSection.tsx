'use client';

import { Zap, Smartphone, Timer } from "lucide-react";
import Image from "next/image";

export default function ImperialHealthSection() {
    return (
        <section id="health" className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5 relative overflow-hidden">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] -z-10" />

            <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
                <div className="lg:w-1/2 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3">
                            <Zap className="w-4 h-4" /> Imperial Health
                        </h2>
                        <h3 className="text-4xl md:text-5xl luxury-heading leading-tight italic">Passive Impact. <br /> Total Privacy.</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                            The upcoming Imperial Mobile app integrates directly with your existing fitness ecosystem.
                            Automatically audit your daily activity and earn rewards for low-carbon transportation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest">Global Ecosystem</h4>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-light leading-relaxed">Connect Google Fit, Apple Health, Fitbit, and Garmin effortlessly.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                <Timer className="w-5 h-5 text-luxury-gold" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest">Passive Milestones</h4>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-light leading-relaxed">Earn <strong className="text-luxury-gold">+50 Imperial Points</strong> automatically for every 6,000 steps walked daily.</p>
                        </div>
                    </div>

                    <div className="p-6 luxury-card border-emerald-500/20 bg-emerald-500/10 dark:border-emerald-500/10 dark:bg-emerald-500/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center shrink-0">
                            <Zap className="w-6 h-6 text-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[11px] font-medium tracking-wide uppercase italic">Runs in the background. Audits while you live. Zero effort sustainability.</p>
                    </div>
                </div>

                <div className="lg:w-1/2 w-full">
                    <div className="luxury-card border-black/5 bg-white/40 dark:border-white/5 dark:bg-black/40 p-2 relative overflow-hidden group shadow-2xl transition-all duration-700">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                        <Image
                            src="/screenshots/Untitled2.png"
                            alt="Imperial Profile"
                            width={800}
                            height={1000}
                            className="w-full h-auto rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
