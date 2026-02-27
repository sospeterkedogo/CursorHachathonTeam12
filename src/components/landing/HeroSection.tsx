'use client';

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeroSectionProps {
    isDark: boolean;
    onTryNow?: () => void;
}

export default function HeroSection({ isDark, onTryNow }: HeroSectionProps) {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleTryNow = () => {
        if (onTryNow) {
            onTryNow();
        } else {
            setIsNavigating(true);
            router.push('/verify');
        }
    };

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.03] dark:bg-emerald-500/[0.03] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-8 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8 text-left"
                >
                    <div className="space-y-5">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl luxury-heading tracking-tight leading-[1.1] pb-2">
                            Sustainability <br />
                            <span className="text-luxury-gold italic pr-4">Redefined.</span>
                        </h1>

                        <p className="text-lg md:text-xl lg:text-2xl text-neutral-500 dark:text-neutral-400 max-w-xl font-light tracking-wide leading-relaxed">
                            Stop guessing if it's eco-friendly. <br />
                            <span className="text-emerald-500 font-medium">Let our AI auditor give you the facts and the rewards.</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                        <button
                            onClick={handleTryNow}
                            disabled={isNavigating}
                            className="group relative w-full sm:w-auto px-10 py-5 rounded-2xl bg-emerald-500 text-black font-bold text-lg overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20 disabled:opacity-70"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isNavigating ? (
                                    <>Entering Audit Suite... <Loader2 className="w-5 h-5 animate-spin" /></>
                                ) : (
                                    <>Check an Item <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </span>
                        </button>

                        <button
                            onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-10 py-5 rounded-2xl luxury-card transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 font-bold text-lg text-center"
                        >
                            The Mission
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative flex justify-center lg:justify-end"
                >
                    {/* Reduced Scale Visual: App Preview */}
                    <div className="relative z-10 luxury-card p-2.5 rounded-[2.5rem] shadow-[0_0_80px_rgba(16,185,129,0.08)] bg-white/40 dark:bg-black/40 w-[240px] sm:w-[280px] md:w-[320px]">
                        <div
                            className="rounded-[2.1rem] overflow-hidden relative group w-full"
                            style={{ aspectRatio: '9/19' }}
                        >
                            <Image
                                src="/screenshots/IMG_3349.PNG"
                                alt="EcoVerify App UI"
                                fill
                                priority
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                sizes="(max-width: 768px) 240px, (max-width: 1024px) 280px, 320px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>

                        {/* Minimal Floating Elements - Scaled Down */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -left-6 p-4 luxury-card bg-white/80 dark:bg-black/80 backdrop-blur-xl border-emerald-500/20 shadow-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest leading-none mb-1">Impact Scored</p>
                                    <p className="text-sm luxury-data text-emerald-500 leading-none">Verified</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-4 -right-4 p-4 luxury-card bg-emerald-500/90 backdrop-blur-md border-white/20 shadow-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-black uppercase tracking-widest leading-none mb-1">Weekly Reward</p>
                                    <p className="text-xl luxury-data text-white leading-none">£48.20</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] -z-10 rounded-full" />
                </motion.div>
            </div>
        </section>
    );
}
