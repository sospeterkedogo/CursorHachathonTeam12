'use client';

import { motion } from "framer-motion";
import { Leaf, Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center animate-pulse shadow-2xl shadow-emerald-500/40">
                    <Leaf className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-4 border border-emerald-500/20 rounded-3xl animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Initializing Audit Suite</p>
                <div className="flex items-center gap-2 justify-center text-emerald-500/60">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Loading Resources</span>
                </div>
            </div>
        </div>
    );
}
