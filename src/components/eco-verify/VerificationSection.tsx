import React, { useState } from "react";
import { Camera, Image as ImageIcon, Leaf, X, UploadCloud } from "lucide-react";
import { CameraPreview } from "./CameraPreview";

interface VerificationSectionProps {
    loading: boolean;
    progress: number;
    isPublic: boolean;
    setIsPublic: (isPublic: boolean) => void;
    onTriggerFileInput: () => void;
    onShowGallery: () => void;
    verified: boolean | null;
    feedback: string | null;
    score: number | null;
    earnedVoucher: any | null;
    audioUrl: string | null;
    audioRef: React.RefObject<HTMLAudioElement>;
    onViewVouchers: () => void;
    onCapture: (base64: string) => void;
}

export const VerificationSection: React.FC<VerificationSectionProps> = ({
    loading,
    progress,
    isPublic,
    setIsPublic,
    onTriggerFileInput,
    onShowGallery,
    verified,
    feedback,
    score,
    earnedVoucher,
    audioUrl,
    audioRef,
    onViewVouchers,
    onCapture
}) => {
    const [showCamera, setShowCamera] = useState(false);

    return (
        <>
            <div className="apple-card relative overflow-hidden mb-8 group">
                <div className="p-6 flex flex-col items-center justify-center min-h-[320px] relative z-10 text-center">
                    <div className="mb-6 relative">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 flex items-center justify-center border border-emerald-500/20 mb-4 mx-auto">
                            <Leaf className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Verify Action</h2>
                        <p className="text-sm text-neutral-400 max-w-[240px] mx-auto leading-relaxed">
                            Take a photo of your eco-friendly habit to verify and earn points.
                        </p>
                    </div>

                    <div className="w-full max-w-[320px] space-y-3">
                        <button
                            onClick={() => setShowCamera(true)}
                            disabled={loading}
                            className="primary-btn rounded-2xl w-full py-4 flex items-center justify-center gap-3 text-lg font-bold shadow-lg active:scale-95 transition-transform"
                        >
                            <Camera className="w-6 h-6" />
                            <span>{loading ? "Wait..." : "Scan Environment"}</span>
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onTriggerFileInput}
                                disabled={loading}
                                className="bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl py-3 flex flex-col items-center justify-center gap-1.5 text-sm font-bold shadow-sm border border-neutral-200 dark:border-white/10 transition-all active:scale-95"
                            >
                                <UploadCloud className="w-5 h-5 text-blue-500" />
                                <span>Upload File</span>
                            </button>

                            <button
                                onClick={onShowGallery}
                                disabled={loading}
                                className="bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl py-3 flex flex-col items-center justify-center gap-1.5 text-sm font-bold shadow-sm border border-neutral-200 dark:border-white/10 transition-all active:scale-95"
                            >
                                <ImageIcon className="w-5 h-5 text-purple-500" />
                                <span>App Gallery</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-10 h-5 rounded-full transition-colors ${isPublic ? 'bg-emerald-500' : 'bg-neutral-600'}`}>
                                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>
                            <span className="text-xs text-neutral-400 font-medium group-hover:text-neutral-300">Share with global community</span>
                        </label>
                    </div>
                </div>

                {loading && (
                    <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 transition-all duration-500">
                        <div className="relative w-24 h-24 mb-6">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} transform="rotate(-90 50 50)" className="transition-all duration-300 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-white tabular-nums">{Math.round(progress)}%</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">Analyzing...</h3>
                        <p className="text-sm text-neutral-400">Verifying your eco-action</p>
                    </div>
                )}
            </div>

            {
                (feedback || verified !== null) && (
                    <div className={`apple-card p-5 mb-8 flex flex-col gap-3 transition-all duration-300 ${verified ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${verified ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {verified ? <Leaf className="w-4 h-4" /> : <div className="w-4 h-4 rounded-sm border-2 border-current" />}
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold ${verified ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {verified ? "Verified!" : "Could not verify"}
                                    </p>
                                    {feedback && <p className="text-sm text-neutral-500 dark:text-neutral-300 leading-snug mt-1">{feedback}</p>}
                                </div>
                            </div>
                            {verified && typeof score === "number" && (
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex flex-col items-center bg-black/5 dark:bg-white/5 rounded-lg px-3 py-1.5 border border-black/5 dark:border-white/5">
                                        <span className="text-[10px] uppercase text-neutral-500 font-bold">Score</span>
                                        <span className="text-xl font-bold text-emerald-500 tabular-nums">+{score}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {earnedVoucher && (
                            <div className="mt-3 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 relative overflow-hidden animate-slide-up">
                                <p className="text-xs uppercase tracking-widest text-purple-500 font-bold mb-1">Reward Unlocked!</p>
                                <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{earnedVoucher.title}</h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{earnedVoucher.description}</p>
                                <div className="flex items-center justify-between bg-black/5 dark:bg-black/40 rounded px-3 py-2 border border-purple-500/20">
                                    <code className="font-mono text-purple-600 dark:text-purple-300 font-bold">{earnedVoucher.code}</code>
                                    <button onClick={onViewVouchers} className="text-[10px] bg-purple-500 text-white px-2 py-1 rounded transition-colors">
                                        View Wallet
                                    </button>
                                </div>
                            </div>
                        )}

                        {audioUrl && (
                            <div className="mt-2 bg-black/5 dark:bg-black/20 rounded-lg p-2">
                                <audio ref={audioRef} src={audioUrl || undefined} controls className="w-full h-8 opacity-80" />
                            </div>
                        )}
                    </div>
                )
            }

            {
                showCamera && (
                    <CameraPreview
                        onCapture={onCapture}
                        onClose={() => setShowCamera(false)}
                    />
                )
            }
        </>
    );
};
