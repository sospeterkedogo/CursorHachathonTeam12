"use client";

import { Ticket, Calendar, Loader2, Sparkles, Diamond } from "lucide-react";
import { motion } from "framer-motion";
import { VoucherListProps } from "@/types";

export default function VoucherList({ vouchers, loading, onActivate }: VoucherListProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 opacity-50">
                <Loader2 className="w-10 h-10 mb-6 animate-spin text-purple-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Curating Assets...</p>
            </div>
        );
    }

    if (vouchers.length === 0) {
        return (
            <div className="luxury-card p-20 text-center opacity-40 border-dashed border-white/10">
                <Ticket className="w-12 h-12 mb-6 mx-auto text-neutral-600" />
                <p className="luxury-heading text-neutral-500 text-sm uppercase tracking-[0.2em]">No rewards yet</p>
                <p className="text-[8px] text-neutral-600 mt-4 uppercase tracking-[0.5em]">Complete actions to unlock exciting local rewards</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Community Rewards</h3>
            </div>

            {vouchers.map((voucher, index) => {
                const isRedeemed = !!voucher.used;
                return (
                    <motion.div
                        key={voucher._id}
                        variants={itemVariants}
                        className={`luxury-card p-5 sm:p-8 relative overflow-hidden group transition-all duration-700 ${isRedeemed ? 'opacity-40 grayscale' : ''}`}
                    >
                        {/* Decorative Background Icon */}
                        <div className="absolute -top-6 -right-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000 rotate-12">
                            <Diamond className="w-40 h-40 text-luxury-gold" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6 sm:mb-8 gap-4">
                                <div className="max-w-[75%]">
                                    <h3 className="text-lg sm:text-2xl luxury-heading text-white leading-tight mb-1.5 sm:mb-2 uppercase tracking-wider">{voucher.title}</h3>
                                    <p className="text-[9px] sm:text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em] leading-relaxed">{voucher.description}</p>
                                </div>
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/5 flex-shrink-0 ${isRedeemed ? 'bg-white/5 text-neutral-600' : 'bg-luxury-gold/10 text-luxury-gold shadow-2xl shadow-luxury-gold/10'}`}>
                                    <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center justify-between border border-white/5 mb-6 sm:mb-8 group/code cursor-pointer overflow-hidden relative">
                                <div className="absolute inset-0 bg-luxury-gold/5 translate-y-full group-hover/code:translate-y-0 transition-transform duration-500" />
                                <code className="text-lg sm:text-2xl luxury-data tracking-[0.2em] sm:tracking-[0.3em] text-white relative z-10">
                                    {isRedeemed ? "REDEEMED" : voucher.code}
                                </code>
                                <div className={`w-2 h-2 rounded-full relative z-10 flex-shrink-0 ${isRedeemed ? 'bg-neutral-600' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse'}`} />
                            </div>

                            <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/5 gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] min-w-0">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 flex-shrink-0" />
                                    <span className="truncate">Exp • {new Date(voucher.expiry).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>

                                {!isRedeemed ? (
                                    <button
                                        onClick={() => onActivate && onActivate(voucher._id)}
                                        className="bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 shadow-2xl shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
                                    >
                                        Use Now
                                    </button>
                                ) : (
                                    <span className="text-neutral-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-4 sm:px-8 py-2.5 sm:py-3 border border-white/5 rounded-xl sm:rounded-2xl bg-white/5 whitespace-nowrap">
                                        Used
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
