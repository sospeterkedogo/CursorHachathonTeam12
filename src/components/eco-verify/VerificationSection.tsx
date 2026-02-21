import React, { useState } from "react";
import { Camera, Image as ImageIcon, Leaf, X, UploadCloud, ArrowRight, Trophy } from "lucide-react";
import { CameraPreview } from "./CameraPreview";
import { motion, AnimatePresence } from "framer-motion";

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
    lastCapturedImage?: string | null;
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
    onCapture,
    lastCapturedImage
}) => {
    const [showCamera, setShowCamera] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    React.useEffect(() => {
        setIsDesktop(window.innerWidth > 1024);
        const handleResize = () => setIsDesktop(window.innerWidth > 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full"
        >
            <div className="luxury-card relative overflow-hidden mb-8 group p-6 sm:p-10">
                <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] relative z-10 text-center">
                    <motion.div variants={itemVariants} className="mb-6 sm:mb-8 relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 mb-4 sm:mb-6 mx-auto backdrop-blur-md">
                            <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl sm:text-4xl luxury-heading mb-3 font-medium">Waste Auditor</h2>
                        <p className="text-[12px] sm:text-sm text-neutral-400 max-w-[280px] mx-auto leading-relaxed font-light tracking-wide">
                            Experience the art of sustainable auditing. Scan your waste or your reusables.
                        </p>
                    </motion.div>

                    {isDesktop && (
                        <motion.div variants={itemVariants} className="mb-10 p-6 bg-luxury-glass rounded-3xl border border-white/5 flex flex-col items-center gap-4">
                            <div className="w-40 h-40 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center relative shadow-2xl overflow-hidden border border-white/10">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${typeof window !== 'undefined' ? window.location.href : ''}`}
                                    alt="QR Code"
                                    className="w-32 h-32 opacity-90"
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-1">Mobile Access</span>
                                <p className="text-[10px] text-neutral-500 font-medium">Scan to verify with your camera</p>
                            </div>
                        </motion.div>
                    )}

                    <div className="w-full max-w-[400px] flex flex-col items-center">
                        <motion.div variants={itemVariants} className="action-orb-container mb-10">
                            <button
                                onClick={() => setShowCamera(true)}
                                disabled={loading}
                                className="action-orb group"
                            >
                                <Camera className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
                            </button>
                            <span className="absolute -bottom-7 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500 opacity-80">
                                {loading ? "Analyzing..." : "Begin Audit"}
                            </span>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 w-full mt-4">
                            <button
                                onClick={onTriggerFileInput}
                                disabled={loading}
                                className="bg-luxury-glass hover:bg-white/5 text-neutral-900 dark:text-white rounded-2xl py-4 flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 border border-white/5"
                            >
                                <UploadCloud className="w-5 h-5 text-blue-400" />
                                <span className="uppercase tracking-[0.1em] opacity-70">Upload</span>
                            </button>

                            <button
                                onClick={onShowGallery}
                                disabled={loading}
                                className="bg-luxury-glass hover:bg-white/5 text-neutral-900 dark:text-white rounded-2xl py-4 flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 border border-white/5"
                            >
                                <ImageIcon className="w-5 h-5 text-purple-400" />
                                <span className="uppercase tracking-[0.1em] opacity-70">Gallery</span>
                            </button>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="mt-10">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-12 h-6 rounded-full transition-colors duration-500 ${isPublic ? 'bg-emerald-500/40' : 'bg-neutral-800'}`}>
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-xl ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest group-hover:text-neutral-300 transition-colors">Global Sharing</span>
                        </label>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-10"
                        >
                            {lastCapturedImage && (
                                <div className="absolute inset-0 -z-10 opacity-20">
                                    <img
                                        src={lastCapturedImage.startsWith('data:') ? lastCapturedImage : `data:image/jpeg;base64,${lastCapturedImage}`}
                                        alt="Preview"
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>
                            )}
                            <div className="relative w-32 h-32 mb-10">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r="48"
                                        fill="none"
                                        stroke="var(--luxury-emerald)"
                                        strokeWidth="2"
                                        strokeDasharray="301.6"
                                        initial={{ strokeDashoffset: 301.6 }}
                                        animate={{ strokeDashoffset: 301.6 - (301.6 * progress) / 100 }}
                                        transform="rotate(-90 50 50)"
                                        className="transition-all duration-500 ease-linear"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl luxury-data text-white">{Math.round(progress)}</span>
                                </div>
                            </div>
                            <h3 className="text-2xl luxury-heading text-white mb-2">Auditing Waste</h3>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">Refining Impact Data</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {(feedback || verified !== null) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`luxury-card p-10 mb-8 flex flex-col gap-6 border-t-4 ${verified ? 'border-emerald-500' : 'border-red-500'}`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-6">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md ${verified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                    {verified ? <Leaf className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-2xl luxury-heading mb-2 ${verified ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {verified ? "Verification Success" : "Audit Incomplete"}
                                    </h4>
                                    {feedback && <p className="text-sm text-neutral-400 leading-relaxed font-light">{feedback}</p>}
                                </div>
                            </div>
                            {verified && typeof score === "number" && (
                                <div className="bg-luxury-glass px-8 py-5 rounded-3xl border border-white/5 text-center min-w-[150px]">
                                    <span className="text-[10px] uppercase text-neutral-500 font-black tracking-widest block mb-1">Impact Gained</span>
                                    <span className="text-3xl luxury-data text-emerald-500">+{score}</span>
                                </div>
                            )}
                        </div>

                        {earnedVoucher && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[30px] p-8 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Trophy size={80} className="text-purple-500" />
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.4em] text-purple-500 font-black mb-3 block">Privileged Access</span>
                                <h4 className="text-3xl luxury-heading text-white mb-2">{earnedVoucher.title}</h4>
                                <p className="text-sm text-neutral-400 mb-8 font-light max-w-md">{earnedVoucher.description}</p>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                    <div className="flex-1 bg-black/40 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/5 flex items-center justify-between">
                                        <code className="luxury-data text-xl text-purple-300">{earnedVoucher.code}</code>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-purple-500/40" />)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={onViewVouchers}
                                        className="bg-white text-black luxury-data text-xs px-8 py-4 rounded-2xl hover:bg-neutral-200 transition-colors uppercase tracking-widest font-bold"
                                    >
                                        Wallet
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {audioUrl && (
                            <div className="mt-4 bg-neutral-900/50 rounded-2xl p-4 border border-white/5">
                                <audio ref={audioRef} src={audioUrl || undefined} controls className="w-full h-8 opacity-40 grayscale invert contrast-200" />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {showCamera && (
                <CameraPreview
                    onCapture={onCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </motion.div>
    );
};
