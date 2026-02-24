'use client';

import { Building2, Coins, Briefcase } from "lucide-react";

export default function RewardNetworkSection() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/[0.02] blur-[150px] pointer-events-none" />
            <div className="text-center space-y-6 relative z-10 mb-20">
                <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">The Digital Handshake</h2>
                <h3 className="text-4xl md:text-5xl luxury-heading italic">The Reward <span className="text-luxury-gold">Network</span></h3>
                <p className="max-w-2xl mx-auto text-sm text-neutral-400 dark:text-neutral-500 font-light leading-relaxed">
                    We are working with global leaders and local heroes to bridge the gap between action and impact.
                    Earning real-world value for real-world change.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="luxury-card p-10 space-y-6 bg-black/[0.01] dark:bg-white/[0.02] border-black/5 dark:border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white">Global Retailers</h4>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed font-light">
                        Securing integrations with platforms like <strong className="text-emerald-500">Amazon</strong> and <strong className="text-emerald-500">M&S</strong> for universal digital vouchers.
                    </p>
                </div>

                <div className="luxury-card p-10 space-y-6 bg-emerald-500/[0.01] dark:bg-emerald-500/[0.03] border-emerald-500/20 shadow-emerald-500/5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 flex items-center justify-center">
                        <Coins className="w-6 h-6 text-luxury-gold" />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white">Daily Essentials</h4>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed font-light">
                        Negotiating with major grocery stores and locations to turn your eco-points into daily savings.
                    </p>
                </div>

                <div className="luxury-card p-10 space-y-6 bg-black/[0.01] dark:bg-white/[0.02] border-black/5 dark:border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white">Brand Ecosystem</h4>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed font-light">
                        A growing list of huge retailers committed to rewarding zero-knowledge verified impact.
                    </p>
                </div>
            </div>
        </section>
    );
}
