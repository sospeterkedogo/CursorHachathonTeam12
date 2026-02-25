'use client';

import { motion } from "framer-motion";
import { Briefcase, Zap, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { CAREER_ROLES } from "../../components/landing/data";

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#050505] text-neutral-900 dark:text-white selection:bg-emerald-500/30 overflow-x-hidden">
            {/* Header */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] hover:text-emerald-500 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Mission
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                {/* Hero / Coming Soon Banner */}
                <section className="text-center space-y-8 relative">
                    <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="space-y-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
                        >
                            Opening Q3 2026
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl luxury-heading italic">Join the <span className="text-luxury-gold">Elite Squad</span></h1>
                        <p className="max-w-2xl mx-auto text-slate-500 dark:text-neutral-400 font-light leading-relaxed text-lg">
                            We're building the infrastructure for a circular economy.
                            The Careers Portal is currently under construction as we finalize our Tier 1 partnership roles.
                        </p>
                    </div>

                    <div className="py-20 relative">
                        <div className="text-8xl md:text-[12rem] font-black text-black/[0.03] dark:text-white/[0.03] uppercase tracking-[0.1em] absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                            COMING SOON
                        </div>
                    </div>
                </section>

                {/* Role Preview */}
                <section className="space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Current Preview</h2>
                        <h3 className="text-3xl luxury-heading">Anticipated Opportunities</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {CAREER_ROLES.map((role, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 luxury-card transition-all group hover:bg-black/5 dark:hover:bg-white/5 border-black/5 dark:border-white/5 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                    <Briefcase className="w-16 h-16" />
                                </div>
                                <h4 className="luxury-data text-sm uppercase tracking-widest text-emerald-500 mb-4 flex items-center justify-between">
                                    {role.title}
                                    <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-neutral-500 leading-relaxed font-light">{role.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="luxury-card p-12 md:p-20 text-center space-y-8 bg-emerald-500/[0.02] border-emerald-500/10">
                    <h3 className="text-3xl luxury-heading">Can't wait?</h3>
                    <p className="max-w-xl mx-auto text-slate-500 dark:text-neutral-400 font-light leading-relaxed">
                        If you have a unique skill that can accelerate the EcoVerify mission,
                        send your profile/CV directly to our founding team.
                    </p>
                    <div className="flex justify-center pt-4">
                        <a
                            href="mailto:kedogosospeter36@gmail.com"
                            className="flex items-center gap-3 px-10 py-5 bg-emerald-500 text-black rounded-2xl hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20"
                        >
                            <Mail className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Send Intelligence</span>
                        </a>
                    </div>
                </section>
            </main>

            <footer className="py-20 text-center border-t border-black/5 dark:border-white/5 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">ECOVERIFY • CAREERS PORTAL</p>
            </footer>
        </div>
    );
}
