"use client";

import { useState } from "react";
import { Leaf, Camera, Trophy, ArrowRight, Check } from "lucide-react";

type OnboardingProps = {
    onComplete: () => void;
    totalVerifiedUsers: number;
    totalVouchers: number;
};

const SLIDES = [
    {
        id: "welcome",
        title: "Welcome to Eco-Verify",
        description: "Join a growing community of climate champions. Turn your daily habits into verified impact points.",
        icon: Leaf,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        id: "verify",
        title: "Snap & Verify",
        description: "Simply take a photo of your action and verify it.",
        icon: Camera,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        id: "earn",
        title: "Earn & Compete",
        description: "Get accurate points for every action. Earn vouchers and climb the global leaderboard.",
        icon: Trophy,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
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
        }, 500); // 500ms for exit animation
    };

    const SlideIcon = SLIDES[currentSlide].icon;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isExiting ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
            <div className="w-full max-w-md p-6">
                <div className="relative overflow-hidden bg-white/95 dark:bg-neutral-900/90 border border-neutral-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 min-h-[480px] flex flex-col">

                    {/* Background Gradients */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-${SLIDES[currentSlide].color.split('-')[1]}-500/20 to-transparent blur-3xl -z-10 transition-all duration-700`} />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-3xl -z-10" />

                    {/* Skip Button */}
                    <button
                        onClick={handleComplete}
                        className="absolute top-6 right-6 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors uppercase tracking-wider"
                    >
                        Skip
                    </button>

                    {/* Content Container */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center mt-8">
                        {/* Icon Circle */}
                        <div className={`w-24 h-24 rounded-full ${SLIDES[currentSlide].bg} flex items-center justify-center mb-8 ring-1 ring-black/5 dark:ring-white/10 shadow-lg transition-all duration-500 transform`}>
                            <SlideIcon className={`w-10 h-10 ${SLIDES[currentSlide].color}`} />
                        </div>

                        {/* Text Content */}
                        <div className="space-y-4 max-w-[280px]">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight transition-all duration-300">
                                {SLIDES[currentSlide].title}
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed transition-all duration-300">
                                {SLIDES[currentSlide].description}
                            </p>

                            {/* Social Proof Stats (Only on Welcome Slide) */}
                            {currentSlide === 0 && (
                                <div className="mt-8">
                                    <p className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70 bg-emerald-500/5 py-2 px-4 rounded-full inline-block border border-emerald-500/10">
                                        Over <span className="font-bold">{totalVouchers.toLocaleString()}</span> vouchers awarded globally 🌍
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Footer */}
                    <div className="mt-12 flex flex-col items-center gap-6">
                        {/* Dots */}
                        <div className="flex gap-2">
                            {SLIDES.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-neutral-900 dark:bg-white" : "w-1.5 bg-neutral-300 dark:bg-white/20"}`}
                                />
                            ))}
                        </div>

                        {/* Action Button */}
                        <div className="w-full space-y-3">
                            <button
                                onClick={handleNext}
                                className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-900/20"
                            >
                                {currentSlide === SLIDES.length - 1 ? (
                                    <>
                                        Get Started <Check className="w-5 h-5" />
                                    </>
                                ) : (
                                    <>
                                        Next <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            {currentSlide === SLIDES.length - 1 && (
                                <button
                                    onClick={() => {
                                        localStorage.setItem("hide_onboarding", "true");
                                        handleComplete();
                                    }}
                                    className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                >
                                    Don&apos;t show this again
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
