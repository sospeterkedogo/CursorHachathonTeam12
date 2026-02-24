'use client';

import React from 'react';

interface AudioPlayerProps {
    audioUrl: string;
    audioRef: React.RefObject<HTMLAudioElement>;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, audioRef }) => {
    return (
        <div className="mt-4 bg-neutral-900/50 rounded-2xl p-4 border border-white/5">
            <audio ref={audioRef} src={audioUrl} controls className="w-full h-8 opacity-40 grayscale invert contrast-200" />
        </div>
    );
};
