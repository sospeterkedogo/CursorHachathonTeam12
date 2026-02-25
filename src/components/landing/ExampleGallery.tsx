'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle2, AlertCircle, Package, CupSoda, Coffee as CoffeeIcon } from "lucide-react";
import Image from "next/image";

const EXAMPLES = [
    {
        id: "coke",
        name: "Coca-Cola Bottle",
        brand: "Coca-Cola",
        status: "Recyclable",
        description: "Standard PET plastic. Widely recycled across all regions.",
        color: "bg-red-600",
        icon: CupSoda,
        response: {
            material: "PET Plastic",
            verdict: "100% Recyclable",
            impact: "+15 Credits",
            tip: "Remove the cap and flatten to save space in the bin."
        }
    },
    {
        id: "starbucks",
        name: "Paper Cup",
        brand: "Starbucks",
        status: "Mixed Materials",
        description: "Paper with plastic lining. Requires specialist facilities.",
        color: "bg-emerald-800",
        icon: CoffeeIcon,
        response: {
            material: "CPLA Lined Paper",
            verdict: "Check Local Facility",
            impact: "+5 Credits",
            tip: "The sleeve is standard cardboard, but the cup often needs a dedicated bin."
        }
    },
    {
        id: "amazon",
        name: "Shipping Box",
        brand: "Amazon",
        status: "Recyclable",
        description: "Standard corrugated cardboard. Easy to process.",
        color: "bg-[#232f3e]",
        icon: Package,
        response: {
            material: "Corrugated Card",
            verdict: "100% Recyclable",
            impact: "+10 Credits",
            tip: "Remove any plastic tape before recycling for better quality."
        }
    }
];

export default function ExampleGallery() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleDemoScan = (id: string) => {
        setSelectedId(id);
        setIsScanning(true);
        setShowResult(false);

        setTimeout(() => {
            setIsScanning(false);
            setShowResult(true);
        }, 1500);
    };

    const activeItem = EXAMPLES.find(e => e.id === selectedId);

    return (
        <section className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden border-t border-black/5 dark:border-white/5">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.4em]">Proof of Concept</h2>
                <h3 className="text-4xl md:text-5xl luxury-heading">Try it <span className="text-luxury-gold">with these</span></h3>
                <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-neutral-500 font-light">
                    See how our AI analyzes everyday items. Click any image to run a demo scan.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
                    {EXAMPLES.map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => handleDemoScan(item.id)}
                            whileHover={{ x: 10 }}
                            className={`flex items-center gap-6 p-6 rounded-[2rem] text-left transition-all duration-500 border ${selectedId === item.id ? 'bg-emerald-500/10 border-emerald-500/20' : 'luxury-card border-transparent hover:border-white/10'}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center shadow-xl`}>
                                <item.icon className="w-8 h-8 text-white filter drop-shadow-md" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold luxury-heading">{item.name}</h4>
                                <p className="text-xs text-neutral-500 uppercase tracking-widest">{item.brand}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="luxury-card min-h-[400px] p-8 flex flex-col items-center justify-center relative overflow-hidden bg-white/50 dark:bg-black/50 backdrop-blur-3xl border-emerald-500/10">
                    <AnimatePresence mode="wait">
                        {!selectedId ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mx-auto">
                                    <Search className="w-8 h-8 text-neutral-400" />
                                </div>
                                <p className="text-sm text-neutral-500 font-medium">Select an item to initialize AI Scan</p>
                            </motion.div>
                        ) : isScanning ? (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden mb-4 relative grayscale opacity-50 flex items-center justify-center">
                                        <div className={`absolute inset-0 ${EXAMPLES.find(e => e.id === selectedId)?.color}`} />
                                        {(() => {
                                            const item = EXAMPLES.find(e => e.id === selectedId);
                                            return item && <item.icon className="w-16 h-16 text-white relative z-10" />;
                                        })()}
                                    </div>
                                    <motion.div
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
                                    />
                                </div>
                                <div className="flex items-center gap-3 text-emerald-500">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-xs font-black uppercase tracking-[0.3em]">Analyzing Material...</span>
                                </div>
                            </motion.div>
                        ) : showResult && activeItem && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${activeItem.color} flex items-center justify-center shadow-lg`}>
                                            <activeItem.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl luxury-heading leading-tight">{activeItem.name}</h4>
                                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Analysis Complete</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl luxury-data text-emerald-500">{activeItem.response.impact}</p>
                                        <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">Potential Impact</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                        <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">Material</p>
                                        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{activeItem.response.material}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                        <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">Verdict</p>
                                        <p className="text-sm font-bold text-emerald-500">{activeItem.response.verdict}</p>
                                    </div>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mb-1">Eco Tip</p>
                                        <p className="text-sm text-slate-600 dark:text-neutral-400 font-light leading-relaxed">
                                            {activeItem.response.tip}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDemoScan(selectedId)}
                                    className="w-full py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Re-Scan Item
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
