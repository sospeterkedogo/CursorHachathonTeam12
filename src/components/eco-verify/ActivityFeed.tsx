import React from "react";
import { Loader2, Maximize2 } from "lucide-react";
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
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Recent Activity</h3>
            </div>

            {scans.length === 0 ? (
                <div className="glass-panel p-8 text-center text-neutral-500 text-sm">
                    No scans yet. Be the first!
                </div>
            ) : (
                <div className="space-y-4">
                    {scans.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((scan, idx) => (
                        <div
                            key={idx}
                            className="glass-panel p-4 flex items-center gap-4 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all cursor-pointer group/card border border-neutral-200 dark:border-white/10"
                            onClick={() => onSetLightboxImage(scan.image)}
                        >
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center relative z-10 shadow-inner group-hover/card:border-emerald-500/50 transition-colors">
                                    <img
                                        src={scan.image && scan.image.length > 200
                                            ? (scan.image.startsWith('data:') ? scan.image : `data:image/jpeg;base64,${scan.image}`)
                                            : (scan.image.startsWith('http') ? scan.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(scan.actionType || 'Eco')}&background=059669&color=fff&size=128`)}
                                        alt="eco action"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 flex items-center justify-center transition-opacity">
                                        <Maximize2 className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 dark:bg-emerald-900 border border-white dark:border-black flex items-center justify-center z-20 overflow-hidden text-xs shadow-lg">
                                    {scan.avatar || "👤"}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 ml-1">
                                <span className="font-bold text-sm text-neutral-900 dark:text-neutral-200 truncate block">{scan.username || "Anonymous"}</span>
                                {scan.status === 'pending' ? (
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
                                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight">Verifying...</span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 capitalize font-medium truncate mb-1">{scan.actionType.replace(/-/g, ' ')}</p>
                                )}
                                <span className="text-[10px] text-neutral-500">
                                    {isMounted ? new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}
                                </span>
                            </div>
                            {scan.userId && (
                                <div className="flex items-center gap-1">
                                    {scan.score > 0 && (
                                        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-black tabular-nums border border-emerald-500/20">
                                            +{scan.score}
                                        </div>
                                    )}
                                    {isMounted && (scan.userId === getUserId()) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteScan(scan._id, idx);
                                            }}
                                            className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                                        >
                                            <span className="text-[10px] font-bold">✕</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {scans.length > itemsPerPage && (
                        <div className="flex items-center justify-between pt-4 px-1">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => onSetCurrentPage(prev => Math.max(0, prev as number - 1))}
                                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 disabled:opacity-30 transition-all border border-neutral-200 dark:border-neutral-700 hover:text-emerald-500"
                            >
                                Previous
                            </button>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                Page {currentPage + 1} of {totalPages}
                            </span>
                            <button
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => onSetCurrentPage(prev => Math.min(totalPages - 1, prev as number + 1))}
                                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 disabled:opacity-30 transition-all border border-neutral-200 dark:border-neutral-700 hover:text-emerald-500"
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
