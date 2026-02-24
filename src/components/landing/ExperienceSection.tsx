'use client';

import { motion } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";
import Image from "next/image";

export default function ExperienceSection() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="text-center mb-20 space-y-4 relative z-10">
                <h2 className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.4em]">Digital Artifacts</h2>
                <h3 className="text-4xl md:text-5xl luxury-heading">The <span className="text-luxury-gold">Experience</span></h3>
                <p className="max-w-2xl mx-auto text-sm text-neutral-400 dark:text-neutral-500 font-light leading-relaxed">
                    Built for speed. Designed for precision. An interface that makes tracking every gram of CO2 effortless.
                    Capture, verify, and log impact instantly with our high-performance mobile UI.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
                {[
                    {
                        title: "Verified Auditing",
                        desc: "Snap, verify, and log impact in seconds with our high-performance mobile UI.",
                        src: "/screenshots/IMG_3349.PNG",
                        tag: "Mobile Native"
                    },
                    {
                        title: "Global Ledger",
                        desc: "Real-time visibility into collective gains and imperial milestones.",
                        src: "/screenshots/Untitled.png",
                        tag: "Imperial Core"
                    },
                    {
                        title: "Community Scaling",
                        desc: "Compete with elite auditors on the decentralized global leaderboard.",
                        src: "/screenshots/Untitled1.png",
                        tag: "Social Layer"
                    }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-6 group"
                    >
                        <div
                            className="luxury-card p-2 overflow-hidden bg-black/[0.02] dark:bg-white/[0.02] relative"
                            style={{ aspectRatio: '4/5' }}
                        >
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                            <Image
                                src={item.src}
                                alt={item.title}
                                fill
                                className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-1000"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="space-y-2 px-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors">{item.title}</h4>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-light leading-relaxed">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-24 flex justify-center">
                <div className="inline-flex items-center gap-8 py-4 px-8 luxury-card bg-black/[0.02] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <Monitor className="w-4 h-4 text-neutral-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Desktop Optimized</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-neutral-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">iOS & Android Ready</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
