import React from "react";
import { X as CloseIcon } from "lucide-react";

interface LightboxProps {
    image: string | null;
    onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
    if (!image) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <button
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white z-[110] hover:bg-white/20 transition-all"
                onClick={onClose}
            >
                <CloseIcon className="w-8 h-8" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <img
                    src={image.length > 200
                        ? (image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`)
                        : image}
                    className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-fade-in"
                    alt="Enlarged eco action"
                />
            </div>

            <div className="absolute bottom-10 left-0 right-0 text-center text-white/60 text-sm font-medium">
                Tap to close
            </div>
        </div>
    );
};
