
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <button className="w-9 h-9 opacity-0" aria-hidden="true" />; // Placeholder to matching tag
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-neutral-200/50 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300/50 dark:hover:bg-white/20 transition-colors"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}
