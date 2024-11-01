import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const VideoGames = () => {
  const navigate = useNavigate();
  const games = [
    {
      title: "Space Adventure",
      image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=300",
      description: "Explore the vast universe"
    },
    {
      title: "Forest Quest",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300",
      description: "Survive in the mystical forest"
    },
    {
      title: "Ocean Explorer",
      image: "https://images.unsplash.com/photo-1518019671582-55004f1bc2ad?auto=format&fit=crop&w=300",
      description: "Discover underwater mysteries"
    }
  ];

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={() => navigate('/game-options')}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Video Games</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-gray-300">{game.description}</p>
                <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoGames;