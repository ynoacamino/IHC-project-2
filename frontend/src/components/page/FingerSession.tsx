/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FastForward } from 'lucide-react';

function FingerSession() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [text, setText] = useState('¡Hola!');
  const [showText, setShowText] = useState(true);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing the camera: ', error);
      }
    };

    getCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const updateText = (newText: string, show: boolean) => {
    setShowText(false);
    setTimeout(() => {
      setText(newText);
      setShowText(show);
    }, 500);
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => updateText('¡Bienvenido a la sesión de rehabilitación para dedos!', true), 3000),
      setTimeout(() => updateText('Selecciona en la parte inferior el ejercicio que deseas realizar.', true), 8000),
      setTimeout(() => updateText('Estos ejercicios están diseñados para mejorar la destreza y fuerza de tus dedos.', true), 12000),
      setTimeout(() => updateText('Sigue las instrucciones en la pantalla para completar cada ejercicio.', true), 16000),
      setTimeout(() => updateText('Observa las líneas de guía en la cámara y trata de seguirlas con tus dedos.', true), 20000),
      setTimeout(() => updateText('Es importante realizar estos ejercicios regularmente para obtener resultados óptimos.', true), 24000),
      setTimeout(() => updateText('¡Puedes practicar directamente usando el canvas con tu cámara actual!', true), 28000),
      setTimeout(() => updateText('¡Buena suerte en tu rehabilitación de dedos!', true), 32000),
      setTimeout(() => {
        setText('');
        setShowText(false);
      }, 35000),
    ];

    timersRef.current = timers;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const skipTexts = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
    setShowText(false);
    setText('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <button
        onClick={() => navigate('/rehabilitation')}
        className="absolute top-4 left-4 text-white hover:text-blue-400 transition-colors"
        type="button"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-white text-center z-10">
        Rehabilitación para dedos
      </h1>

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

      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={() => navigate('/finger-exercise-1')}
          className="px-9 py-5 rounded-full bg-gray-600 text-white font-semibold text-2xl hover:bg-gray-700 transition-colors"
          type="button"
        >
          Ejercicio 1
        </button>
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
        </div>
        <button
          onClick={() => navigate('/finger-exercise-2')}
          className="px-9 py-5 rounded-full bg-gray-600 text-white font-semibold text-2xl hover:bg-gray-700 transition-colors"
          type="button"
        >
          Ejercicio 2
        </button>
      </div>

      <button
        onClick={skipTexts}
        className="absolute bottom-9 right-9 p-5 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-colors shadow-lg"
        type="button"
      >
        <FastForward className="h-9 w-9" />
      </button>
    </div>
  );
}

export default FingerSession;
