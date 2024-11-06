import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ArmSession: React.FC = () => {
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
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
                <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                />
                <div className="p-4">
                <h1 className="text-3xl font-bold text-center mb-4">Sesión de rehabilitación para brazos</h1>
                <p className="text-center text-gray-700 mb-4">
                    Realiza ejercicios diseñados para mejorar la fuerza y movilidad de los músculos de tus brazos.
                </p>
                {/**/}
                </div>
            </div>
        </div>
    );
};

export default ArmSession;