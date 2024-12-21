import React, { useRef, useEffect } from 'react';
import { useVideoStream } from '../../hooks/useVideoStream';
import { useVideoElement } from '../../hooks/useVideoElement';

interface VideoCanvasProps {
    width: number;
    height: number;
    onFrame?: (ctx: CanvasRenderingContext2D) => void;
    mirror?: boolean;
}

export function VideoCanvas({
    width,
    height,
    onFrame,
    mirror = true,
}: VideoCanvasProps) {
    const { stream, error, isLoading } = useVideoStream({ width, height });
    const videoRef = useVideoElement(stream);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!videoRef.current || !canvasRef.current) return;

        let animationFrame: number;

        const drawFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2) {
            animationFrame = requestAnimationFrame(drawFrame);
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        if (mirror) {
            ctx.scale(-1, 1);
            ctx.drawImage(video, -width, 0, width, height);
        } else {
            ctx.drawImage(video, 0, 0, width, height);
        }
        ctx.restore();

        onFrame?.(ctx);
        animationFrame = requestAnimationFrame(drawFrame);
        };

        drawFrame();

        return () => {
        cancelAnimationFrame(animationFrame);
        };
    }, [width, height, mirror, onFrame]);

    if (error) {
        return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: No se pudo acceder a la cámara
        </div>
        );
    }

    if (isLoading) {
        return (
        <div className="flex items-center justify-center h-[480px] bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
        );
    }

    return (
        <div className="relative">
        <video
            ref={videoRef}
            className="hidden"
            width={width}
            height={height}
            playsInline
        />
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="rounded-lg border-2 border-gray-700"
        />
        </div>
    );
}