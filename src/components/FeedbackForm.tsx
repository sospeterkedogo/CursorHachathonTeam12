"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitFeedback } from "@/lib/api";
import { getUserId } from "@/lib/userId";

interface FeedbackFormProps {
    onSuccess?: () => void;
    username?: string;
}

export default function FeedbackForm({ onSuccess, username }: FeedbackFormProps) {
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 && !comment.trim()) {
            setError("Please provide at least a rating or a comment.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await submitFeedback({
                userId: getUserId(),
                username: username,
                rating: rating > 0 ? rating : undefined,
                comment: comment.trim() || undefined,
            });
            setIsSuccess(true);
            if (onSuccess) {
                setTimeout(onSuccess, 2000);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Thank You!</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Your feedback helps us improve Eco-Verify.</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
                <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider block text-center">
                    Rate your experience
                </label>
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="p-1 transition-transform active:scale-90"
                        >
                            <Star
                                className={`w-10 h-10 transition-colors ${(hover || rating) >= star
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-neutral-300 dark:text-neutral-700"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <label htmlFor="comment" className="text-sm font-semibold text-neutral-500 uppercase tracking-wider block">
                    Share your feedback
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What can we improve? What do you love?"
                    className="w-full min-h-[120px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 text-center font-medium">{error}</p>
            )}

            <button
                type="submit"
                disabled={isSubmitting || (rating === 0 && !comment.trim())}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Submit Feedback
                    </>
                )}
            </button>
        </form>
    );
}
