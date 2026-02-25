import { useState } from "react";
import Image from "next/image";
import { formatCO2 } from "@/lib/format";
import { ChevronUp, ChevronDown, User, Calendar, Zap } from "lucide-react";
import { Scan } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { EcoOrb } from "./EcoOrb";

interface ActivityFeedProps {
    scans: Scan[];
    currentPage: number;
    itemsPerPage: number;
    isMounted: boolean;
    getUserId: () => string | null;
    onSetLightboxImage: (image: string | null) => void;
    onSetCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ActivityFeed({
    scans,
    currentPage,
    itemsPerPage,
    isMounted,
    getUserId,
    onSetLightboxImage,
    onSetCurrentPage
}: ActivityFeedProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newExpandedIds = new Set(expandedIds);
        if (newExpandedIds.has(id)) {
            newExpandedIds.delete(id);
        } else {
            newExpandedIds.add(id);
        }
        setExpandedIds(newExpandedIds);
    };

    const totalPages = Math.ceil(scans.length / itemsPerPage);

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
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <section className="luxury-card bg-luxury-glass overflow-hidden mt-10">
            {/* Ledger Header - Luxury Style */}
            <div className="grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-8 py-4 sm:py-6 bg-black/20 border-b border-white/5 items-center">
                <div className="col-span-3 flex items-center gap-1 sm:gap-2">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-500" />
                    <span className="text-[8px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Timestamp</span>
                </div>
                <div className="col-span-4 flex items-center gap-1 sm:gap-2">
                    <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-500" />
                    <span className="text-[8px] sm:text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">Eco Auditor</span>
                </div>
                <div className="col-span-5 text-right flex items-center justify-end gap-1 sm:gap-2">
                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-500" />
                    <span className="text-[8px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Global Impact</span>
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-white/5"
            >
                {scans.length === 0 ? (
                    <div className="p-20 text-center">
                        <p className="luxury-heading text-neutral-500 uppercase text-[10px] tracking-[0.5em]">Silence in the Ledger</p>
                    </div>
                ) : (
                    scans.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((scan, idx) => {
                        const uniqueId = scan._id || `scan-${idx}`;
                        const isExpanded = expandedIds.has(uniqueId);
                        const co2 = scan.co2_saved || 0;
                        const points = scan.score || 0;

                        return (
                            <motion.div
                                key={uniqueId}
                                variants={itemVariants}
                                className="group/row transition-all duration-500 hover:bg-white/[0.02]"
                            >
                                {/* Main Row */}
                                <div
                                    className="grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-8 py-5 sm:py-8 items-center cursor-pointer"
                                    onClick={() => toggleExpand(uniqueId)}
                                >
                                    {/* Date */}
                                    <div className="col-span-3 flex flex-col justify-center">
                                        <span className="text-xs sm:text-sm luxury-data text-white">
                                            {isMounted ? new Date(scan.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "--"}
                                        </span>
                                        <span className="text-[8px] sm:text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5 sm:mt-1 opacity-50">
                                            {isMounted ? new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}
                                        </span>
                                    </div>

                                    {/* User */}
                                    <div className="col-span-4 flex items-center gap-2 sm:gap-4">
                                        <div className="flex-shrink-0">
                                            <EcoOrb id={scan.avatar || "emerald"} size="md" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] sm:text-sm font-bold text-white tracking-tight truncate">
                                                {scan.username || "Anonymous"}
                                            </span>
                                            <span className="text-[7px] sm:text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.2em] truncate">Verified</span>
                                        </div>
                                    </div>

                                    {/* Impact */}
                                    <div className="col-span-5 text-right flex items-center justify-end gap-2 sm:gap-6">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-baseline gap-0.5 sm:gap-1">
                                                <span className="text-md sm:text-2xl luxury-data text-emerald-500">
                                                    {points}
                                                </span>
                                                <span className="text-[7px] sm:text-[8px] font-black text-neutral-500 uppercase tracking-widest">pts</span>
                                            </div>
                                            <div className="text-[8px] sm:text-[10px] text-neutral-500 font-bold tabular-nums opacity-60 leading-none">
                                                {formatCO2(co2)}
                                            </div>
                                        </div>
                                        {isExpanded ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500 opacity-20 group-hover/row:opacity-100 transition-all" />}
                                    </div>
                                </div>

                                {/* Expanded Audit Details */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 sm:px-8 pb-6 sm:pb-10 pt-0">
                                                <div className="bg-black/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/5 flex flex-col md:flex-row gap-6 sm:gap-10">
                                                    {/* Proof Image */}
                                                    <div
                                                        className="w-full md:w-32 aspect-square md:aspect-auto md:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-900 flex-shrink-0 cursor-pointer border border-white/10 shadow-2xl relative group/img"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSetLightboxImage(scan.image);
                                                        }}
                                                    >
                                                        <Image
                                                            src={scan.image && scan.image.length > 200
                                                                ? (scan.image.startsWith('data:') ? scan.image : `data:image/jpeg;base64,${scan.image}`)
                                                                : `https://ui-avatars.com/api/?name=Eco&background=random`}
                                                            alt="Audit Proof"
                                                            fill
                                                            className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                                    </div>

                                                    <div className="flex-1 space-y-4 sm:space-y-6">
                                                        <div>
                                                            <p className="text-[8px] sm:text-[9px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-1.5 sm:mb-2">Classified Action</p>
                                                            <p className="text-xl sm:text-2xl luxury-heading text-white capitalize">
                                                                {scan.actionType?.replace(/-/g, ' ') || "Elemental Audit"}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1.5 sm:space-y-2">
                                                            <p className="text-[8px] sm:text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1.5 sm:mb-2">Eco Feedback</p>
                                                            <p className="text-xs sm:text-sm font-light text-neutral-400 italic leading-relaxed border-l-2 border-emerald-500/20 pl-3 sm:pl-4 py-1">
                                                                "{scan.reasoning || scan.message || "No specific observations were recorded for this audit."}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>

            {/* Pagination Footer - Luxury Refined */}
            {scans.length > itemsPerPage && totalPages > 1 && (
                <div className="flex items-center justify-between px-8 py-6 bg-black/40 border-t border-white/5">
                    <button
                        disabled={currentPage === 0}
                        onClick={() => onSetCurrentPage(prev => Math.max(0, prev as number - 1))}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-emerald-500 disabled:opacity-10 transition-colors"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-white/10" />
                        <span className="text-[10px] luxury-data text-neutral-500 opacity-60">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <div className="h-px w-8 bg-white/10" />
                    </div>
                    <button
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => onSetCurrentPage(prev => Math.min(totalPages - 1, prev as number + 1))}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-emerald-500 disabled:opacity-10 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
};
