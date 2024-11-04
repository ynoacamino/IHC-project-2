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
  const streamRef = useRef(null); // Para guardar el flujo de video

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; // Guardar el flujo
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
      // Detener el flujo de video al desmontar el componente
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
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

      if (r < 50 && g < 50 && b < 50) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        blackPixels.push({ x, y });
      }
    }

    if (blackPixels.length > 0) {
      const centerX = blackPixels.reduce((sum, pixel) => sum + pixel.x, 0) / blackPixels.length;
      const centerY = blackPixels.reduce((sum, pixel) => sum + pixel.y, 0) / blackPixels.length;

      if (isDrawingRef.current) {
        const drawingCanvas = drawingCanvasRef.current;
        const drawingCtx = drawingCanvas.getContext('2d');

        drawingCtx.lineWidth = 5; // Grosor del lápiz
        drawingCtx.lineCap = 'round'; // Bordes redondeados
        drawingCtx.strokeStyle = 'red'; // Color del lápiz

        drawingCtx.beginPath();
        drawingCtx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
        drawingCtx.lineTo(centerX, centerY);
        drawingCtx.stroke();
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const area = blackPixels.length;
      const radius = Math.sqrt(area / Math.PI);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'red'; // Color del círculo
      ctx.lineWidth = 2;
      ctx.stroke();

      lastPositionRef.current = { x: centerX, y: centerY };
      isDrawingRef.current = true;
    } else {
      isDrawingRef.current = false; // No hay negro, no dibujamos
    }
  };

  const clearCanvas = () => {
    const drawingCanvas = drawingCanvasRef.current;
    const drawingCtx = drawingCanvas.getContext('2d');
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); // Limpia el canvas de dibujo
  };

  const handleNavigateBack = () => {
    clearCanvas(); // Limpia el canvas antes de navegar
    navigate('/game-options');
  };

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={handleNavigateBack} // Usa la función que limpia el canvas
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
          <canvas
            ref={drawingCanvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width="1200"
            height="900"
          />
          {/* Botón para borrar */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button onClick={clearCanvas} className="bg-red-500 text-white px-4 py-2 rounded">
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
