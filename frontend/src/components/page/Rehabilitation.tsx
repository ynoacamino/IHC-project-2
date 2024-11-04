import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Hand, Pointer, BicepsFlexed } from 'lucide-react';

const Rehabilitation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={() => navigate('/game-options')}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Rehabilitation</h1>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sección de la mano */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <Hand className="mr-2" />
              HANDS
            </h2>
            <p className="text-gray-300 mb-4">Realiza una serie de ejercicios para mejorar la movilidad y fuerza de la mano.</p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2121/2121078.png"
              alt="Mano"
              className="w-44 h-44 mx-auto mb-4"
            />
            <button 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full"
              onClick={() => navigate('/hand-session')}
            >
              
              Start Session
            </button>
          </div>

          {/* Sección del brazo */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <BicepsFlexed className="mr-2" />
              ARMS
            </h2>
            <p className="text-gray-300 mb-4">Participa en ejercicios diseñados para fortalecer los músculos del brazo.</p>
            <img
              src="https://cdn-icons-png.freepik.com/512/5018/5018063.png"
              alt="Brazo"
              className="w-44 h-44 mx-auto mb-4"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full">
              Start Session
            </button>
          </div>

          {/* Sección de los dedos */}
          <div className="md:col-span-2 bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <Pointer className="mr-2" />
              FINGERS
            </h2>
            <p className="text-gray-300 mb-4">Ejercita y fortalece los dedos mediante sesiones específicas de rehabilitación.</p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/6907/6907294.png"
              alt="Dedos"
              className="w-44 h-44 mx-auto mb-4"
            />
            <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors w-full">
              Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rehabilitation;