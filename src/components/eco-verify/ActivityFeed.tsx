
import { useState } from "react";
import { formatCO2 } from "@/lib/format";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Scan } from "@/types";

interface ActivityFeedProps {
    scans: Scan[];
    currentPage: number;
    itemsPerPage: number;
    isMounted: boolean;
    getUserId: () => string | null;
    onSetLightboxImage: (image: string | null) => void;
    onSetCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const ActivityFeed = ({
    scans,
    currentPage,
    itemsPerPage,
    isMounted,
    getUserId,
    onSetLightboxImage,
    onSetCurrentPage
}: ActivityFeedProps) => {
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

    return (
        <section className="bg-white/50 dark:bg-black/10 backdrop-blur-sm rounded-xl border border-neutral-200 dark:border-white/5 overflow-hidden">
            {/* Ledger Header */}
            <div className="grid grid-cols-12 gap-2 p-3 bg-neutral-100/50 dark:bg-black/20 border-b border-neutral-200 dark:border-white/5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <div className="col-span-3">Date</div>
                <div className="col-span-4">User</div>
                <div className="col-span-3 text-right">Impact</div>
                <div className="col-span-2 text-center">Status</div>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-white/5">
                {scans.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-400">
                        No activity found.
                    </div>
                ) : (
                    scans.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((scan, idx) => {
                        const uniqueId = scan._id || `scan-${idx}`;
                        const isExpanded = expandedIds.has(uniqueId);
                        const co2 = scan.co2_saved || 0;
                        const points = scan.score || 0;

                        return (
                            <div key={uniqueId} className="group/row transition-colors hover:bg-neutral-50/50 dark:hover:bg-white/5">
                                {/* Main Row */}
                                <div
                                    className="grid grid-cols-12 gap-2 p-3 items-center cursor-pointer"
                                    onClick={() => toggleExpand(uniqueId)}
                                >
                                    {/* Date */}
                                    <div className="col-span-3 flex flex-col justify-center">
                                        <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400">
                                            {isMounted ? new Date(scan.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "--"}
                                        </span>
                                        <span className="text-[10px] text-neutral-400">
                                            {isMounted ? new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}
                                        </span>
                                    </div>

                                    {/* User */}
                                    <div className="col-span-4 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] border border-neutral-300 dark:border-white/10">
                                            {scan.avatar || "👤"}
                                        </div>
                                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 truncate">
                                            {scan.username || "Anon"}
                                        </span>
                                    </div>

                                    {/* Impact (Points + CO2) */}
                                    <div className="col-span-3 text-right">
                                        <div className="flex flex-col items-end">
                                            <div className={`inline-block px-1.5 py-0.5 rounded mb-0.5 ${points > 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-neutral-100 text-neutral-400'}`}>
                                                <span className="text-xs font-mono font-bold tabular-nums">
                                                    {points}
                                                </span>
                                                <span className="text-[9px] ml-0.5">pts</span>
                                            </div>
                                            <div className="text-[9px] text-neutral-400 font-medium">
                                                {formatCO2(co2)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status / Expand */}
                                    <div className="col-span-2 flex justify-center">
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400 opacity-50 group-hover/row:opacity-100" />}
                                    </div>
                                </div>

                                {/* Expanded Audit Details */}
                                {isExpanded && (
                                    <div className="px-3 pb-3 pt-0 animate-slide-down">
                                        <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-3 border border-neutral-100 dark:border-white/5 space-y-3">
                                            {/* Action & Image */}
                                            <div className="flex gap-3">
                                                <div
                                                    className="w-16 h-16 rounded overflow-hidden bg-neutral-200 flex-shrink-0 cursor-pointer border border-neutral-200 dark:border-white/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSetLightboxImage(scan.image);
                                                    }}
                                                >
                                                    <img
                                                        src={scan.image && scan.image.length > 200
                                                            ? (scan.image.startsWith('data:') ? scan.image : `data:image/jpeg;base64,${scan.image}`)
                                                            : `https://ui-avatars.com/api/?name=Eco&background=random`}
                                                        alt="proof"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Action Type</p>
                                                    <p className="text-sm font-semibold capitalize text-neutral-800 dark:text-neutral-200">
                                                        {scan.actionType?.replace(/-/g, ' ') || "Unspecified Action"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Audit Reason */}
                                            <div>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed bg-white dark:bg-black/20 p-2 rounded border border-neutral-100 dark:border-white/5">
                                                    {scan.reasoning || scan.message || "No specific audit notes provided."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination Footer */}
            {scans.length > itemsPerPage && totalPages > 1 && (
                <div className="flex items-center justify-between p-3 bg-neutral-50/50 dark:bg-white/5 border-t border-neutral-200 dark:border-white/5">
                    <button
                        disabled={currentPage === 0}
                        onClick={() => onSetCurrentPage(prev => Math.max(0, prev as number - 1))}
                        className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-neutral-500"
                    >
                        ← Prev
                    </button>
                    <span className="text-[10px] font-mono text-neutral-400">
                        PAGE {currentPage + 1}/{totalPages}
                    </span>
                    <button
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => onSetCurrentPage(prev => Math.min(totalPages - 1, prev as number + 1))}
                        className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-neutral-500"
                    >
                        Next →
                    </button>
                </div>
            )}
        </section>
    );
};
