import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Lightbulb, ShoppingBag } from "lucide-react";
import { formatCompactNumber } from "@/lib/format";

interface WeeklyTrendData {
    date: string;
    co2Saved: number;
}

interface NextBestActionData {
    itemDetected: string;
    suggestion: string;
    reason: string;
}

interface WeeklyImpactSummaryProps {
    weeklyTrend?: WeeklyTrendData[];
    nextBestAction?: NextBestActionData;
}

export const WeeklyImpactSummary: React.FC<WeeklyImpactSummaryProps> = ({ weeklyTrend, nextBestAction }) => {
    // Reformat dates for display (e.g., 'Mon', 'Tue')
    const chartData = weeklyTrend?.map(data => {
        const dateObj = new Date(data.date);
        return {
            ...data,
            day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        };
    }).reverse() || []; // Reverse so oldest is first, newest is last on the right

    return (
        <div className="flex flex-col gap-6">
            {/* Trend Chart Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="luxury-card bg-luxury-glass p-6 sm:p-8 border-white/5"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">7-Day Impact Trend</h3>
                    </div>
                </div>

                <div className="h-48 w-full mt-4">
                    {chartData && chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => formatCompactNumber(val)}
                                    tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="p-3 bg-black/90 border border-white/10 rounded-xl backdrop-blur-xl shadow-2xl">
                                                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{payload[0].payload.day}</p>
                                                    <p className="font-bold text-white tabular-nums flex items-center gap-2">
                                                        {formatCompactNumber(payload[0].value as number)} <span className="text-[10px] text-emerald-500 uppercase tracking-widest">mg Saved</span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="co2Saved"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCO2)"
                                    activeDot={{ r: 6, fill: '#10b981', stroke: '#000', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 opacity-50">
                            <TrendingUp className="w-6 h-6 mb-2" />
                            <span className="text-xs font-bold uppercase tracking-widest">No Data Yet</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Next Best Action Card */}
            {nextBestAction && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative overflow-hidden luxury-card bg-gradient-to-br from-indigo-500/10 via-black to-black border border-indigo-500/20 p-6 sm:p-8"
                >
                    <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none">
                        <Lightbulb className="w-48 h-48 text-indigo-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Lightbulb className="w-4 h-4 text-indigo-400" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Next Best Action</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Most Detected Non-Eco Item</p>
                                <p className="text-lg font-medium text-white capitalize">{nextBestAction.itemDetected}</p>
                            </div>

                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                                <p className="text-sm text-indigo-100/80 leading-relaxed font-medium">"{nextBestAction.suggestion}"</p>
                                <p className="text-[10px] text-indigo-400/60 mt-2 uppercase tracking-widest font-bold flex items-center gap-1">
                                    <ArrowRight className="w-3 h-3" /> {nextBestAction.reason}
                                </p>
                            </div>

                            <button className="w-full mt-2 group relative overflow-hidden rounded-2xl bg-white text-black py-4 px-6 font-bold text-sm tracking-widest uppercase transition-transform active:scale-[0.98] flex items-center justify-center gap-3">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                <ShoppingBag className="w-4 h-4 z-10" />
                                <span className="z-10">Buy Sustinable Swap & Verify</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
