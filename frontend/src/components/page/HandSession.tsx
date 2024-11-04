import React, { useEffect, useRef } from 'react';

const HandSession: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const getCamera = async () => {
        try {
            // Solicitar acceso a la cámara
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            }
        } catch (error) {
            console.error("Error accessing the camera: ", error);
        }
        };

        getCamera();

        // Cleanup function to stop the video stream when the component unmounts
        return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-800">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
            <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            />
            <div className="p-4">
            <h1 className="text-3xl font-bold text-center mb-4">Sesión de Manos</h1>
            <p className="text-center text-gray-700 mb-4">
                Realiza los ejercicios para mejorar la movilidad y fuerza de tu mano.
            </p>
            {/* Aquí puedes añadir más elementos como instrucciones, botones, etc. */}
            </div>
        </div>
        </div>
    );
};

export default HandSession;
