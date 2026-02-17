import React from "react";
import { Loader2 } from "lucide-react";
import { AVATARS } from "@/constants";

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
        <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Claim Your Profile</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Save your username to appear on the leaderboard.</p>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-emerald-500/50 flex items-center justify-center text-4xl shadow-lg">
                    {selectedAvatar}
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map(avatar => (
                        <button
                            key={avatar}
                            onClick={() => setSelectedAvatar(avatar)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors ${selectedAvatar === avatar ? "bg-neutral-200 dark:bg-white/20 ring-2 ring-emerald-500" : ""}`}
                        >
                            {avatar}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Username</label>
                    <div className="flex gap-2">
                        <input
                            value={inputUsername}
                            onChange={(e) => setInputUsername(e.target.value)}
                            placeholder="Enter username"
                            className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                        <button
                            onClick={onGenerateRandomName}
                            className="px-3 py-2 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500"
                        >
                            🎲
                        </button>
                    </div>
                    <div className="h-4 mt-1 pl-1">
                        {isCheckingUsername ? (
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                            </span>
                        ) : usernameAvailable === true ? (
                            <span className="text-xs text-emerald-500 flex items-center gap-1">
                                ✓ Username available
                            </span>
                        ) : usernameAvailable === false ? (
                            <span className="text-xs text-red-500 flex items-center gap-1">
                                ✕ Username taken
                            </span>
                        ) : null}
                    </div>
                </div>

                <button
                    onClick={onSaveProfile}
                    disabled={!inputUsername.trim() || usernameAvailable === false || isCheckingUsername}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                    Save Profile
                </button>
                <button
                    onClick={onClose}
                    className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                    Skip for now
                </button>
            </div>
        </div>
    </div>
);
