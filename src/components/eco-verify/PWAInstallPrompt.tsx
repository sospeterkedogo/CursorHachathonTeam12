'use client';

import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Smartphone, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PWAInstallPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

    useEffect(() => {
        // Detect if already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone
            || document.referrer.includes('android-app://');

        if (isStandalone) return;

        // Detect Platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIos = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        if (isIos) setPlatform('ios');
        else if (isAndroid) setPlatform('android');

        // Logic to show prompt: check localStorage to avoid showing it every time
        const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
        const lastShown = localStorage.getItem('pwa_prompt_last_shown');
        const now = Date.now();

        // Show if not dismissed and not shown in the last 24 hours
        if (!hasDismissed && (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000)) {
            // Show only on mobile
            if (isIos || isAndroid) {
                const timer = setTimeout(() => setShowPrompt(true), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa_prompt_dismissed', 'true');
    };

    const handleRemindLater = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa_prompt_last_shown', Date.now().toString());
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <div className="fixed inset-x-0 bottom-0 z-[150] p-4 pb-8 md:p-8 flex justify-center pointer-events-none">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-[2.5rem] p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.3)] pointer-events-auto relative overflow-hidden"
                    >
                        {/* Luxury Accents */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <button
                            onClick={handleRemindLater}
                            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Smartphone className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold luxury-heading">Install EcoVerify</h3>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-widest">Imperial Series Native</p>
                            </div>
                        </div>

                        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-8">
                            Add EcoVerify to your home screen for instant access to the Impact Ledger and exclusive brand rewards.
                        </p>

                        <div className="space-y-4">
                            {platform === 'ios' ? (
                                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 space-y-3">
                                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-200 dark:bg-white/10 text-[10px]">1</span>
                                        Tap the Share icon
                                    </div>
                                    <div className="flex justify-center py-2">
                                        <div className="p-2 rounded-lg bg-blue-500 text-white shadow-lg">
                                            <Share className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-200 dark:bg-white/10 text-[10px]">2</span>
                                        Select 'Add to Home Screen'
                                    </div>
                                    <div className="flex justify-center py-2">
                                        <div className="p-2 rounded-lg border border-neutral-300 dark:border-white/20 flex items-center gap-2">
                                            <PlusSquare className="w-6 h-6 text-neutral-600 dark:text-white" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 space-y-3 text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Tap the browser menu (⋮) and select <br />
                                        <span className="text-emerald-500">'Install App' or 'Add to Home Screen'</span>
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleRemindLater}
                                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                                >
                                    Maybe later
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="w-full py-2 text-[8px] font-medium text-neutral-300 dark:text-neutral-600 hover:text-red-400 transition-colors uppercase tracking-widest"
                                >
                                    Don't show again
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
