import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  // Función para manejar los cambios en los sliders
  const handleRedChange = (event) => setRed(event.target.value);
  const handleGreenChange = (event) => setGreen(event.target.value);
  const handleBlueChange = (event) => setBlue(event.target.value);

  // Color resultante basado en los valores RGB
  const rgbColor = `rgb(${red}, ${green}, ${blue})`;

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
          <h1 className="text-4xl font-bold text-white mb-8">Opciones</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          {/* Control deslizante para Rojo */}
          <div className="flex items-center justify-between text-white">
            <span>Rojo</span>
            <input
              type="range"
              min="0"
              max="255"
              value={red}
              onChange={handleRedChange}
              className="slider w-60"
            />
            <span>{red}</span>
          </div>

          {/* Control deslizante para Verde */}
          <div className="flex items-center justify-between text-white">
            <span>Verde</span>
            <input
              type="range"
              min="0"
              max="255"
              value={green}
              onChange={handleGreenChange}
              className="slider w-60"
            />
            <span>{green}</span>
          </div>

          {/* Control deslizante para Azul */}
          <div className="flex items-center justify-between text-white">
            <span>Azul</span>
            <input
              type="range"
              min="0"
              max="255"
              value={blue}
              onChange={handleBlueChange}
              className="slider w-60"
            />
            <span>{blue}</span>
          </div>

          {/* Mostrar Color Resultante */}
          <div className="flex items-center justify-between text-white">
            <span>Color Resultante:</span>
            <div
              className="w-16 h-16 border-2 border-gray-500"
              style={{ backgroundColor: rgbColor }}
            />
          </div>

          {/* Botón de Guardar */}
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
