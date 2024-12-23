import React from 'react';

interface StepImagesProps {
    images: { src: string; alt: string }[];
}

export function StepImages({ images }: StepImagesProps) {
    return (
        <div className="flex justify-center gap-4 mt-4">
        {images.map((image, index) => (
            <div
            key={index}
            className="w-32 h-24 rounded-lg overflow-hidden border-2 border-gray-700"
            >
            <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
            />
            </div>
        ))}
        </div>
    );
}