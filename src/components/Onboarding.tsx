"use client";

import { useState } from "react";
import { Leaf, Camera, Trophy, ArrowRight, Check, Sparkles, Globe, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingProps } from "@/types";

const SLIDES = [
    {
        id: "welcome",
        title: "The Luxury of Sustainability",
        description: "Welcome to an elite league of ecological auditors. Where conservation meets sophisticated verification.",
        icon: Globe,
        color: "text-emerald-500",
        accent: "bg-emerald-500/10",
    },
    {
        id: "verify",
        title: "Elemental Auditing",
        description: "Our advanced vision system meticulously validates your environmental contributions with precision.",
        icon: Camera,
        color: "text-blue-500",
        accent: "bg-blue-500/10",
    },
    {
        id: "earn",
        title: "Acurate Prestige",
        description: "Ascend through the ranks of the Imperial Ledger. Earn exclusive rewards for your environmental mastery.",
        icon: Trophy,
        color: "text-luxury-gold",
        accent: "bg-luxury-gold/10",
    },
];

export default function Onboarding({ onComplete, totalVerifiedUsers, totalVouchers }: OnboardingProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide((prev) => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsExiting(true);
        setTimeout(() => {
            onComplete();
        }, 800);
    };

    const SlideIcon = SLIDES[currentSlide].icon;

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
                >
                    <div className="w-full max-w-lg p-10">
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="luxury-card bg-luxury-glass p-12 min-h-[550px] flex flex-col relative overflow-hidden border-white/5"
                        >
                            {/* Decorative background flare */}
                            <motion.div
                                key={`flare-${currentSlide}`}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 0.1, scale: 1.2 }}
                                transition={{ duration: 1.5 }}
                                className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] ${SLIDES[currentSlide].accent}`}
                            />

                            <button
                                onClick={handleComplete}
                                className="absolute top-8 right-8 text-[10px] font-black text-neutral-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
                            >
                                Skip
                            </button>

                            <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-luxury-glass border border-white/10 flex items-center justify-center mb-10 shadow-2xl relative">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50" />
                                            <SlideIcon className={`w-10 h-10 ${SLIDES[currentSlide].color}`} />
                                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-luxury-gold opacity-40 animate-pulse" />
                                        </div>

                                        <h2 className="text-4xl luxury-heading text-white mb-6 leading-tight">
                                            {SLIDES[currentSlide].title}
                                        </h2>
                                        <p className="text-neutral-400 font-light leading-relaxed max-w-[320px] text-lg">
                                            {SLIDES[currentSlide].description}
                                        </p>

                                        {currentSlide === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="mt-10 pt-8 border-t border-white/5 w-full"
                                            >
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                                                    Historical Influence: <span className="text-white">{totalVouchers.toLocaleString()}</span> Archives
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="mt-16 flex flex-col items-center gap-10">
                                <div className="flex gap-4">
                                    {SLIDES.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-0.5 rounded-full transition-all duration-700 ${idx === currentSlide ? "w-10 bg-emerald-500" : "w-2 bg-white/10"}`}
                                        />
                                    ))}
                                </div>

                                <div className="w-full flex flex-col items-center gap-4">
                                    <button
                                        onClick={handleNext}
                                        className="action-button group w-full max-w-[280px] bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02] shadow-2xl shadow-emerald-900/40 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <span className="text-sm font-black uppercase tracking-[0.2em]">
                                            {currentSlide === SLIDES.length - 1 ? "Begin Audit" : "Continue"}
                                        </span>
                                        {currentSlide === SLIDES.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                    </button>

                                    {currentSlide === SLIDES.length - 1 && (
                                        <button
                                            onClick={() => {
                                                localStorage.setItem("eco-hide-onboarding", "true");
                                                handleComplete();
                                            }}
                                            className="text-[9px] font-black text-neutral-600 hover:text-neutral-400 uppercase tracking-[0.2em] transition-colors"
                                        >
                                            Finalize Participation
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
