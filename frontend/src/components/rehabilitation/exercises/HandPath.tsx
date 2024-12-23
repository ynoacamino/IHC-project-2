import React from 'react';

interface HandPathProps {
    isActive: boolean;
}

export function HandPath({ isActive }: HandPathProps) {
    return (
        <svg
            className={`absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0'
            }`}
            viewBox="0 0 640 480"
        >
            {/* Curved path for hand movement */}
            <path
                d="M 120,200 C 220,100 420,100 520,200"
                fill="none"
                stroke="#4ADE80"
                strokeWidth="8"
                strokeDasharray="10 10"
                className="animate-pulse"
            />
            
            {/* Start and end markers */}
            <circle cx="120" cy="200" r="20" fill="#4ADE80" />
            <circle cx="520" cy="200" r="20" fill="#4ADE80" />
        </svg>
    );
}