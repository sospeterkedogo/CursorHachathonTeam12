'use client';

import { Bookmark, ArrowRight } from "lucide-react";
import { GETTING_STARTED } from "./data";

interface GettingStartedSectionProps {
    handleTryNow: () => void;
}

export default function GettingStartedSection({ handleTryNow }: GettingStartedSectionProps) {
    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5 relative overflow-hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] -z-10" />

            <div className="flex flex-col lg:flex-row gap-20">
                <div className="lg:w-1/3 space-y-8">
                    <h3 className="text-4xl luxury-heading">Getting <br />Started</h3>
                    <p className="text-slate-600 dark:text-neutral-400 font-light leading-relaxed">
                        Joining the Imperial Series is seamless. Use it anywhere, anytime.
                        Bookmarking the app ensures you never miss a chance to audit your impact.
                    </p>
                    <div className="flex items-center gap-4 py-4 px-6 luxury-card border-emerald-500/20 bg-emerald-500/10 dark:border-emerald-500/10 dark:bg-emerald-500/5 mb-8">
                        <Bookmark className="w-5 h-5 text-emerald-500" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pro Tip</p>
                            <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-light uppercase tracking-widest">Add to Home Screen for easy access.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleTryNow}
                        className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-emerald-500/20 group"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Try Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {GETTING_STARTED.map((item, i) => (
                        <div key={i} className="space-y-6 relative group">
                            <div className="text-6xl luxury-data text-black/5 dark:text-white/5 absolute -top-10 -left-4 pointer-events-none group-hover:text-emerald-500/10 transition-colors duration-500">{item.step}</div>
                            <div className="w-12 h-12 rounded-xl bg-black/5 border-black/5 dark:bg-white/5 dark:border-white/5 border flex items-center justify-center relative z-10 group-hover:border-emerald-500/30 transition-colors">
                                <item.icon className={`w-6 h-6 ${item.color} filter drop-shadow-md`} />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-luxury-gold rounded-full border-2 border-black scale-0 group-hover:scale-100 transition-transform duration-500" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest relative z-10 group-hover:text-emerald-500 transition-colors">{item.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-neutral-500 leading-relaxed font-light relative z-10 group-hover:text-black dark:group-hover:text-white transition-colors">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
