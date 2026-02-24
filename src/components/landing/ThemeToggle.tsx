'use client';

import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
    isDark: boolean;
    onToggleTheme: () => void;
}

export function ThemeToggle({ isDark, onToggleTheme }: ThemeToggleProps) {
    return (
        <button
            onClick={onToggleTheme}
            className="fixed top-6 right-6 z-[100] p-3 rounded-full transition-all duration-500 shadow-2xl bg-black/5 text-neutral-500 hover:text-black border-black/10 hover:bg-black/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:text-white dark:border-white/10 dark:hover:bg-white/10 border backdrop-blur-md group active:scale-90"
        >
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            {isDark ? (
                <Sun className="relative z-10 w-5 h-5 transition-transform group-hover:rotate-45" />
            ) : (
                <Moon className="relative z-10 w-5 h-5 transition-transform group-hover:-rotate-12" />
            )}
        </button>
    );
}
