'use client';

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import Image from "next/image";

interface CommunityEvidenceSectionProps {
    communityScans: Array<{
        id: string;
        image: string;
        actionType: string;
        message: string;
        username: string;
        avatar: string;
        score?: number;
        co2_saved?: number;
    }>;
}

export default function CommunityEvidenceSection({ communityScans }: CommunityEvidenceSectionProps) {
    if (!communityScans || communityScans.length === 0) return null;

    return (
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-black/5 dark:border-white/5">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.4em]">Real-Time Impact</h2>
                <h3 className="text-4xl luxury-heading">Community Evidence</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
                {communityScans.map((scan) => (
                    <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="luxury-card overflow-hidden group border-black/5 dark:border-white/5"
                    >
                        <div className="h-24 relative overflow-hidden bg-black/5 dark:bg-white/5">
                            <Image
                                src={scan.image}
                                alt={scan.actionType}
                                fill
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                                sizes="(max-width: 768px) 50vw, 16vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500/80 text-white text-[6px] font-black uppercase tracking-widest border border-white/20">
                                {scan.actionType}
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between min-h-[120px]">
                            <div className="space-y-3">
                                <div className="flex gap-1.5">
                                    <MessageSquare className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-neutral-800 dark:text-white/90 font-medium leading-relaxed italic line-clamp-4">
                                        "{scan.message}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                                <div className="space-y-0.5">
                                    <p className="text-[7px] font-black text-luxury-gold uppercase tracking-widest">Points</p>
                                    <p className="luxury-data text-[10px] text-luxury-gold">+{scan.score || 0}</p>
                                </div>
                                <div className="text-right space-y-0.5">
                                    <p className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Saved</p>
                                    <p className="luxury-data text-[10px] text-emerald-500">{(scan.co2_saved || 0).toFixed(1)}kg</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
