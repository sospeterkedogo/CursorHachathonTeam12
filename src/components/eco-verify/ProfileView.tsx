import React, { useState } from "react";
import { Settings, User, ChevronRight, RotateCcw, Trash2, AlertTriangle, Loader2, X as CloseIcon, ShieldCheck } from "lucide-react";
import { Scan } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileViewProps {
    activity: Scan[];
    loading: boolean;
    onDelete: (id?: string) => void;
    onToggleVisibility: (id: string, isPublic: boolean) => void;
    currentUserId: string;
    userProfile: { username: string; avatar: string } | null;
    hasMore: boolean;
    onLoadMore: () => void;
    onUpdateProfile: () => void;
    onClearCache: () => void;
    onDeleteAccount: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
    activity,
    loading,
    onDelete,
    onToggleVisibility,
    currentUserId,
    userProfile,
    hasMore,
    onLoadMore,
    onUpdateProfile,
    onClearCache,
    onDeleteAccount
}) => {
    const [showSettings, setShowSettings] = useState(false);

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
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-10 pb-24">
            {/* Profile Header Card */}
            <div className="luxury-card bg-luxury-glass p-6 sm:p-10 flex flex-col items-center relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <User className="w-24 h-24 sm:w-32 sm:h-32" />
                </div>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`absolute top-4 sm:top-6 right-4 sm:right-6 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-500 border ${showSettings ? 'bg-luxury-gold text-white border-luxury-gold shadow-lg shadow-luxury-gold/30' : 'bg-white/5 border-white/5 text-neutral-500 hover:text-white hover:border-white/10'}`}
                >
                    <Settings className={`w-4 h-4 sm:w-5 sm:h-5 ${showSettings ? 'animate-spin-slow' : ''}`} />
                </button>

                <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-luxury-glass border-2 border-luxury-gold/30 flex items-center justify-center text-4xl sm:text-5xl mb-4 sm:mb-6 shadow-2xl relative z-10">
                        {userProfile?.avatar || "👤"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 sm:p-1.5 border-2 border-black z-20">
                        <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                </div>

                <h2 className="text-2xl sm:text-3xl luxury-heading text-white mb-2">
                    {userProfile?.username || "Distinguished Auditor"}
                </h2>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                    <span className="text-[8px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Elite Status</span>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/10" />
                    <span className="text-[8px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Imperial Ledger No. {currentUserId.slice(-4)}</span>
                </div>
            </div>

            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="luxury-card bg-luxury-glass p-5 sm:p-8 border-white/5 space-y-6 sm:space-y-8">
                            <div>
                                <h3 className="text-[8px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-4 sm:mb-6">Security & Configuration</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                    <button
                                        onClick={onUpdateProfile}
                                        className="flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-300">Identity</span>
                                        </div>
                                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={onClearCache}
                                        className="flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-300">Purge Memory</span>
                                        </div>
                                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={onDeleteAccount}
                                        className="flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/10 group"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-500">Expunge Record</span>
                                        </div>
                                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500/20 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Historical Ledger</h3>
                </div>

                {activity.length === 0 && !loading ? (
                    <div className="luxury-card p-20 text-center border-dashed border-white/10 opacity-40">
                        <p className="luxury-heading text-neutral-500 text-sm uppercase tracking-[0.2em]">The scroll is empty</p>
                        <p className="text-[8px] text-neutral-600 mt-4 uppercase tracking-[0.5em]">Initiate an audit to populate history</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {activity.map((scan, idx) => (
                            <motion.div
                                key={scan._id || idx}
                                variants={itemVariants}
                                className="luxury-card bg-luxury-glass p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 border-white/5 transition-all duration-500 hover:border-white/10 group/item"
                            >
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-neutral-900 group-hover/item:scale-105 transition-transform duration-700">
                                        <img
                                            src={scan.image && scan.image.length > 200
                                                ? (scan.image.startsWith('data:') ? scan.image : `data:image/jpeg;base64,${scan.image}`)
                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(scan.actionType)}&background=10b981&color=fff`}
                                            className="w-full h-full object-cover grayscale opacity-60 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-700"
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                                            <h4 className="text-lg sm:text-xl luxury-heading text-white truncate pr-2">
                                                {scan.actionType.replace(/-/g, ' ')}
                                            </h4>
                                            {scan.score > 0 && (
                                                <div className="flex items-baseline gap-0.5 sm:gap-1 shrink-0">
                                                    <span className="text-xl sm:text-2xl luxury-data text-emerald-500">+{scan.score}</span>
                                                    <span className="text-[7px] sm:text-[8px] font-black text-neutral-500 uppercase tracking-widest">pts</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                            <span className={`text-[7px] sm:text-[8px] font-black uppercase px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${scan.status === 'failed' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'}`}>
                                                {scan.status || 'Verified'}
                                            </span>
                                            <span className="text-[8px] sm:text-[10px] luxury-data text-neutral-500 opacity-60">
                                                {new Date(scan.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-1.5 sm:gap-2 opacity-40 group-hover/item:opacity-100 transition-opacity">
                                        <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${scan.isPublic ? 'bg-emerald-500 shadow-xl shadow-emerald-500' : 'bg-neutral-600'}`} />
                                        <span className="text-[7px] sm:text-[9px] font-black text-neutral-500 uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                                            {scan.isPublic ? 'Public' : 'Private'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 sm:gap-4">
                                        {scan.status !== 'pending' && (
                                            <button
                                                onClick={() => scan._id && onToggleVisibility(scan._id, !scan.isPublic)}
                                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[7px] sm:text-[9px] font-black transition-all uppercase tracking-[0.1em] sm:tracking-[0.2em] border ${scan.isPublic ? 'border-white/10 text-neutral-500 hover:text-red-500 hover:border-red-500/20' : 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95'}`}
                                            >
                                                {scan.isPublic ? 'Withdraw' : 'Publish'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDelete(scan._id)}
                                            className="p-1 sm:p-2 text-neutral-500 hover:text-red-500 transition-all hover:scale-110"
                                            title="Expunge Record"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {hasMore && (
                    <button
                        onClick={onLoadMore}
                        disabled={loading}
                        className="w-full py-10 text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em] hover:text-white transition-all group flex flex-col items-center gap-4"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-500" /> : (
                            <>
                                <span>Reveal Older Archives</span>
                                <div className="h-px w-12 bg-white/10 group-hover:w-24 transition-all" />
                            </>
                        )}
                    </button>
                )}
            </section>
        </div>
    );
};
