'use client';

import { motion } from "framer-motion";
import { Code2, ArrowLeft, Mail, ShieldCheck, Terminal } from "lucide-react";
import Link from "next/link";

export default function APIsPage() {
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
                            Developer Preview Q4 2026
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl luxury-heading italic">Building the <span className="text-luxury-gold">Impact API</span></h1>
                        <p className="max-w-2xl mx-auto text-slate-500 dark:text-neutral-400 font-light leading-relaxed text-lg">
                            We're exposing the EcoVerify verification engine to brands and developers.
                            Build the next generation of sustainability apps on our verified ledger.
                        </p>
                    </div>

                    <div className="py-20 relative">
                        <div className="text-8xl md:text-[12rem] font-black text-black/[0.03] dark:text-white/[0.03] uppercase tracking-[0.1em] absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                            COMING SOON
                        </div>
                    </div>
                </section>

                {/* Features Preview */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        {
                            title: "Action Verification",
                            desc: "Submit images and metadata for autonomous AI verification and environmental scoring.",
                            icon: ShieldCheck
                        },
                        {
                            title: "Voucher Integration",
                            desc: "Connect your brand directly to our reward engine to issue custom eco-vouchers.",
                            icon: Code2
                        },
                        {
                            title: "Global Ledger Query",
                            desc: "Access real-time, verified sustainability data across communities and industries.",
                            icon: Terminal
                        }
                    ].map((feature, i) => (
                        <div key={i} className="space-y-6">
                            <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center">
                                <feature.icon className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest">{feature.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-neutral-400 font-light leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </section>

                {/* CTA */}
                <section className="luxury-card p-12 md:p-20 text-center space-y-8 bg-emerald-500/[0.02] border-emerald-500/10">
                    <h3 className="text-3xl luxury-heading">Waitlist for API Key</h3>
                    <p className="max-w-xl mx-auto text-slate-500 dark:text-neutral-400 font-light leading-relaxed">
                        Are you a brand looking to integrate verified impact into your store?
                        Or a developer building the next green tech breakthrough?
                    </p>
                    <div className="flex justify-center pt-4">
                        <a
                            href="mailto:kedogosospeter36@gmail.com"
                            className="flex items-center gap-3 px-10 py-5 bg-emerald-500 text-black rounded-2xl hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20"
                        >
                            <Mail className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Request Early Access</span>
                        </a>
                    </div>
                </section>
            </main>

            <footer className="py-20 text-center border-t border-black/5 dark:border-white/5 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">ECOVERIFY • DEVELOPER PORTAL</p>
            </footer>
        </div>
    );
}
