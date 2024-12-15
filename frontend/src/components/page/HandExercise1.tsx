/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import HandStep1 from '../../assets/images/hand_ex1_step1.png';
import HandStep2 from '../../assets/images/hand_ex1_step2.png';
import HandStep3 from '../../assets/images/hand_ex1_step3.png';

function HandExercise1() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [text, setText] = useState('¡Ejercicio 1!');
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

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowText(false);
      setTimeout(() => {
        setText('Sigue los pasos ubicados en la zona izquierda de la pantalla');
        setShowText(true);
      }, 500);
    }, 3000);

    const timer2 = setTimeout(() => {
      setShowText(false);
      setTimeout(() => {
        setText('');
      }, 500);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <button
        onClick={() => navigate('/hand-session')}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
        type="button"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>
      <h1 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-5xl font-bold text-white text-center mb-4 z-10">
        Primer Ejercicio
      </h1>
      <div className="flex w-full max-w-6xl items-center space-x-20">
        {/* Tutorial */}
        <div className="bg-gray-700 w-1/4 h-[36rem] rounded-lg shadow-lg p-6 flex flex-col">
          <h2 className="text-gray-100 font-bold text-3xl text-center mb-5">P A S O S</h2>
          <div className="grid grid-rows-3 gap-5 flex-grow">
            <div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center text-white text-center font-bold text-lg transition-all cursor-pointer hover:brightness-75 hover:scale-95 transform duration-300">
              <img src={HandStep1} alt="Paso 1" className="w-full h-full object-cover" />
            </div>
            <div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center text-white text-center font-bold text-lg transition-all cursor-pointer hover:brightness-75 hover:scale-95 transform duration-300">
              <img src={HandStep2} alt="Paso 2" className="w-full h-full object-cover" />
            </div>
            <div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center text-white text-center font-bold text-lg transition-all cursor-pointer hover:brightness-75 hover:scale-95 transform duration-300">
              <img src={HandStep3} alt="Paso 3" className="w-full h-full object-cover" />
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

      {/* Botones para Ejercicio */}
      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        {/* Botón Ejercicio 1 */}
        <button
          onClick={() => navigate('/hand-exercise-1')}
          className="px-9 py-5 rounded-full bg-green-600 text-white font-semibold text-2xl hover:bg-green-700 transition-colors"
          type="button"
        >
          Ejercicio 1
        </button>

        {/* Circulitos de separación */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
        </div>

        {/* Botón Ejercicio 2 */}
        <button
          onClick={() => navigate('/hand-exercise-2')}
          className="px-9 py-5 rounded-full bg-gray-600 text-white font-semibold text-2xl hover:bg-gray-700 transition-colors"
          type="button"
        >
          Ejercicio 2
        </button>
      </div>
    </div>
  );
}

export default HandExercise1;
