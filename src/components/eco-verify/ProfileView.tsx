import React, { useState } from "react";
import { Settings, User, ChevronRight, RotateCcw, Trash2, AlertTriangle, Loader2, X as CloseIcon } from "lucide-react";
import { Scan } from "@/types";

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

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="glass-panel p-6 border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center relative overflow-hidden">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`absolute top-4 right-4 p-2 rounded-xl transition-all ${showSettings ? 'bg-emerald-500 text-white' : 'bg-white/50 dark:bg-black/50 text-neutral-500 hover:text-emerald-500'}`}
                >
                    <Settings className={`w-5 h-5 ${showSettings ? 'animate-spin-slow' : ''}`} />
                </button>

                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-emerald-500 flex items-center justify-center text-3xl mb-3 shadow-lg">
                    {userProfile?.avatar || "👤"}
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
                    {userProfile?.username || "Guest Impact"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Impact Dashboard</span>
                    <div className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Personal Action Log</span>
                </div>
            </div>

            {showSettings && (
                <div className="glass-panel p-6 border-neutral-200 dark:border-white/10 animate-slide-up space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Account Settings</h3>
                        <div className="space-y-3">
                            <button
                                onClick={onUpdateProfile}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all border border-neutral-200 dark:border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-emerald-500" />
                                    <span className="text-sm font-semibold">Edit Profile</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-neutral-400" />
                            </button>

                            <button
                                onClick={onClearCache}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all border border-neutral-200 dark:border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <RotateCcw className="w-5 h-5 text-amber-500" />
                                    <span className="text-sm font-semibold">Clear Local Cache</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-neutral-400" />
                            </button>

                            <button
                                onClick={onDeleteAccount}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/20 group"
                            >
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                    <span className="text-sm font-semibold text-red-500">Delete Account</span>
                                </div>
                                <AlertTriangle className="w-4 h-4 text-red-500/50 group-hover:text-red-500 transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Your Activity</h3>
                </div>

                {activity.length === 0 && !loading ? (
                    <div className="glass-panel p-12 text-center border-dashed border-neutral-200 dark:border-white/10">
                        <p className="text-sm text-neutral-500">Your ecological footprints will appear here.</p>
                        <p className="text-[10px] text-neutral-400 mt-2 uppercase tracking-tighter">Start verifying to make an impact!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activity.map((scan, idx) => (
                            <div key={scan._id || idx} className="glass-panel p-4 flex flex-col gap-4 border border-neutral-200 dark:border-white/5 group/activity">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 dark:border-white/10 flex-shrink-0 bg-neutral-100 dark:bg-neutral-800">
                                        <img
                                            src={scan.image && scan.image.length > 200
                                                ? (scan.image.startsWith('data:') ? scan.image : `data:image/jpeg;base64,${scan.image}`)
                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(scan.actionType)}&background=059669&color=fff`}
                                            className="w-full h-full object-cover"
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate pr-2">
                                                {scan.actionType.replace(/-/g, ' ')}
                                            </h4>
                                            {scan.score > 0 && (
                                                <span className="text-sm font-black text-emerald-500 tabular-nums shrink-0">+{scan.score} mg</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${scan.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {scan.status || 'Verified'}
                                            </span>
                                            <span className="text-[10px] text-neutral-400 font-medium">
                                                {new Date(scan.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-white/5 mt-1">
                                    <div className="flex items-center gap-1.5 grayscale group-hover/activity:grayscale-0 transition-all opacity-60 group-hover/activity:opacity-100">
                                        <div className={`w-1.5 h-1.5 rounded-full ${scan.isPublic ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-neutral-400'}`} />
                                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">
                                            {scan.isPublic ? 'Public Feed' : 'Private Draft'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {scan.status !== 'pending' && (
                                            <button
                                                onClick={() => scan._id && onToggleVisibility(scan._id, !scan.isPublic)}
                                                className={`px-3 py-1 rounded-lg text-[9px] font-bold transition-all uppercase tracking-widest border ${scan.isPublic ? 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-red-500 hover:border-red-200' : 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20'}`}
                                            >
                                                {scan.isPublic ? 'Remove from Feed' : 'Add to Feed'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDelete(scan._id)}
                                            className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                                            title="Delete action"
                                        >
                                            <CloseIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <button
                        onClick={onLoadMore}
                        disabled={loading}
                        className="w-full py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load older actions"}
                    </button>
                )}
            </section>
        </div>
    );
};
