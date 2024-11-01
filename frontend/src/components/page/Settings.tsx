import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Monitor, Wifi } from 'lucide-react';

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

        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <Volume2 className="h-6 w-6 mr-3" />
              <span>Sound Volume</span>
            </div>
            <input type="range" className="w-32" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <Monitor className="h-6 w-6 mr-3" />
              <span>Graphics Quality</span>
            </div>
            <select className="bg-gray-700 text-white rounded-md px-3 py-1">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <Wifi className="h-6 w-6 mr-3" />
              <span>Online Status</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;