'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

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

    useEffect(() => {
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
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

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
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Scanner Frame Overlay */}
                        <div className="absolute inset-0 border-[2px] border-emerald-500/30 m-8 rounded-2xl pointer-events-none">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />

                            {/* Scanning Line Animation */}
                            <div className="absolute left-0 right-0 top-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-scan-line-camera opacity-50" />
                        </div>

                        {!isCameraReady && (
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
