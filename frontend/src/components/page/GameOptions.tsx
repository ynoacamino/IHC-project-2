import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Gamepad2, Zap, ArrowLeft } from 'lucide-react';

const GameOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="h-8 w-8" />
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">
            Choose Your Adventure
          </h1>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/canvas')}
            className="w-full group relative flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <Palette className="mr-2 h-6 w-6" />
            Canvas
          </button>

          <button
            onClick={() => navigate('/videogames')}
            className="w-full group relative flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <Gamepad2 className="mr-2 h-6 w-6" />
            Video Games
          </button>

          <button
            onClick={() => navigate('/quick-session')}
            className="w-full group relative flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <Zap className="mr-2 h-6 w-6" />
            Quick Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOptions;