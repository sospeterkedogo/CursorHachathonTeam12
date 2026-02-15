"use client";

import { useState } from "react";
import { Ticket, Clock, Calendar, Loader2 } from "lucide-react";

import { VoucherListProps } from "@/types";

export default function VoucherList({ vouchers, loading, onActivate }: VoucherListProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-purple-500/50" />
                <p>Curating your rewards...</p>
                <p className="text-sm">Fetching your eco-vouchers</p>
            </div>
        );
    }

    if (vouchers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <Ticket className="w-12 h-12 mb-4 opacity-20" />
                <p>No vouchers yet.</p>
                <p className="text-sm">Keep verifying actions to earn rewards!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {vouchers.map((voucher, index) => {
                const isRedeemed = !!voucher.used;
                return (
                    <div
                        key={voucher._id}
                        className={`apple-card p-5 relative overflow-hidden group transition-all animate-slide-up ${isRedeemed ? 'opacity-50 grayscale' : ''}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Ticket className="w-24 h-24 rotate-12 text-emerald-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-black text-neutral-800 dark:text-white leading-tight">{voucher.title}</h3>
                                    <p className="text-xs text-neutral-500 font-medium mt-1 leading-relaxed">{voucher.description}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRedeemed ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    <Ticket className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="bg-neutral-100 dark:bg-black/40 rounded-xl p-4 flex items-center justify-between border border-neutral-200 dark:border-white/5 mb-4 shadow-inner">
                                <code className="text-xl font-mono font-black tracking-[0.2em] text-neutral-900 dark:text-white select-all">
                                    {isRedeemed ? "REDEEMED" : voucher.code}
                                </code>
                                <div className={`w-3 h-3 rounded-full ${isRedeemed ? 'bg-neutral-400' : 'bg-emerald-500 animate-pulse'}`} />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-white/5">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Until {new Date(voucher.expiry).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>

                                {!isRedeemed ? (
                                    <button
                                        onClick={() => onActivate && onActivate(voucher._id)}
                                        className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        Claim Now
                                    </button>
                                ) : (
                                    <span className="text-neutral-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-neutral-200 dark:border-white/10 rounded-xl bg-neutral-100 dark:bg-white/5">
                                        Used
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
