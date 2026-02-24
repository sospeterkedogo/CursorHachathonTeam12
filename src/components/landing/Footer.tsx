'use client';

import Image from "next/image";

export default function Footer() {
    return (
        <footer className="py-20 px-6 border-t border-black/5 dark:border-white/5 text-center">
            <div className="flex flex-col items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-5 h-5 text-neutral-400 dark:text-neutral-600">
                        <Image src="/icons/smartphone.svg" width={20} height={20} alt="Mobile" className="opacity-40" />
                    </div>
                    <div className="h-px w-12 bg-black/5 dark:bg-white/5" />
                    <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    <div className="h-px w-12 bg-black/5 dark:bg-white/5" />
                    <svg className="w-5 h-5 text-neutral-400 dark:text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 3.876 4.276.621-3.094 3.016.73 4.259L12 12.75l-3.824 2.022.73-4.259-3.094-3.016 4.276-.621L12 3z" /></svg>
                </div>
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-neutral-900 dark:text-white uppercase tracking-[0.6em]">ECOVERIFY • IMPERIAL SERIES</p>
                    <p className="text-[9px] text-neutral-400 dark:text-neutral-600 font-medium tracking-[0.3em] leading-loose">
                        © 2026 AUDITING THE PLANET • PETE & PAVAN <br />
                        LONDON • NEW YORK • DUBAI
                    </p>
                </div>
            </div>
        </footer>
    );
}
