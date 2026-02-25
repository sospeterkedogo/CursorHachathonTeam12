'use client';

import React from "react";
import { Loader2, ShieldCheck, Lock, Dices } from "lucide-react";
import { AVATARS } from "@/constants";
import { EcoOrb } from "../eco-verify/EcoOrb";
import { motion, AnimatePresence } from "framer-motion";

interface QuickOnboardingModalProps {
    isOpen: boolean;
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

export const QuickOnboardingModal: React.FC<QuickOnboardingModalProps> = ({
    isOpen,
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
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[3rem] p-8 sm:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] space-y-8 relative overflow-hidden"
                >
                    {/* Security Accents */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                            <Lock className="w-3 h-3 text-emerald-500" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">End-to-End Anonymous</span>
                        </div>
                        <h2 className="text-3xl luxury-heading text-neutral-900 dark:text-white">Secure Your Identity</h2>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-xs mx-auto">
                            EcoVerify uses Zero-Knowledge infrastructure. Your identity is stored locally—only your impact from groceries, online shopping, and daily habits is recorded on the ledger.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-8">
                        <EcoOrb id={selectedAvatar} size="xl" />

                        <div className="grid grid-cols-5 gap-3">
                            {AVATARS.map(avatarId => (
                                <button
                                    key={avatarId}
                                    onClick={() => setSelectedAvatar(avatarId)}
                                    className={`transition-all duration-300 hover:scale-115 active:scale-90 ${selectedAvatar === avatarId ? "ring-2 ring-emerald-500 ring-offset-4 ring-offset-white dark:ring-offset-neutral-900 rounded-full" : "opacity-40 hover:opacity-100"}`}
                                >
                                    <EcoOrb id={avatarId} size="sm" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-3 px-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest opacity-50">Transmitter Alias</label>
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">Anonymous</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={inputUsername}
                                    onChange={(e) => setInputUsername(e.target.value)}
                                    placeholder="Enter pseudonym"
                                    className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-2xl px-6 py-5 text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all shadow-inner text-sm"
                                />
                                <button
                                    onClick={onGenerateRandomName}
                                    className="px-5 py-2 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl hover:bg-neutral-200 dark:hover:bg-white/10 text-xl transition-all active:scale-90"
                                    title="Generate Random Alias"
                                >
                                    <Dices className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                            <div className="h-5 mt-2 px-1">
                                {isCheckingUsername ? (
                                    <span className="text-[9px] text-neutral-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Cryptographic Verification...
                                    </span>
                                ) : usernameAvailable === true ? (
                                    <span className="text-[9px] text-emerald-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                        ✓ Alias Available
                                    </span>
                                ) : usernameAvailable === false ? (
                                    <span className="text-[9px] text-red-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                        ✕ Alias Reserved in Ledger
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col gap-4">
                            <button
                                onClick={onSaveProfile}
                                disabled={!inputUsername.trim() || usernameAvailable === false || isCheckingUsername}
                                className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.34em] text-xs rounded-2xl transition-all shadow-[0_20px_40px_rgba(5,150,105,0.3)] disabled:opacity-30 active:scale-[0.98]"
                            >
                                Secure Identity & Proceed
                            </button>
                            <p className="text-[9px] text-neutral-500 dark:text-neutral-500 text-center uppercase tracking-widest font-medium opacity-60">
                                No credit card. No email. No tracking.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-2 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 hover:text-neutral-900 dark:hover:text-emerald-500 transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);
