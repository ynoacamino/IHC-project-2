import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Settings = () => {
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
          <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          {/* Upper Hue */}
          <div className="flex items-center justify-between text-white">
            <span>Upper Hue</span>
            <input type="range" min="0" max="255" className="w-32" />
          </div>

          {/* Upper Saturation */}
          <div className="flex items-center justify-between text-white">
            <span>Upper Saturation</span>
            <input type="range" min="0" max="255" className="w-32" />
          </div>

          {/* Upper Value */}
          <div className="flex items-center justify-between text-white">
            <span>Upper Value</span>
            <input type="range" min="0" max="255" className="w-32" />
          </div>

          {/* Lower Hue */}
          <div className="flex items-center justify-between text-white">
            <span>Lower Hue</span>
            <input type="range" min="0" max="255" className="w-32" />
          </div>

          {/* Lower Saturation */}
          <div className="flex items-center justify-between text-white">
            <span>Lower Saturation</span>
            <input type="range" min="0" max="255" className="w-32" />
          </div>

          {/* Lower Value */}
          <div className="flex items-center justify-between text-white">
            <span>Lower Value</span>
            <input type="range" min="0" max="255" className="w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
