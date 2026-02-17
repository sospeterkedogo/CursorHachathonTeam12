import React from "react";
import { Camera, Trophy, Ticket, User } from "lucide-react";

interface BottomNavProps {
    activeTab: "verify" | "leaderboard" | "vouchers" | "profile";
    setActiveTab: (tab: "verify" | "leaderboard" | "vouchers" | "profile") => void;
    onTabChange?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onTabChange }) => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-neutral-200 dark:border-white/10 animate-slide-up">
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between p-1">
            <button
                onClick={() => {
                    setActiveTab("verify");
                    if (onTabChange) onTabChange("verify");
                }}
                className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${activeTab === "verify" ? "text-emerald-500" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
            >
                <Camera className={`w-5 h-5 flex-shrink-0 ${activeTab === "verify" ? "fill-emerald-500/10" : ""}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tight ${activeTab === "verify" ? "opacity-100" : "opacity-60"}`}>Home</span>
            </button>
            <button
                onClick={() => {
                    setActiveTab("leaderboard");
                    if (onTabChange) onTabChange("leaderboard");
                }}
                className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${activeTab === "leaderboard" ? "text-amber-500" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
            >
                <Trophy className={`w-5 h-5 flex-shrink-0 ${activeTab === "leaderboard" ? "fill-amber-500/10" : ""}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tight ${activeTab === "leaderboard" ? "opacity-100" : "opacity-60"}`}>Ranking</span>
            </button>
            <button
                onClick={() => {
                    setActiveTab("vouchers");
                    if (onTabChange) onTabChange("vouchers");
                }}
                className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${activeTab === "vouchers" ? "text-purple-500" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
            >
                <Ticket className={`w-5 h-5 flex-shrink-0 ${activeTab === "vouchers" ? "fill-purple-500/10" : ""}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tight ${activeTab === "vouchers" ? "opacity-100" : "opacity-60"}`}>Rewards</span>
            </button>
            <button
                onClick={() => {
                    setActiveTab("profile");
                    if (onTabChange) onTabChange("profile");
                }}
                className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${activeTab === "profile" ? "text-indigo-500" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
            >
                <User className={`w-5 h-5 flex-shrink-0 ${activeTab === "profile" ? "fill-indigo-500/10" : ""}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tight ${activeTab === "profile" ? "opacity-100" : "opacity-60"}`}>Profile</span>
            </button>
        </div>
    </nav>
);
