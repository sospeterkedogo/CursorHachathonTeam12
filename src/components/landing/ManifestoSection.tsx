'use client';

export default function ManifestoSection() {
    return (
        <div className="mt-40 space-y-20 relative">
            <div className="text-center space-y-6">
                <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">The End of the Promise</h2>
                <h3 className="text-4xl md:text-6xl luxury-heading italic">The Protocol <span className="text-luxury-gold">of Truth</span></h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="luxury-card p-10 space-y-8 bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5">
                    <div className="space-y-4">
                        <span className="text-4xl luxury-data text-black/10 dark:text-white/10">01</span>
                        <h4 className="text-xl luxury-heading">No More Guesswork</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-neutral-400 font-light leading-relaxed">
                        Sustainability has relied on good intentions for too long. But the planet doesn't run on good feelings—it runs on the cold, hard math of carbon.
                    </p>
                    <p className="text-sm text-slate-500 dark:text-neutral-400 font-light leading-relaxed italic border-l border-emerald-500/30 pl-4">
                        If we can’t prove the impact, it didn't happen.
                    </p>
                </div>

                <div className="luxury-card p-10 space-y-8 bg-emerald-500/[0.01] dark:bg-emerald-500/[0.03] border-emerald-500/20">
                    <div className="space-y-4">
                        <span className="text-4xl luxury-data text-emerald-500/20">02</span>
                        <h4 className="text-xl luxury-heading">The Logic of Action</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-neutral-400 font-light leading-relaxed">
                        Environmental action should be as clear as a bank statement. We use AI to turn physical effort into digital proof. Total clarity. Zero doubt.
                    </p>
                    <div className="p-6 rounded-2xl bg-white/40 dark:bg-black/40 border border-white/5 font-serif italic text-center text-luxury-gold text-lg">
                        V<sub>impact</sub> = ∑ (A<sub>i</sub> × C<sub>i</sub>) · Φ
                    </div>
                    <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-neutral-500">Φ = Verification Logic</p>
                        <p className="text-[8px] text-slate-600 dark:text-neutral-600 uppercase tracking-widest">Ensures zero-knowledge proof of genuine action.</p>
                    </div>
                </div>

                <div className="luxury-card p-10 space-y-8 bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5">
                    <div className="space-y-4">
                        <span className="text-4xl luxury-data text-black/10 dark:text-white/10">03</span>
                        <h4 className="text-xl luxury-heading">The Power of Proof</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-neutral-400 font-light leading-relaxed">
                        Accountability is the most premium resource we have. EcoVerify is for those who realize that the planet deserves more than a promise.
                    </p>
                    <p className="text-sm text-slate-600 dark:text-neutral-400 font-light leading-relaxed">
                        The planet deserves more than a promise. <span className="text-emerald-500">It deserves proof.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
