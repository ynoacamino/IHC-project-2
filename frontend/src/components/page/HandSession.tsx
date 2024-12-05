import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
        const timer0 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("Bienvenido a la sesión de rehabilitación para manos");
                setShowText(true);
            }, 500);
        }, 3000);

        const timer1 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("En la parte de abajo puedes seleccionar el ejercicio que deseas realizar");
                setShowText(true);
            }, 500);
        }, 8000);

        const timer2 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("Estos ejercicios te ayudarán a reforzar la fuerza en tu muñeca y recuperar la sensibilidad");
                setShowText(true);
            }, 500);
        }, 12000);

        const timer3 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("Cuando estés en un ejercicio, debes seguir los pasos que se irán mostrando en la zona izquierda de la pantalla");
                setShowText(true);
            }, 500);
        }, 16000);

        const timer4 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("Sobre la cámara, se irán dibujando líneas de guía que deberás seguir para cumplir cada ejercicio");
                setShowText(true);
            }, 500);
        }, 20000);

        const timer5 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("Recuerda que una recomendación es realizar estos ejercicios al menos 3 veces al día");
                setShowText(true);
            }, 500);
        }, 24000);

        const timer6 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("¡Buena suerte!");
                setShowText(true);
            }, 500);
        }, 28000);

        const timer7 = setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
                setText("");
            }, 500);
        }, 30000);

        return () => {
            clearTimeout(timer0);
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
            clearTimeout(timer6);
            clearTimeout(timer7);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <button
                onClick={() => navigate('/rehabilitation')}
                className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
            >
                <ArrowLeft className="h-8 w-8" />
            </button>

            {/* Encabezado fuera de la cámara */}
            <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-white text-center z-10">
                Rehabilitación para manos
            </h1>

            {/* Contenedor de la cámara, más pequeño y centrado */}
            <div className="flex w-full max-w-6xl items-center justify-center mb-6 mt-10">
                <div className="relative bg-white rounded-lg shadow-lg w-full h-[700px] overflow-hidden">
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

            {/* Botones para ir a los ejercicios, fuera de la cámara */}
            <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <button 
                    onClick={() => navigate('/hand-exercise-1')}
                    className="px-9 py-5 rounded-full bg-gray-600 text-white font-semibold text-2xl hover:bg-gray-700 transition-colors"
                >
                    Ejercicio 1
                </button>

                {/* Circulitos de separación */}
                <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>

                <button 
                    onClick={() => navigate('/hand-exercise-2')}
                    className="px-9 py-5 rounded-full bg-gray-600 text-white font-semibold text-2xl hover:bg-gray-700 transition-colors"
                >
                    Ejercicio 2
                </button>
            </div>
        </div>
    );
};

export default HandSession;