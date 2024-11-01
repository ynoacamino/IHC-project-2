import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Trophy } from 'lucide-react';

const QuickSession = () => {
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
        <h1 className="text-4xl font-bold text-white mb-8">Quick Session</h1>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <Clock className="mr-2" />
              Quick Match
            </h2>
            <p className="text-gray-300 mb-4">Jump into a fast-paced game session</p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full">
              Start Match
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <Users className="mr-2" />
              Team Battle
            </h2>
            <p className="text-gray-300 mb-4">Join a team and compete together</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full">
              Find Team
            </button>
          </div>

          <div className="md:col-span-2 bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <Trophy className="mr-2" />
              Tournament
            </h2>
            <p className="text-gray-300 mb-4">Compete in a structured tournament</p>
            <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors w-full">
              Enter Tournament
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSession;