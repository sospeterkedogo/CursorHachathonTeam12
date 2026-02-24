'use client';

import { Mail, Briefcase, Zap } from "lucide-react";
import Image from "next/image";
import { CAREER_ROLES } from "./data";

export default function CollaborationSection() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="text-center mb-20 space-y-6">
                <h2 className="text-4xl md:text-5xl luxury-heading">Open to <span className="text-luxury-gold">Collaboration</span></h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
                    We're building the infrastructure for a greener future. Whether you're a developer,
                    a designer, or a brand, let's create something meaningful together.
                </p>
                <div className="flex justify-center pt-4">
                    <a
                        href="mailto:kedogosospeter36@gmail.com"
                        className="flex items-center gap-3 px-8 py-4 luxury-card hover:border-emerald-500/50 dark:hover:border-emerald-500/30 transition-all group border-black/5 dark:border-white/5"
                    >
                        <Mail className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="luxury-data text-xs uppercase tracking-[0.2em]">Send Skill/CV</span>
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 luxury-card flex flex-col overflow-hidden border-black/5 dark:border-white/5">
                    <div className="aspect-video w-full relative overflow-hidden group">
                        <Image
                            src="/screenshots/Untitled3.png"
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-90 grayscale group-hover:grayscale-0"
                            alt="Imperial Mission"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute bottom-6 left-8">
                            <div className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                <Briefcase className="w-6 h-6 text-luxury-gold" />
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-4">
                        <h3 className="text-2xl luxury-heading">Join the <br />Mission</h3>
                        <p className="text-sm text-neutral-400 dark:text-neutral-500 font-light leading-relaxed">
                            We are currently onboarding a new team member. Explore our active roles below.
                        </p>
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CAREER_ROLES.map((role, i) => (
                        <div key={i} className="p-6 luxury-card transition-colors group hover:bg-black/5 dark:hover:bg-white/5 border-black/5 dark:border-white/5">
                            <h4 className="luxury-data text-xs uppercase tracking-widest text-emerald-500 mb-3 flex items-center justify-between">
                                {role.title}
                                <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed font-light">{role.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
