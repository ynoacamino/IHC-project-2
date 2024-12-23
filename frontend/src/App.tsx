import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainMenu from '@/components/page/MainMenu';
import GameOptions from '@/components/page/GameOptions';
import Canvas from '@/components/page/Canvas';
import VideoGames from '@/components/page/VideoGames';
import Rehabilitation from './components/rehabilitation/Rehabilitation';
import Settings from './components/page/Settings';
import Maze from './components/page/Maze';
import HandExerciseSession from './components/rehabilitation/exercises/HandExerciseSession';
import FingerExerciseSession from './components/rehabilitation/exercises/FingerExerciseSession';

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
          <Route path="/laberinto" element={<Maze />} />
          <Route path="/rehabilitation" element={<Rehabilitation />} />
          <Route path="/hand-exercises" element={<HandExerciseSession />} />
          <Route path="/finger-exercises" element={<FingerExerciseSession />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;