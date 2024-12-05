import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const HandSession: React.FC = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    //const [showText, setShowText] = useState(true);

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

    /*useEffect(() => {
        const timer = setTimeout(() => setShowText(false), 5000);
        return () => clearTimeout(timer);
    }, []);*/

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-800">
            <button
                onClick={() => navigate('/rehabilitation')}
                className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
            >
                <ArrowLeft className="h-8 w-8" />
            </button>
            <div className="flex w-full max-w-6xl items-center space-x-20">
                {/* Tutorial */}
                <div className="bg-gray-600 w-1/4 h-[28rem] rounded-lg shadow-lg p-4 flex flex-col">
                    <h2 className="text-white font-bold text-xl text-center mb-4">Ejercicios</h2>
                    <div className="grid grid-rows-3 gap-4 flex-grow">
                        <div className="bg-gray-700 rounded-lg flex items-center justify-center text-white text-center font-bold text-lg hover:shadow-xl hover:bg-gray-500 transition-all cursor-pointer">
                            Sección 1
                        </div>
                        <div className="bg-gray-700 rounded-lg flex items-center justify-center text-white text-center font-bold text-lg hover:shadow-xl hover:bg-gray-500 transition-all cursor-pointer">
                            Sección 2
                        </div>
                        <div className="bg-gray-700 rounded-lg flex items-center justify-center text-white text-center font-bold text-lg hover:shadow-xl hover:bg-gray-500 transition-all cursor-pointer">
                            Sección 3
                        </div>
                    </div>
                </div>

                {/* Contenido de la cámara */}
                <div className="bg-white rounded-lg shadow-lg w-3/4 overflow-hidden">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        style={{ transform: 'scaleX(-1)' }}
                        autoPlay
                        playsInline
                    />
                    <div className="p-4"
                        /*className={`p-4 transition-opacity duration-1000 ${
                            showText ? 'opacity-100' : 'opacity-0'
                        }`}*/
                    >
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