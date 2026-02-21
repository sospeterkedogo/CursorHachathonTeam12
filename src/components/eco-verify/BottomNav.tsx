import React from "react";
import { Camera, Trophy, Ticket, User, Sparkles } from "lucide-react";

interface BottomNavProps {
    activeTab: "verify" | "leaderboard" | "vouchers" | "profile";
    setActiveTab: (tab: "verify" | "leaderboard" | "vouchers" | "profile") => void;
    onTabChange?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onTabChange }) => (
    <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-lg mb-[env(safe-area-inset-bottom,0px)]">
        <div className="luxury-card bg-black/60 backdrop-blur-2xl border-white/5 p-1.5 sm:p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <button
                onClick={() => {
                    setActiveTab("verify");
                    if (onTabChange) onTabChange("verify");
                }}
                className={`flex-1 group py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 flex flex-col items-center justify-center gap-1 sm:gap-1.5 ${activeTab === "verify" ? "text-emerald-500" : "text-neutral-500 hover:text-white"}`}
            >
                <div className={`relative ${activeTab === "verify" ? "scale-105 sm:scale-110" : "group-hover:scale-110"} transition-transform duration-500`}>
                    <Camera className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === "verify" ? "fill-emerald-500/10" : ""}`} />
                    {activeTab === "verify" && <Sparkles className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-400 animate-pulse" />}
                </div>
                <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all duration-500 ${activeTab === "verify" ? "opacity-100 translate-y-0" : "opacity-40"}`}>Audit</span>
            </button>

            <button
                onClick={() => {
                    setActiveTab("leaderboard");
                    if (onTabChange) onTabChange("leaderboard");
                }}
                className={`flex-1 group py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 flex flex-col items-center justify-center gap-1 sm:gap-1.5 ${activeTab === "leaderboard" ? "text-luxury-gold" : "text-neutral-500 hover:text-white"}`}
            >
                <div className={`relative ${activeTab === "leaderboard" ? "scale-105 sm:scale-110" : "group-hover:scale-110"} transition-transform duration-500`}>
                    <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === "leaderboard" ? "fill-luxury-gold/10" : ""}`} />
                </div>
                <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all duration-500 ${activeTab === "leaderboard" ? "opacity-100 translate-y-0" : "opacity-40"}`}>Rank</span>
            </button>

            <button
                onClick={() => {
                    setActiveTab("vouchers");
                    if (onTabChange) onTabChange("vouchers");
                }}
                className={`flex-1 group py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 flex flex-col items-center justify-center gap-1 sm:gap-1.5 ${activeTab === "vouchers" ? "text-purple-400" : "text-neutral-500 hover:text-white"}`}
            >
                <div className={`relative ${activeTab === "vouchers" ? "scale-105 sm:scale-110" : "group-hover:scale-110"} transition-transform duration-500`}>
                    <Ticket className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === "vouchers" ? "fill-purple-400/10" : ""}`} />
                </div>
                <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all duration-500 ${activeTab === "vouchers" ? "opacity-100 translate-y-0" : "opacity-40"}`}>Asset</span>
            </button>

            <button
                onClick={() => {
                    setActiveTab("profile");
                    if (onTabChange) onTabChange("profile");
                }}
                className={`flex-1 group py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 flex flex-col items-center justify-center gap-1 sm:gap-1.5 ${activeTab === "profile" ? "text-blue-400" : "text-neutral-500 hover:text-white"}`}
            >
                <div className={`relative ${activeTab === "profile" ? "scale-105 sm:scale-110" : "group-hover:scale-110"} transition-transform duration-500`}>
                    <User className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === "profile" ? "fill-blue-400/10" : ""}`} />
                </div>
                <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all duration-500 ${activeTab === "profile" ? "opacity-100 translate-y-0" : "opacity-40"}`}>Vault</span>
            </button>
        </div>
    </nav>
);
