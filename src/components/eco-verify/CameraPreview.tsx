'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface CameraPreviewProps {
    onCapture: (base64Image: string) => void;
    onClose: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    const [isPreFlight, setIsPreFlight] = useState(false);

    useEffect(() => {
        if (showSplash) return;

        // Pre-flight check simulation
        setIsPreFlight(true);
        const preFlightTimer = setTimeout(() => {
            setIsPreFlight(false);
        }, 2000);

        async function startCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    setStream(mediaStream);
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
                setError('Could not access camera. Please check permissions.');
            }
        }

        startCamera();

        return () => {
            clearTimeout(preFlightTimer);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [showSplash]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
                onCapture(base64Image);
                onClose();
            }
        }
    };

    if (showSplash) {
        return (
            <div className="fixed inset-0 z-[100] bg-white/90 dark:bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden text-neutral-900 dark:text-white">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                    <div className="text-center space-y-2 relative z-10">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <Camera className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold">Ready to verify?</h2>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            We use your camera to identify your eco-action.
                        </p>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg shrink-0">
                                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Instant Analysis</h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">AI verifies your action in seconds.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
                            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Public Feed</h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Your win inspires others (no faces!).</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
                            <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg shrink-0">
                                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Privacy First</h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">We don't save your personal data.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10 pt-2">
                        <button
                            onClick={onClose}
                            className="py-3.5 px-4 rounded-xl font-bold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setShowSplash(false)}
                            className="py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
                        >
                            Let's Go!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-lg aspect-[3/4] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-red-500/10">
                        <X className="w-12 h-12 text-red-500 mb-4" />
                        <p className="text-white font-medium mb-4">{error}</p>
                        <button
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            onLoadedMetadata={() => setIsCameraReady(true)}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPreFlight ? 'opacity-0' : 'opacity-100'}`}
                        />

                        {/* Pre-flight / Scanner Frame Overlay */}
                        <div className="absolute inset-0 border-[2px] border-emerald-500/30 m-8 rounded-2xl pointer-events-none">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />

                            {/* Scanning Line Animation */}
                            <div className="absolute left-0 right-0 top-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-scan-line-camera opacity-50" />
                        </div>

                        {isPreFlight && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                                <div className="space-y-4 text-center">
                                    <div className="flex justify-center">
                                        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 animate-pulse">
                                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] animate-pulse">
                                        Encrypted verification in progress...
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isCameraReady && !isPreFlight && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-8 flex items-center gap-6">
                <button
                    onClick={onClose}
                    className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-all active:scale-90"
                >
                    <X className="w-6 h-6" />
                </button>

                <button
                    onClick={handleCapture}
                    disabled={!isCameraReady}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center group active:scale-95 transition-all disabled:opacity-50"
                >
                    <div className="w-16 h-16 rounded-full border-4 border-black/5 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 group-hover:scale-110 transition-transform" />
                    </div>
                </button>

                <div className="w-14 h-14" /> {/* Spacer */}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <style jsx>{`
        @keyframes scan-line-camera {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan-line-camera {
          animation: scan-line-camera 3s linear infinite;
        }
      `}</style>
        </div>
    );
};
