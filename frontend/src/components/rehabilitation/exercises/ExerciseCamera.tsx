import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../page/SettingsContext';
import { Settings } from 'lucide-react';
import { Zone } from './types';

interface ExerciseCameraProps {
    onColorDetected: (x: number, y: number) => void;
    zones: Zone[];
    width: number;
    height: number;
}

function ExerciseCamera({
    onColorDetected,
    zones,
    width,
    height,
}: ExerciseCameraProps) {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { red, green, blue } = useSettings();

    useEffect(() => {
        const setupCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
        };

        setupCamera();

        return () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        };
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const processFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Dibujar el video con efecto espejo
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -width, 0, width, height);
        ctx.restore();

        // Detectar color
        const frame = ctx.getImageData(0, 0, width, height);
        const { data } = frame;
        const detectedPixels = [];

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (Math.abs(r - red) < 30 && Math.abs(g - green) < 30 && Math.abs(b - blue) < 30) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);
            detectedPixels.push({ x, y });
            }
        }

        if (detectedPixels.length > 0) {
            const centerX = detectedPixels.reduce((sum, pixel) => sum + pixel.x, 0) / detectedPixels.length;
            const centerY = detectedPixels.reduce((sum, pixel) => sum + pixel.y, 0) / detectedPixels.length;

            // Dibujar el punto detectado
            ctx.beginPath();
            ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fill();

            onColorDetected(centerX, centerY);
        }

        // Dibujar zonas
        zones.forEach((zone) => {
            ctx.beginPath();
            ctx.rect(zone.x, zone.y, zone.width, zone.height);
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Dibujar etiqueta
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.fillText(zone.label, zone.x, zone.y - 5);
        });

        animationFrameId = requestAnimationFrame(processFrame);
        };

        processFrame();

        return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        };
    }, [width, height, red, green, blue, zones, onColorDetected]);

    return (
        <div className="relative">
            <button
                onClick={() => navigate('/settings')}
                className="absolute top-4 left-4 text-white hover:scale-110 transition-transform duration-300 z-50"
                type="button"
            >
                <Settings className="h-8 w-8" />
            </button>
        <video
            ref={videoRef}
            className="hidden"
            width={width}
            height={height}
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

export default ExerciseCamera;