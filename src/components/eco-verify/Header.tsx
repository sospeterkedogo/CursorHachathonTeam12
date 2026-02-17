import React from "react";
import { Leaf, MessageSquare, User } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

interface HeaderProps {
    userProfile: { username: string; avatar: string } | null;
    onShowFeedback: () => void;
    onShowProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, onShowFeedback, onShowProfile }) => (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-neutral-200/50 dark:border-white/5 py-4 px-4 pt-[calc(1rem+env(safe-area-inset-top,0px))]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight leading-none text-neutral-900 dark:text-white">
                        EcoVerify
                    </h1>
                    <p className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase mt-0.5">Impact Tracker</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onShowFeedback}
                    className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-emerald-500 transition-all shadow-sm"
                    aria-label="Give Feedback"
                >
                    <MessageSquare className="w-5 h-5" />
                </button>
                <ThemeToggle />
                <div
                    onClick={onShowProfile}
                    className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xl cursor-pointer hover:border-emerald-500 transition-all relative overflow-hidden"
                >
                    {userProfile?.avatar || <User className="w-5 h-5 text-neutral-400" />}
                </div>
            </div>
        </div>
    </header>
);
