/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from './SettingsContext'; 

function Canvas() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const { red, green, blue } = useSettings();
  const streamRef = useRef<MediaStream | null>(null);
  let brushColor = 'black'; // El color inicial es negro
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const clearAreaRef = useRef({
    x: 20, y: 20, width: 250, height: 100,
  });
  const yellowAreaRef = useRef({
    x: 300, y: 20, width: 250, height: 100,
  }); // El área amarilla
  const greenAreaRef = useRef({
    x: 600, y: 20, width: 250, height: 100,
  }); // El área verde

  const drawClearArea = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = 'transparent';
    const clearArea = clearAreaRef.current;
    ctx.lineWidth = 2;
    ctx.strokeRect(clearArea.x, clearArea.y, clearArea.width + 50, clearArea.height);
    ctx.restore();
  };

  const drawYellowArea = (ctx: CanvasRenderingContext2D) => {
    const yellowArea = yellowAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.globalAlpha = 0;
    ctx.fillRect(yellowArea.x, yellowArea.y, yellowArea.width, yellowArea.height);
    ctx.restore();
  };

  const drawGreenArea = (ctx: CanvasRenderingContext2D) => {
    const greenArea = greenAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'green';
    ctx.globalAlpha = 0;
    ctx.fillRect(greenArea.x, greenArea.y, greenArea.width, greenArea.height);
    ctx.restore();
  };

  const clearCanvas = () => {
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;

    const drawingCtx = drawingCanvas.getContext('2d');
    if (!drawingCtx) return;

    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  };

  const detectColor = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const frame = ctx.getImageData(0, 0, width, height);
    const { data } = frame;
    const detectedPixels = [];
  
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
  
      // Comparar el color con los valores de SettingsContext
      if (Math.abs(r - red) < 30 && Math.abs(g - green) < 30 && Math.abs(b - blue) < 30) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        detectedPixels.push({ x, y });
      }
    }
  
    if (detectedPixels.length > 0) {
      const centerX = detectedPixels.reduce((sum, pixel) => sum + pixel.x, 0) / detectedPixels.length;
      const centerY = detectedPixels.reduce((sum, pixel) => sum + pixel.y, 0) / detectedPixels.length;

      // Detección de borrado
      if (isDrawingRef.current) {
        const {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          x, y, width, height,
        } = clearAreaRef.current;

        if (
          centerX >= x
          && centerX <= x + width
          && centerY >= y
          && centerY <= y + height
        ) {
          clearCanvas();
        } else {
          const drawingCanvas = drawingCanvasRef.current;
          if (!drawingCanvas) return;

          const drawingCtx = drawingCanvas.getContext('2d');
          if (!drawingCtx) return;

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
      const area = detectedPixels.length;
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
        centerX >= yellowArea.x
        && centerX <= yellowArea.x + yellowArea.width
        && centerY >= yellowArea.y
        && centerY <= yellowArea.y + yellowArea.height
      ) {
        brushColor = 'yellow'; // Cambia el color del pincel a amarillo
      }

      // Detección del área verde
      const greenArea = greenAreaRef.current;
      if (
        centerX >= greenArea.x
        && centerX <= greenArea.x + greenArea.width
        && centerY >= greenArea.y
        && centerY <= greenArea.y + greenArea.height
      ) {
        brushColor = 'green'; // Cambia el color del pincel a verde
      }
    } else {
      isDrawingRef.current = false;
    }
  };

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          if (!videoRef.current) return;

          videoRef.current.play();

          if (!canvasRef.current) return;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          if (!ctx) return;

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
        // eslint-disable-next-line no-console
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleNavigateBack = () => {
    clearCanvas();
    navigate('/game-options');
  };

  return (
    <div className="min-h-screen p-4">
      <button
        type="button"
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
              pointerEvents: 'none',
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
              type="button"
              onClick={clearCanvas}
              className="bg-red-500 text-white px-16 py-5 rounded text-2xl"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => {
                brushColor = 'yellow';
              }}
              className="bg-yellow-500 text-white px-14 py-5 rounded text-2xl"
            >
              Amarillo
            </button>
            <button
              type="button"
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
}

export default Canvas;
