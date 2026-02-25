'use client';

import { motion } from "framer-motion";
import { CheckCircle2, TrendingDown, Ticket } from "lucide-react";

export default function WhatYouGetSection() {
    const cards = [
        {
            title: "Instant Feedback",
            desc: "Know what's actually recyclable. Our AI analyzes your waste in real-time.",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5"
        },
        {
            title: "CO2 Tracking",
            desc: "Watch your personal carbon footprint drop. Log your actions and see the impact.",
            icon: TrendingDown,
            color: "text-blue-500",
            bg: "bg-blue-500/5"
        },
        {
            title: "Real Rewards",
            desc: "Turn points into CO2 credits or brand vouchers. Get discounts for your impact.",
            icon: Ticket,
            color: "text-luxury-gold",
            bg: "bg-luxury-gold/5"
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.4em]">The Value</h2>
                <h3 className="text-4xl md:text-5xl luxury-heading">What You <span className="text-luxury-gold">Get</span></h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="luxury-card p-10 space-y-6 group hover:border-white/10 transition-all duration-500"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                            <card.icon className={`w-7 h-7 ${card.color}`} />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xl luxury-heading">{card.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-neutral-500 font-light leading-relaxed">
                                {card.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
