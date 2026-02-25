'use client';

import { Mail, Briefcase, Zap } from "lucide-react";
import Image from "next/image";
import { CAREER_ROLES } from "./data";

export default function CollaborationSection() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="text-center space-y-8 relative z-10">
                <h2 className="text-4xl md:text-6xl luxury-heading italic">Open to <span className="text-luxury-gold">Collaboration</span></h2>
                <p className="text-slate-500 dark:text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed text-lg">
                    We're building the infrastructure for a circular economy. Whether you're a developer,
                    a designer, or a brand, let's create something meaningful together.
                </p>
                <div className="flex justify-center pt-8">
                    <a
                        href="mailto:kedogosospeter36@gmail.com"
                        className="flex items-center gap-4 px-10 py-5 bg-emerald-500 text-black rounded-2xl hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20 group"
                    >
                        <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Partner with Us</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
