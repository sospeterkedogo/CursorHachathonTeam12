import React from "react";
import { Loader2 } from "lucide-react";
import { AVATARS } from "@/constants";
import { EcoOrb } from "./EcoOrb";

interface ProfileModalProps {
    inputUsername: string;
    setInputUsername: (username: string) => void;
    selectedAvatar: string;
    setSelectedAvatar: (avatar: string) => void;
    isCheckingUsername: boolean;
    usernameAvailable: boolean | null;
    onGenerateRandomName: () => void;
    onSaveProfile: () => void;
    onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
    inputUsername,
    setInputUsername,
    selectedAvatar,
    setSelectedAvatar,
    isCheckingUsername,
    usernameAvailable,
    onGenerateRandomName,
    onSaveProfile,
    onClose
}) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="text-center">
                <h2 className="text-2xl luxury-heading text-neutral-900 dark:text-white mb-2">Claim Your Identity</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light uppercase tracking-widest leading-relaxed">Join the Imperial Series Global Ledger</p>
            </div>

            <div className="flex flex-col items-center gap-8">
                <EcoOrb id={selectedAvatar} size="xl" />

                <div className="grid grid-cols-5 gap-3">
                    {AVATARS.map(avatarId => (
                        <button
                            key={avatarId}
                            onClick={() => setSelectedAvatar(avatarId)}
                            className={`transition-all duration-300 hover:scale-110 active:scale-90 ${selectedAvatar === avatarId ? "ring-2 ring-emerald-500 ring-offset-4 ring-offset-white dark:ring-offset-neutral-900 rounded-full" : "opacity-40 hover:opacity-100"}`}
                        >
                            <EcoOrb id={avatarId} size="sm" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3 block opacity-50">Transmitter ID</label>
                    <div className="flex gap-2">
                        <input
                            value={inputUsername}
                            onChange={(e) => setInputUsername(e.target.value)}
                            placeholder="Enter username"
                            className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl px-5 py-4 text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                        />
                        <button
                            onClick={onGenerateRandomName}
                            className="px-4 py-2 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 transition-colors"
                        >
                            🎲
                        </button>
                    </div>
                    <div className="h-4 mt-2 px-1">
                        {isCheckingUsername ? (
                            <span className="text-[10px] text-neutral-500 flex items-center gap-1 font-bold uppercase tracking-widest">
                                <Loader2 className="w-3 h-3 animate-spin" /> Verifying...
                            </span>
                        ) : usernameAvailable === true ? (
                            <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-bold uppercase tracking-widest">
                                ✓ ID Available
                            </span>
                        ) : usernameAvailable === false ? (
                            <span className="text-[10px] text-red-500 flex items-center gap-1 font-bold uppercase tracking-widest">
                                ✕ ID Reserved
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <button
                        onClick={onSaveProfile}
                        disabled={!inputUsername.trim() || usernameAvailable === false || isCheckingUsername}
                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 active:scale-95"
                    >
                        Save Profile
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    </div>
);
