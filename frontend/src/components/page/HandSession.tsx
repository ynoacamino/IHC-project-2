import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const HandSession: React.FC = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const getCamera = async () => {
            try {
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
            <button
                onClick={() => navigate('/rehabilitation')}
                className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
            >
                <ArrowLeft className="h-8 w-8" />
            </button>
            {/* Contenedor principal dividido en dos secciones */}
            <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl overflow-hidden flex">
                {/* Sección izquierda con el GIF */}
                <div className="w-1/3 flex items-center justify-center bg-gray-100 p-4">
                    <img
                        src=""
                        alt="Pasos para la sesión de rehabilitación"
                        className="rounded-lg shadow-lg w-full"
                    />
                </div>
                {/* Sección derecha con el video */}
                <div className="w-2/3 relative">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-70">
                        <h1 className="text-3xl font-bold text-center mb-4">Sesión de rehabilitación para manos</h1>
                        <p className="text-center text-gray-700 mb-4">
                            Realiza los ejercicios para mejorar la movilidad y fuerza de tu mano.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HandSession;