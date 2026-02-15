"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, ArrowLeft, Loader2, Calendar, User } from "lucide-react";
import Link from "next/link";
import { getFeedback } from "@/lib/api";

interface FeedbackEntry {
    _id: string;
    userId: string;
    username: string;
    rating?: number;
    comment?: string;
    timestamp: string;
}

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeedback() {
            try {
                const data = await getFeedback();
                setFeedback(data.feedback || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load feedback. Please check if you are connected.");
            } finally {
                setLoading(false);
            }
        }
        fetchFeedback();
    }, []);

    const averageRating = feedback.length > 0
        ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.filter(f => f.rating).length).toFixed(1)
        : "0.0";

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-white/5 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                                Feedback Dashboard
                            </h1>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                Manage and view user sentiment
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="apple-card p-6 flex items-center justify-between bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-white/10">
                        <div>
                            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Average Rating</p>
                            <h2 className="text-4xl font-black text-amber-500 mt-1">{averageRating}</h2>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                        </div>
                    </div>
                    <div className="apple-card p-6 flex items-center justify-between bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-white/10">
                        <div>
                            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Total Reviews</p>
                            <h2 className="text-4xl font-black text-purple-500 mt-1">{feedback.length}</h2>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 px-1">
                        Recent Feedback
                    </h3>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                            <p className="text-neutral-500">Loading feedback...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 p-8 rounded-3xl text-center">
                            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    ) : feedback.length === 0 ? (
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-12 rounded-3xl text-center">
                            <p className="text-neutral-500">No feedback submitted yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {feedback.map((item) => (
                                <div
                                    key={item._id}
                                    className="apple-card p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className={`w-4 h-4 ${(item.rating || 0) >= s
                                                                    ? "text-amber-400 fill-amber-400"
                                                                    : "text-neutral-300 dark:text-neutral-800"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-neutral-400">•</span>
                                                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>

                                            {item.comment && (
                                                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                                                    &ldquo;{item.comment}&rdquo;
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-white/5 px-3 py-1.5 rounded-full shrink-0 self-start">
                                            <User className="w-3.5 h-3.5 text-neutral-400" />
                                            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 truncate max-w-[120px]">
                                                {item.username}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
