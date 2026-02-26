'use client';

import React from 'react';
import { AVATARS_DATA } from '@/constants';

interface EcoOrbProps {
    id: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const EcoOrb: React.FC<EcoOrbProps> = ({ id, size = 'md', className = '' }) => {
    const orb = AVATARS_DATA.find(a => a.id === id) || AVATARS_DATA[0];

    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    return (
        <div className={`relative rounded-full overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)] border-2 border-white/10 ${sizeClasses[size]} ${className}`}>
            {/* Vivid Background Core */}
            <div className={`absolute inset-0 bg-gradient-to-br ${orb.color} opacity-100 saturate-150 contrast-110`} />

            {/* Dynamic Lighting Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/30" />

            {/* Rim Lighting (Discord Style) */}
            <div className="absolute inset-0 rounded-full border-[1.5px] border-white/20" />

            {/* Metaverse-Style Character Avatar */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                    src={`https://api.dicebear.com/9.x/micah/svg?seed=${orb.id}&backgroundColor=transparent&baseColor=f9c9b6`}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.6)] transform scale-125 translate-y-[10%]"
                    alt={orb.label}
                    loading="lazy"
                />
            </div>

            {/* Glossy Overlay Finish */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </div>
    );
};
