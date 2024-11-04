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
  const streamRef = useRef(null);
  let brushColor = 'black'; // Cambiar aquí para manejar el color como variable
  const intervalRef = useRef(null);
  const clearAreaRef = useRef({ x: 20, y: 20, width: 250, height: 100 });

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          intervalRef.current = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(-1, 1);

            if (videoRef.current && videoRef.current.readyState >= 2) {
              ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
            }
            ctx.restore();
            detectColor(ctx, canvas.width, canvas.height);
            drawClearArea(ctx);
          }, 100);
        };
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const drawClearArea = (ctx) => {
    ctx.save();
    ctx.strokeStyle = 'transparent';
    const clearArea = clearAreaRef.current;
    ctx.lineWidth = 2;
    ctx.strokeRect(clearArea.x, clearArea.y, clearArea.width + 50, clearArea.height);
    ctx.restore();
  };

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
        const { x, y, width, height } = clearAreaRef.current;

        if (
          centerX >= x &&
          centerX <= x + width &&
          centerY >= y &&
          centerY <= y + height
        ) {
          clearCanvas();
        } else {
          const drawingCanvas = drawingCanvasRef.current;
          const drawingCtx = drawingCanvas.getContext('2d');

          drawingCtx.lineWidth = 5;
          drawingCtx.lineCap = 'round';
          drawingCtx.strokeStyle = brushColor; // Usa la variable aquí

          drawingCtx.beginPath();
          drawingCtx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
          drawingCtx.lineTo(centerX, centerY);
          drawingCtx.stroke();
        }
      }

      const area = blackPixels.length;
      const radius = Math.sqrt(area / Math.PI);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      lastPositionRef.current = { x: centerX, y: centerY };
      isDrawingRef.current = true;
    } else {
      isDrawingRef.current = false;
    }
  };

  const clearCanvas = () => {
    const drawingCanvas = drawingCanvasRef.current;
    const drawingCtx = drawingCanvas.getContext('2d');
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  };

  const handleNavigateBack = () => {
    clearCanvas();
    navigate('/game-options');
  };

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={handleNavigateBack}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Canvas Mode</h1>
        <div className="bg-white rounded-lg p-4 max-w-4xl mx-auto relative">
          <video ref={videoRef} className="hidden" autoPlay playsInline />
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

          <div
            style={{
              position: 'absolute',
              left: clearAreaRef.current.x,
              top: clearAreaRef.current.y,
              width: clearAreaRef.current.width,
              height: clearAreaRef.current.height,
              backgroundColor: 'rgba(0, 0, 0, 0.0)',
              pointerEvents: 'none'
            }}
          />
          
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '10px',
              padding: '10px',
            }}
          >
            <button
              onClick={clearCanvas}
              className="bg-red-500 text-white px-16 py-5 rounded text-2xl"
            >
              Borrar
            </button>
            <button
              onClick={() => {
                brushColor = 'yellow'; // Cambia el color directamente
              }} 
              className="bg-yellow-500 text-white px-14 py-5 rounded text-2xl"
            >
              Amarillo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
