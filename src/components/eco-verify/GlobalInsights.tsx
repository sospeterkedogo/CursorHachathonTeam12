import React from "react";
import { Globe, Users, TreePine, Sun, Droplets, Zap, Sparkles, Heart } from "lucide-react";
import { formatCompactNumber } from "@/lib/format";
import { motion } from "framer-motion";

interface GlobalInsightsProps {
    globalScore: number;
    globalCO2: number;
    totalVerifiedUsers: number;
}

export default function GlobalInsights({ globalScore, globalCO2, totalVerifiedUsers }: GlobalInsightsProps) {
    const milestones = [
        {
            limit: 5000,
            label: "Community Garden",
            description: "Starting a local organic garden for fresh produce.",
            icon: <Droplets className="w-5 h-5 text-blue-400" />,
            color: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            limit: 20000,
            label: "50 Neighborhood Trees",
            description: "Planting native trees to provide shade and clean air.",
            icon: <TreePine className="w-5 h-5 text-emerald-500" />,
            color: "bg-emerald-500/10",
            border: "border-emerald-500/20"
        },
        {
            limit: 100000,
            label: "Solar Powered Hub",
            description: "Installing solar panels on our community center.",
            icon: <Sun className="w-5 h-5 text-amber-500" />,
            color: "bg-amber-500/10",
            border: "border-amber-500/20"
        },
        {
            limit: 500000,
            label: "Green School Initiative",
            description: "Transforming local schools with sustainable technology.",
            icon: <Zap className="w-5 h-5 text-purple-400" />,
            color: "bg-purple-500/10",
            border: "border-purple-500/20"
        }
    ];

    const currentMilestone = milestones.find(m => globalCO2 < m.limit) || milestones[milestones.length - 1];
    const prevLimit = milestones[milestones.indexOf(currentMilestone) - 1]?.limit || 0;
    const progress = Math.min(((globalCO2 - prevLimit) / (currentMilestone.limit - prevLimit)) * 100, 100);

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
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Our Global Impact</span>
                </div>
                <h1 className="text-3xl sm:text-4xl luxury-heading text-white tracking-tight">Making a difference together</h1>
                <p className="text-neutral-400 max-w-md mx-auto text-sm sm:text-base font-light">
                    Every small action adds up to a big change for our planet. Here's what we've accomplished so far.
                </p>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Community Members", value: totalVerifiedUsers, icon: <Users className="w-4 h-4" />, color: "text-blue-400" },
                    { label: "CO2 Saved (mg)", value: globalCO2, icon: <Heart className="w-4 h-4" />, color: "text-rose-400" },
                    { label: "Eco Points Earned", value: globalScore, icon: <Sparkles className="w-4 h-4" />, color: "text-luxury-gold" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.1 }}
                        className="luxury-card bg-luxury-glass p-6 flex flex-col items-center gap-2 text-center border-white/5"
                    >
                        <div className={`p-2 rounded-full bg-white/5 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="text-2xl luxury-data text-white tabular-nums">
                            {formatCompactNumber(stat.value)}
                        </div>
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Current Progress Block */}
            <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="luxury-card bg-luxury-glass p-8 sm:p-12 relative overflow-hidden border-white/5"
            >
                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Next Milestone</span>
                            <h2 className="text-2xl sm:text-3xl luxury-heading text-white">{currentMilestone.label}</h2>
                            <p className="text-neutral-400 text-sm max-w-sm">{currentMilestone.description}</p>
                        </div>
                        <div className={`w-16 h-16 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 ${currentMilestone.color}`}>
                            {currentMilestone.icon}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-medium text-neutral-300">Community Progress</span>
                            <span className="text-2xl luxury-data text-white tabular-nums">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden p-1 border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            />
                        </div>
                        <p className="text-xs text-neutral-500 font-medium italic">
                            {formatCompactNumber(currentMilestone.limit - globalCO2)} mg more CO2 saved to reach this goal!
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Upcoming Goals */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] px-2">Timeline of Change</h3>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {milestones.map((m, i) => (
                        <div
                            key={i}
                            className={`luxury-card p-6 border-white/5 transition-all duration-500 ${globalCO2 >= m.limit ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-luxury-glass opacity-60'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl sm:rounded-2xl border border-white/10 ${m.color}`}>
                                    {globalCO2 >= m.limit ? <Sparkles className="w-5 h-5 text-emerald-500" /> : m.icon}
                                </div>
                                <div className="space-y-1">
                                    <h4 className={`luxury-heading text-lg ${globalCO2 >= m.limit ? 'text-emerald-500' : 'text-neutral-300'}`}>{m.label}</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed">{m.description}</p>
                                    <div className="pt-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">
                                            {formatCompactNumber(m.limit)} mg CO2 Goal
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
