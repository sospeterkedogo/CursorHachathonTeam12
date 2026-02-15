"use client";

import { X } from "lucide-react";
import FeedbackForm from "./FeedbackForm";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    username?: string;
}

export default function FeedbackModal({ isOpen, onClose, username }: FeedbackModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 animate-in zoom-in slide-in-from-bottom-4 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        We value your feedback
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        How are we doing? Your input helps us build a better Eco-Verify.
                    </p>
                </div>

                <FeedbackForm onSuccess={onClose} username={username} />
            </div>
        </div>
    );
}
