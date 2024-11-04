import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainMenu from '@/components/page/MainMenu';
import GameOptions from '@/components/page/GameOptions';
import Canvas from '@/components/page/Canvas';
import VideoGames from '@/components/page/VideoGames';
import Rehabilitation from '@/components/page/Rehabilitation';
import HandSession from './components/page/HandSession';
import ArmSession from './components/page/ArmSession';
import FingerSession from './components/page/FingerSession';
import Settings from '@/components/page/Settings';

function App() {
  return (
    <HashRouter basename="/">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game-options" element={<GameOptions />} />
          <Route path="/canvas" element={<Canvas />} />
          <Route path="/videogames" element={<VideoGames />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/rehabilitation" element={<Rehabilitation />} />
          <Route path="/hand-session" element={<HandSession />} />
          <Route path="/arm-session" element={<ArmSession />} />
          <Route path="/finger-session" element={<FingerSession />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
