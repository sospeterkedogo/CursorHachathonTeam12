'use client';

import { motion } from "framer-motion";

interface MilestonesSectionProps {
    stats: {
        totalScore: number;
        totalGlobalCO2: number;
        totalVerifiedUsers: number;
        totalVouchers: number;
    };
}

export default function MilestonesSection({ stats }: MilestonesSectionProps) {
    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-y border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="text-center space-y-2">
                    <div className="text-2xl md:text-4xl luxury-data text-luxury-gold">{(stats?.totalScore || 0).toLocaleString()}</div>
                    <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Reward Credits</div>
                </div>
                <div className="text-center space-y-2">
                    <div className="text-2xl md:text-4xl luxury-data text-emerald-500">{(stats?.totalGlobalCO2 || 0).toFixed(2)}kg</div>
                    <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">CO2 Extinguished</div>
                </div>
                <div className="text-center space-y-2">
                    <div className="text-2xl md:text-4xl luxury-data text-neutral-900 dark:text-white">{(stats?.totalVerifiedUsers || 0).toLocaleString()}</div>
                    <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Elite Contributors</div>
                </div>
                <div className="text-center space-y-2">
                    <div className="text-2xl md:text-4xl luxury-data text-purple-400">{(stats?.totalVouchers || 0).toLocaleString()}</div>
                    <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Vouchers Issued</div>
                </div>
            </div>

            {/* Global Goal Progress bar */}
            <div className="mt-16 max-w-2xl mx-auto space-y-4">
                <div className="flex justify-between items-end">
                    <div className="space-y-1 text-left">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Global Road to 1M</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light italic leading-relaxed">Participate in the global transition toward a circular era.</p>
                    </div>
                    <div className="text-[10px] luxury-data text-neutral-900 dark:text-white">
                        {(((stats?.totalVerifiedUsers || 0) / 1000000) * 100).toFixed(4)}%
                    </div>
                </div>
                <div className="h-1 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(2, ((stats?.totalVerifiedUsers || 0) / 1000000) * 100)}%` }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                </div>
            </div>
        </section>
    );
}
