import React from "react";
import { X as CloseIcon } from "lucide-react";

interface GalleryModalProps {
    storedImages: { id: string, url: string, label: string }[];
    onSelectImage: (url: string) => void;
    onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ storedImages, onSelectImage, onClose }) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
        <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Eco Gallery</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Select a pre-verified action to test</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 hover:text-emerald-500 transition-colors"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4">
                {storedImages.map((img) => (
                    <button
                        key={img.id}
                        onClick={() => onSelectImage(img.url)}
                        className="group relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/5 hover:border-emerald-500 transition-all"
                    >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </button>
                ))}
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-white/5 text-center">
                <p className="text-[10px] text-neutral-500 font-medium">Images for demonstration purposes</p>
            </div>
        </div>
    </div>
);
