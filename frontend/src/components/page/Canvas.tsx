import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Canvas = () => {
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
        <h1 className="text-4xl font-bold text-white mb-8">Canvas Mode</h1>
        <div className="bg-white rounded-lg p-4 max-w-4xl mx-auto">
          <canvas 
            className="w-full border-2 border-gray-300 rounded"
            height="600"
          >
            Canvas not supported
          </canvas>
        </div>
      </div>
    </div>
  );
};

export default Canvas;