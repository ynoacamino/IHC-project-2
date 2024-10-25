import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import GameOptions from './components/GameOptions';
import Canvas from './components/Canvas';
import VideoGames from './components/VideoGames';
import QuickSession from './components/QuickSession';
import Settings from './components/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game-options" element={<GameOptions />} />
          <Route path="/canvas" element={<Canvas />} />
          <Route path="/videogames" element={<VideoGames />} />
          <Route path="/quick-session" element={<QuickSession />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;