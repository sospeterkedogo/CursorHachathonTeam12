'use client';

import { motion } from "framer-motion";
import { USE_CASES } from "./data";

export default function UseCasesSection() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5">
            <div className="text-center mb-20 space-y-4">
                <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Audit Anywhere</h2>
                <h3 className="text-4xl luxury-heading">Where can I use EcoVerify?</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {USE_CASES.map((useCase, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="luxury-card p-8 group transition-colors border-black/5 dark:border-white/5 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/5"
                    >
                        <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <useCase.icon className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-4">{useCase.title}</h4>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed font-light mb-6">
                            {useCase.desc}
                        </p>
                        <div className="text-[10px] luxury-data text-luxury-gold uppercase tracking-[0.2em]">
                            {useCase.impact}
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="mt-16 text-center">
                <p className="text-xs text-neutral-400 dark:text-neutral-600 italic font-light">
                    "Works perfectly at school, at work, in corporate buildings, cafes, or even while traveling."
                </p>
            </div>
        </section>
    );
}
