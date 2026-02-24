'use client';

import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PrivacySection() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5 relative overflow-hidden">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[150px] pointer-events-none" />
            <div className="luxury-card bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-emerald-500 to-transparent" />

                <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-8" />
                    <h3 className="text-3xl md:text-4xl luxury-heading">Privacy is not a <br /><span className="text-luxury-gold">Luxury</span>. It's a standard.</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        At EcoVerify, your data is yours. We use end-to-end encryption for all audit images and health data.
                        GPS data is never stored, and your personal identity is masked by the Imperial Series ledger.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">GDPR Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">AES-256 Encryption</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Zero-Knowledge Proof</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
