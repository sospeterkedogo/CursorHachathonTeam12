import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="pt-32 pb-12 px-6 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="max-w-7xl mx-auto space-y-24">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500 text-black">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="text-lg luxury-heading tracking-widest uppercase">EcoVerify • Imperial Series</span>
                            </div>
                            <p className="max-w-xs text-sm text-slate-500 dark:text-neutral-500 font-light leading-relaxed">
                                The world's first AI-Verified ledger for personal impact.
                                Snap your actions, prove your impact.
                            </p>
                        </div>
                    </div>

                    {/* Platform */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link href="/verify" className="text-xs text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors flex items-center gap-1 group">Launch App <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                            <li><Link href="/verify" className="text-xs text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors">Impact Ledger</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="/careers" className="text-xs text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors">Careers</Link></li>
                            <li><Link href="/#mission" className="text-xs text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors">Our Mission</Link></li>
                        </ul>
                    </div>

                    {/* Developers */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Resource</h4>
                        <ul className="space-y-4">
                            <li><Link href="/api-access" className="text-xs text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors">API Access</Link></li>
                            <li><Link href="/privacy" className="text-xs text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-xs text-slate-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8">
                        <p className="text-[10px] font-black text-neutral-900 dark:text-white uppercase tracking-[0.6em]">ECOVERIFY • IMPERIAL SERIES</p>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-[9px] text-slate-500 dark:text-neutral-600 font-medium tracking-[0.3em] leading-loose">
                            © 2026 AUDITING THE PLANET • PETE & PAVAN <br />
                            LONDON • NEW YORK • DUBAI
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
