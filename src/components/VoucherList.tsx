"use client";

import { useState } from "react";
import { Ticket, Clock, Calendar, Loader2 } from "lucide-react";

type Voucher = {
    _id: string;
    code: string;
    title: string;
    description: string;
    expiry: string;
    createdAt: string;
    used?: boolean;
};

type Props = {
    vouchers: Voucher[];
    loading?: boolean;
    onActivate?: (id: string) => void;
};

export default function VoucherList({ vouchers, loading, onActivate }: Props) {
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
        <div className="space-y-4">
            {vouchers.map((voucher) => {
                const isRedeemed = !!voucher.used;
                return (
                    <div key={voucher._id} className={`glass-panel p-4 relative overflow-hidden group transition-all ${isRedeemed ? 'opacity-50 grayscale' : ''}`}>
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Ticket className="w-24 h-24 rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-emerald-400 mb-1">{voucher.title}</h3>
                            <p className="text-sm text-neutral-300 mb-3">{voucher.description}</p>

                            <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between border border-white/5 mb-3">
                                <code className="text-lg font-mono font-bold tracking-wider text-white select-all">
                                    {isRedeemed ? "REDEEMED" : voucher.code}
                                </code>
                                <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded ${isRedeemed ? 'bg-neutral-500/20 text-neutral-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    {isRedeemed ? 'USED' : 'ACTIVE'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-neutral-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>Expires: {new Date(voucher.expiry).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {!isRedeemed ? (
                                    <button
                                        onClick={() => onActivate && onActivate(voucher._id)}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-emerald-900/40"
                                    >
                                        Activate
                                    </button>
                                ) : (
                                    <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border border-white/5 rounded-lg bg-white/5">
                                        Activated
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
