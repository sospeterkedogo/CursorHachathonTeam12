import React, { useState, useRef, useEffect } from "react";
import { Loader2, Maximize2, ChevronDown, ChevronUp, Quote, Sparkles } from "lucide-react";
import { Scan } from "@/types";

interface ActivityFeedProps {
    scans: Scan[];
    currentPage: number;
    itemsPerPage: number;
    isMounted: boolean;
    getUserId: () => string;
    onDeleteScan: (id?: string, idx?: number) => void;
    onSetLightboxImage: (image: string | null) => void;
    onSetCurrentPage: (page: number | ((prev: number) => number)) => void;
}

const ExpandableText = ({ text }: { text: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current) {
                setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight + 1);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    return (
        <div className="flex-1">
            <p
                ref={textRef}
                className={`text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium ${!isExpanded ? 'line-clamp-2' : ''}`}
            >
                {text}
            </p>

            {(isOverflowing || isExpanded) && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="mt-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 hover:underline focus:outline-none"
                >
                    {isExpanded ? (
                        <>Show Less <ChevronUp className="w-3 h-3" /></>
                    ) : (
                        <>More <ChevronDown className="w-3 h-3" /></>
                    )}
                </button>
            )}
        </div>
    );
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
    scans,
    currentPage,
    itemsPerPage,
    isMounted,
    getUserId,
    onDeleteScan,
    onSetLightboxImage,
    onSetCurrentPage
}) => {
    const totalPages = Math.ceil(scans.length / itemsPerPage);

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Community Insights
                </h3>
            </div>

            {scans.length === 0 ? (
                <div className="glass-panel p-8 text-center text-neutral-500 text-sm">
                    No scans yet. Be the first to verify an eco-action!
                </div>
            ) : (
                <div className="space-y-6">
                    {scans.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((scan, idx) => {
                        return (
                            <div
                                key={idx}
                                className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-md border border-neutral-200 dark:border-white/5 group/card"
                            >
                                {/* Header / Image Area */}
                                <div
                                    className="relative h-40 bg-neutral-100 dark:bg-neutral-900 cursor-pointer overflow-hidden"
                                    onClick={() => onSetLightboxImage(scan.image)}
                                >
                                    <img
                                        src={scan.image && scan.image.length > 200
                                            ? (scan.image.startsWith('data:') ? scan.image : `data:image/jpeg;base64,${scan.image}`)
                                            : (scan.image.startsWith('http') ? scan.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(scan.actionType || 'Eco')}&background=059669&color=fff&size=512`)}
                                        alt="eco action"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

                                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-0.5 block">Verified Action</span>
                                            <h4 className="text-white font-bold text-sm drop-shadow-sm capitalize flex items-center gap-1.5">
                                                {scan.actionType?.replace(/-/g, ' ') || "Eco Action"}
                                            </h4>
                                        </div>
                                        {scan.score > 0 && (
                                            <div className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                                +{scan.score}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs border border-neutral-100 dark:border-white/10">
                                            {scan.avatar || "👤"}
                                        </div>
                                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
                                            {scan.username || "Anonymous"}
                                        </span>
                                        <span className="text-[10px] text-neutral-400 ml-auto">
                                            {isMounted ? new Date(scan.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "..."}
                                        </span>
                                    </div>

                                    {/* Commentary / Message */}
                                    <div className="relative bg-neutral-50 dark:bg-white/5 rounded-lg p-3">
                                        <div className="flex gap-2">
                                            <Quote className="w-3 h-3 text-emerald-500/50 flex-shrink-0 rotate-180 mt-0.5" />
                                            {scan.message ? (
                                                <ExpandableText text={scan.message} />
                                            ) : (
                                                <p className="text-xs text-neutral-500 italic flex-1">
                                                    No specific commentary provided, but great job!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delete Action */}
                                    {isMounted && (scan.userId === getUserId()) && (
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteScan(scan._id, idx);
                                                }}
                                                className="text-[10px] text-red-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1 hover:bg-red-500/5 px-2 py-1 rounded"
                                            >
                                                Delete Entry
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {scans.length > itemsPerPage && (
                        <div className="flex items-center justify-between pt-2">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => onSetCurrentPage(prev => Math.max(0, prev as number - 1))}
                                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 disabled:opacity-30 transition-all border border-neutral-200 dark:border-white/5 hover:text-emerald-500"
                            >
                                Previous
                            </button>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                Page {currentPage + 1} of {totalPages}
                            </span>
                            <button
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => onSetCurrentPage(prev => Math.min(totalPages - 1, prev as number + 1))}
                                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 disabled:opacity-30 transition-all border border-neutral-200 dark:border-white/5 hover:text-emerald-500"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
