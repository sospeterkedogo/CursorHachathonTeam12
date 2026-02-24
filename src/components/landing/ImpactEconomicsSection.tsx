'use client';

import { motion } from "framer-motion";
import { TrendingUp, Coins, BarChart3 } from "lucide-react";

export default function ImpactEconomicsSection() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5 relative overflow-hidden">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="text-center mb-20 space-y-4 relative z-10">
                <h2 className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.4em]">Global Scale</h2>
                <h3 className="text-4xl md:text-5xl luxury-heading">Impact <span className="text-luxury-gold">Economics</span></h3>
                <p className="max-w-2xl mx-auto text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                    Our current linear economy is leaking value. EcoVerify is the protocol for capturing the hidden
                    billions in our waste streams through verified citizen audits.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative z-10">
                {[
                    {
                        title: "Annual Landfill",
                        value: "2.12B",
                        unit: "TONNES",
                        desc: "Global waste generation is accelerating towards a breaking point.",
                        icon: TrendingUp,
                        color: "text-red-500/60"
                    },
                    {
                        title: "Capital Lost",
                        value: "£200B+",
                        unit: "£/YR",
                        desc: "Massive public spending on inefficient, contaminated waste management.",
                        icon: Coins,
                        color: "text-luxury-gold"
                    },
                    {
                        title: "Circular Value",
                        value: "£120B",
                        unit: "£ UNLOCKED",
                        desc: "The untapped value of correctly sorted materials in the circular economy.",
                        icon: BarChart3,
                        color: "text-emerald-500"
                    }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 luxury-card flex flex-col justify-between group h-full bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5"
                    >
                        <div className="space-y-6">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/5 group-hover:scale-110 transition-transform">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">{stat.title}</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl text-neutral-900 dark:text-white luxury-data">{stat.value}</span>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${stat.color}`}>{stat.unit}</span>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                                {stat.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
