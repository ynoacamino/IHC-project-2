import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Canvas = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

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
      if (r < 50 && g < 50 && b < 50) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        blackPixels.push({ x, y });
      }
    }

    if (blackPixels.length > 0) {
      const centerX = blackPixels.reduce((sum, pixel) => sum + pixel.x, 0) / blackPixels.length;
      const centerY = blackPixels.reduce((sum, pixel) => sum + pixel.y, 0) / blackPixels.length;

      // Si estamos dibujando, conectamos el punto anterior con el actual
      if (isDrawingRef.current) {
        const drawingCanvas = drawingCanvasRef.current;
        const drawingCtx = drawingCanvas.getContext('2d');

        drawingCtx.lineWidth = 5; // Grosor del lápiz
        drawingCtx.lineCap = 'round'; // Bordes redondeados
        drawingCtx.strokeStyle = 'red'; // Color del lápiz

        // Dibujar en el canvas de dibujo
        drawingCtx.beginPath();
        drawingCtx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
        drawingCtx.lineTo(centerX, centerY);
        drawingCtx.stroke();
      }

      // Dibujar un círculo en el canvas principal
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const area = blackPixels.length;
      const radius = Math.sqrt(area / Math.PI); // Radio proporcional al área

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'red'; // Color del círculo
      ctx.lineWidth = 2;
      ctx.stroke();

      // Actualiza la última posición
      lastPositionRef.current = { x: centerX, y: centerY };
      isDrawingRef.current = true;
    } else {
      isDrawingRef.current = false; // No hay negro, no dibujamos
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
        <div className="bg-white rounded-lg p-4 max-w-4xl mx-auto relative">
          <video ref={videoRef} className="hidden" />
          <canvas
            ref={canvasRef}
            className="w-full border-2 border-gray-300 rounded"
            width="1200"
            height="900"
          >
            Canvas not supported
          </canvas>
          {/* Canvas para dibujar */}
          <canvas
            ref={drawingCanvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width="1200"
            height="900"
          />
        </div>
      </div>
    </div>
  );
};

export default Canvas;

