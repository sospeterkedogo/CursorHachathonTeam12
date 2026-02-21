import React from "react";
import { Leaf, MessageSquare, User } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

interface HeaderProps {
    userProfile: { username: string; avatar: string } | null;
    onShowFeedback: () => void;
    onShowProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, onShowFeedback, onShowProfile }) => (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-2xl bg-black/40 border-b border-white/5 py-5 px-6 pt-[calc(1.25rem+env(safe-area-inset-top,0px))]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                    <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" />
                </div>
                <div>
                    <h1 className="text-lg sm:text-2xl luxury-heading text-white tracking-widest leading-none">
                        ECOVERIFY
                    </h1>
                    <span className="text-[7px] sm:text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-80">Imperial Ledger</span>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={onShowFeedback}
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-emerald-500 hover:border-emerald-500/20 transition-all duration-500"
                    aria-label="Give Feedback"
                >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="w-px h-5 sm:h-6 bg-white/5 mx-0.5 sm:mx-1" />
                <ThemeToggle />
                <button
                    onClick={onShowProfile}
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-xl sm:text-2xl hover:border-luxury-gold/30 transition-all duration-500 relative overflow-hidden group/avatar"
                >
                    <div className="absolute inset-0 bg-luxury-gold/5 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                    {userProfile?.avatar || <User className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500" />}
                </button>
            </div>
        </div>
    </header>
);
