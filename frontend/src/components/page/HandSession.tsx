import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Hand } from 'lucide-react';

import Hand1 from '../../assets/images/hand1.png';
import Hand2 from '../../assets/images/hand2.png';
import Hand3 from '../../assets/images/hand3.png';

const HandSession: React.FC = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [text, setText] = useState('¡Hola!');
    const [showText, setShowText] = useState(true);

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

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("Estos ejercicios te ayudarán a reforzar la fuerza en tu muñeca y recuperar la sensibilidad");
                setShowText(true);
            }, 500);
        }, 3000);
    
        const timer2 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("A continuación, seguirás los pasos de la parte izquierda de la pantalla");
                setShowText(true);
            }, 500);
        }, 8000);
    
        const timer3 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("Sobre la cámara, se dibujará una línea de guía que deberás seguir para cumplir cada paso");
                setShowText(true);
            }, 500);
        }, 12000);
    
        const timer4 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("¡Buena suerte!");
                setShowText(true);
            }, 500);
        }, 16000);

        const timer5 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("");
            }, 500);
        }, 19000);
    
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <button
                onClick={() => navigate('/rehabilitation')}
                className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
            >
                <ArrowLeft className="h-8 w-8" />
            </button>
            <h1 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-5xl font-bold text-white text-center mb-4 z-10">
                Rehabilitación para manos
            </h1>
            <div className="flex w-full max-w-6xl items-center space-x-20">
                {/* Tutorial */}
                <div className="bg-gray-700 w-1/4 h-[36rem] rounded-lg shadow-lg p-6 flex flex-col">
                    <h2 className="text-gray-100 font-bold text-3xl text-center mb-5">P A S O S</h2>
                    <div className="grid grid-rows-3 gap-5 flex-grow">
                        <div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center text-white text-center font-bold text-lg transition-all cursor-pointer hover:brightness-75 hover:scale-95 transform duration-300">
                            <img src={Hand1} alt="Paso 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center text-white text-center font-bold text-lg transition-all cursor-pointer hover:brightness-75 hover:scale-95 transform duration-300">
                            <img src={Hand2} alt="Paso 2" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center text-white text-center font-bold text-lg transition-all cursor-pointer hover:brightness-75 hover:scale-95 transform duration-300">
                            <img src={Hand3} alt="Paso 3" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Contenido de la cámara */}
                <div className="relative bg-white rounded-lg shadow-lg w-3/4 overflow-hidden">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        style={{ transform: 'scaleX(-1)' }}
                        autoPlay
                        playsInline
                    />
                    {text && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4">
                            <h1
                                className={`text-5xl font-bold text-white text-center mb-4 transition-opacity duration-500 ${
                                    showText ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                {text}
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HandSession;