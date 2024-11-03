import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Canvas = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawVideo = () => {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          detectColor(ctx, canvas.width, canvas.height);
          requestAnimationFrame(drawVideo);
        };

        drawVideo();
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const detectColor = (ctx, width, height) => {
    const frame = ctx.getImageData(0, 0, width, height);
    const data = frame.data;
    const blackPixels = [];
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detectar color negro: valores de RGB bajos
      if (r < 50 && g < 50 && b < 50) { // Ajusta estos valores según sea necesario
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        blackPixels.push({ x, y });
      }
    }

    if (blackPixels.length > 0) {
      // Encontrar el punto medio de los píxeles negros detectados
      const centerX = blackPixels.reduce((sum, pixel) => sum + pixel.x, 0) / blackPixels.length;
      const centerY = blackPixels.reduce((sum, pixel) => sum + pixel.y, 0) / blackPixels.length;

      // Calcular el área basada en la cantidad de píxeles negros
      const area = blackPixels.length;
      const radius = Math.sqrt(area / Math.PI); // Radio proporcional al área

      // Dibujar un círculo en el centro
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'red'; // Color del círculo
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

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
          <video ref={videoRef} className="hidden" />
          <canvas
            ref={canvasRef}
            className="w-full border-2 border-gray-300 rounded"
            width="1200"
            height="900"
          >
            Canvas not supported
          </canvas>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
