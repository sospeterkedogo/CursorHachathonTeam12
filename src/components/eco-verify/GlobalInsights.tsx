import React from "react";
import { Globe, Users, Heart, Sparkles, Activity } from "lucide-react";
import { formatCompactNumber } from "@/lib/format";
import { motion } from "framer-motion";
import { WeeklyImpactSummary } from "./WeeklyImpactSummary";
import { GlobalBanner, GoalCard } from "./ImpactSummary";

interface GlobalInsightsProps {
    globalScore: number;
    globalCO2: number;
    totalVerifiedUsers: number;
    weeklyTrend: any[];
    nextBestAction: any;
    userRank: number | null;
    userScore: number;
}

export default function GlobalInsights({
    globalScore,
    globalCO2,
    totalVerifiedUsers,
    weeklyTrend,
    nextBestAction,
    userRank,
    userScore
}: GlobalInsightsProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left space-y-3 px-2 sm:px-0"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Intelligence Center</span>
                </div>
                <h1 className="text-3xl sm:text-4xl luxury-heading text-white tracking-tight">Ecosystem Insights</h1>
                <p className="text-neutral-400 max-w-xl text-sm sm:text-base font-light">
                    Real-time monitoring of local impact and global trends. This is your personal dashboard for ecological progression.
                </p>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: "Network Nodes", value: totalVerifiedUsers, icon: <Users className="w-4 h-4" />, color: "text-blue-400" },
                    { label: "Carbon Offset", value: globalCO2, prefix: "mg", icon: <Heart className="w-4 h-4" />, color: "text-rose-400" },
                    { label: "Econ Points", value: globalScore, icon: <Sparkles className="w-4 h-4" />, color: "text-luxury-gold" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.1 }}
                        className="luxury-card bg-luxury-glass p-5 flex flex-col gap-3 border-white/5"
                    >
                        <div className={`p-2 rounded-xl bg-white/5 w-max ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <div className="text-xl sm:text-3xl luxury-data text-white tabular-nums">
                                {formatCompactNumber(stat.value)}
                            </div>
                            <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
                                {stat.label}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
                {/* Left Column: Personal Analytics */}
                <div className="xl:col-span-2 space-y-8">
                    <WeeklyImpactSummary
                        weeklyTrend={weeklyTrend}
                        nextBestAction={nextBestAction}
                    />
                </div>

                {/* Right Column: Global & Goals */}
                <div className="space-y-8 flex flex-col h-full">
                    <GoalCard userScore={userScore} className="h-full min-h-[300px]" />
                </div>
            </motion.div>

            {/* Full Width Global Banner */}
            <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex items-center gap-3 mb-6 px-2 sm:px-0">
                    <Globe className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Global Network Protocol</h3>
                </div>
                <GlobalBanner globalScore={globalScore} globalCO2={globalCO2} userRank={userRank} />
            </motion.div>

        </div>
    );
}
