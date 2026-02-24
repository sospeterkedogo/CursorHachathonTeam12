'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, CheckCircle2 } from "lucide-react";

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });

            if (distance < 0) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex gap-4 sm:gap-8 justify-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 luxury-card flex items-center justify-center mb-2 border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                        <span className="text-xl sm:text-2xl luxury-data text-emerald-500">{value}</span>
                    </div>
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{unit}</span>
                </div>
            ))}
        </div>
    );
}

export default function CountdownSection() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
            setEmail("");
        }
    };

    return (
        <section id="mobile" className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5 dark:bg-gradient-to-b dark:from-white/[0.02] dark:to-transparent bg-gradient-to-b from-black/[0.01] to-transparent">
            <div className="text-center space-y-12">
                <div className="space-y-4">
                    <h2 className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                        <Timer className="w-4 h-4" /> Next Generation Mobile
                    </h2>
                    <h3 className="text-4xl md:text-6xl luxury-heading">Imperial Mobile Drop</h3>
                </div>

                <CountdownTimer />

                <div className="max-w-md mx-auto space-y-8">
                    <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        Be the first to audit from your pocket. Pre-register your interest for early access to the Android and iOS elite beta.
                    </p>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@email.com"
                                className="flex-1 bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10 focus:border-emerald-500/50 rounded-xl px-6 py-4 text-sm font-light focus:outline-none transition-colors dark:text-white"
                                required
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 bg-emerald-500 text-black font-bold text-sm rounded-xl hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                            >
                                Pre-Register
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 luxury-card border-emerald-500/40 bg-emerald-500/10 dark:border-emerald-500/20 dark:bg-emerald-500/5 flex flex-col items-center gap-4"
                        >
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            <div className="text-center">
                                <p className="text-sm font-bold uppercase tracking-widest mb-1 text-neutral-900 dark:text-white">On the List</p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-500">We'll invite you as soon as we drop.</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
