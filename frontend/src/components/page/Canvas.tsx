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
  let brushColor = 'black'; // El color inicial es negro
  const intervalRef = useRef(null);
  const clearAreaRef = useRef({ x: 20, y: 20, width: 250, height: 100 });
  const yellowAreaRef = useRef({ x: 300, y: 20, width: 250, height: 100 }); // El área amarilla
  const greenAreaRef = useRef({ x: 600, y: 20, width: 250, height: 100 }); // El área verde

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
            drawYellowArea(ctx); // Dibuja el área amarilla
            drawGreenArea(ctx); // Dibuja el área verde
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

  const drawYellowArea = (ctx) => {
    const yellowArea = yellowAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.globalAlpha = 0.3; // Opacidad para que se vea como un área visible pero no intrusiva
    ctx.fillRect(yellowArea.x, yellowArea.y, yellowArea.width, yellowArea.height);
    ctx.restore();
  };

  const drawGreenArea = (ctx) => {
    const greenArea = greenAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'green';
    ctx.globalAlpha = 0.3; // Opacidad para que se vea como un área visible pero no intrusiva
    ctx.fillRect(greenArea.x, greenArea.y, greenArea.width, greenArea.height);
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

      // Detección de borrado
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
          drawingCtx.strokeStyle = brushColor;

          drawingCtx.beginPath();
          drawingCtx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
          drawingCtx.lineTo(centerX, centerY);
          drawingCtx.stroke();
        }
      }

      // Dibuja el círculo alrededor del puntero
      const area = blackPixels.length;
      const radius = Math.sqrt(area / Math.PI);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      lastPositionRef.current = { x: centerX, y: centerY };
      isDrawingRef.current = true;

      // Detección del área amarilla
      const yellowArea = yellowAreaRef.current;
      if (
        centerX >= yellowArea.x &&
        centerX <= yellowArea.x + yellowArea.width &&
        centerY >= yellowArea.y &&
        centerY <= yellowArea.y + yellowArea.height
      ) {
        brushColor = 'yellow'; // Cambia el color del pincel a amarillo
      }

      // Detección del área verde
      const greenArea = greenAreaRef.current;
      if (
        centerX >= greenArea.x &&
        centerX <= greenArea.x + greenArea.width &&
        centerY >= greenArea.y &&
        centerY <= greenArea.y + greenArea.height
      ) {
        brushColor = 'green'; // Cambia el color del pincel a verde
      }
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
                brushColor = 'yellow'; 
              }} 
              className="bg-yellow-500 text-white px-14 py-5 rounded text-2xl"
            >
              Amarillo
            </button>
            <button
              onClick={() => {
                brushColor = 'green'; 
              }} 
              className="bg-green-500 text-white px-14 py-5 rounded text-2xl"
            >
              Verde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
