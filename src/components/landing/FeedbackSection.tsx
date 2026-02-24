'use client';

import { motion } from "framer-motion";
import { MessageSquare, Code } from "lucide-react";
import { FEEDBACK_HISTORY } from "./data";

export default function FeedbackSection() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5">
            <div className="flex flex-col md:flex-row gap-16">
                <div className="flex-1 space-y-8">
                    <div>
                        <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                            <MessageSquare className="w-4 h-4" /> Lab Notes & Feedback
                        </h2>
                        <h3 className="text-4xl luxury-heading">Brutally Honest Evolution</h3>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        We believe in radical transparency. Every update is driven by our community on the Indie App Circle.
                        We don't just fix bugs; we refine experiences.
                    </p>
                    <div className="p-6 luxury-card border-emerald-500/40 bg-emerald-500/10 dark:border-emerald-500/20 dark:bg-emerald-500/5 space-y-6">
                        <p className="text-sm italic text-emerald-900/80 dark:text-emerald-200/80">
                            "Tiny team, massive impact. Scaling the world's most elegant Eco-Friendly Auditor."
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10 flex items-center justify-center text-[10px] font-bold">SK</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Sospeter Kedogo • Lead Developer</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10 flex items-center justify-center text-[10px] font-bold">PR</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Pavan Rohith • CM & Lead Ops</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    {FEEDBACK_HISTORY.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="luxury-card p-8 space-y-6 border-black/5 dark:border-white/5"
                        >
                            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                                <span className="luxury-data text-[10px] text-luxury-gold uppercase tracking-[0.2em]">{item.date}</span>
                                <Code className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Tester Feedback</h4>
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light italic">"{item.feedback}"</p>
                                </div>
                                <div className="pl-4 border-l-2 border-emerald-500/30">
                                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Our Response</h4>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">{item.response}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {item.fixes.map((fix, j) => (
                                        <span key={j} className="text-[9px] px-2 py-1 rounded bg-black/5 border-black/10 text-neutral-400 dark:bg-white/5 dark:border-white/10 dark:text-neutral-500 uppercase tracking-wider font-bold">
                                            {fix}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
