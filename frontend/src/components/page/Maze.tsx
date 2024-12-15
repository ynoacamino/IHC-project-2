/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
} from 'lucide-react';
import Modal from './Modal';

const gridSize = 7;

type Position = {
  x: number;
  y: number;
};

const initialPosition: Position = {
  x: 0,
  y: 6,
};

const mazeGrid = [
  [true, true, true, true, true, true, false],
  [true, false, false, false, true, false, false],
  [true, false, true, false, true, false, true],
  [true, false, true, false, false, false, true],
  [true, false, true, true, true, false, true],
  [false, false, false, false, false, false, true],
  [false, true, true, true, true, true, true],
];

function Maze() {
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position>(initialPosition);
  const [showModal, setShowModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Movimiento del jugador basado en dirección
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    const { x, y } = position;

    let newCol = x;
    let newRow = y;

    if (direction === 'up') newRow -= 1;
    else if (direction === 'down') newRow += 1;
    else if (direction === 'left') newCol -= 1;
    else if (direction === 'right') newCol += 1;

    if (
      newCol >= 0
      && newCol < gridSize
      && newRow >= 0
      && newRow < gridSize
      && !mazeGrid[newRow][newCol]
    ) {
      setPosition({ x: newCol, y: newRow });
    }
  };

  // Detecta colores y realiza el movimiento
  const detectColorAndMove = (ctx: CanvasRenderingContext2D) => {
    const { width } = (canvasRef.current!);
    const { height } = (canvasRef.current!);

    const frame = ctx.getImageData(0, 0, width, height);
    const { data } = frame;

    let sumX = 0;
    let sumY = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Detección de color específico (rojo)
      if (r > 200 && g < 180 && b < 150) {
        const x = (i / 4) % width;
        const y = Math.floor(i / 4 / width);

        sumX += x;
        sumY += y;
        pixelCount += 1;
      }
    }

    if (pixelCount > 0) {
      const centerX = sumX / pixelCount;
      const centerY = sumY / pixelCount;

      // Dibujar el círculo de reconocimiento
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Determinar el movimiento basado en la posición del círculo
      const horizontalThreshold = width / 3;
      const verticalThreshold = height / 3;

      if (centerY < verticalThreshold) movePlayer('up');
      else if (centerY > 2 * verticalThreshold) movePlayer('down');
      else if (centerX < horizontalThreshold) movePlayer('left');
      else if (centerX > 2 * horizontalThreshold) movePlayer('right');
    }
  };

  // Configuración de la cámara y dibujo en canvas
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
              setInterval(() => {
                ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                ctx.save();
                ctx.scale(-1, 1); // Efecto espejo
                ctx.translate(-canvasRef.current!.width, 0); // Ajusta posición tras el espejo
                ctx.drawImage(
                  videoRef.current!,
                  0,
                  0,
                  canvasRef.current!.width,
                  canvasRef.current!.height,
                );
                ctx.restore();
                detectColorAndMove(ctx); // Detección de movimiento
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Gana el juego si llega al objetivo
  useEffect(() => {
    if (position.x === 6 && position.y === 0) {
      setShowModal(true);
    }
  }, [position]);

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <button
        onClick={() => navigate('/game-options')}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
        type="button"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Maze</h1>
      </div>

      <div className="flex flex-col md:flex-row w-[100%]">
        <div className="mx-auto w-[100%] md:w-[40%] h-auto bg-slate-50 p-3 flex flex-col justify-center items-center rounded-md">
          <div className="w-[70%] md:w-[90%] h-auto grid grid-cols-7 gap-2 justify-center items-center rounded-sm">
            {mazeGrid.map((row, rowIndex) => row.map((cell, cellIndex) => {
              const isPlayer = position.y === rowIndex && position.x === cellIndex;

              return (
                <div
                  key={`${rowIndex},${cellIndex}`}
                  className={`w/7 h-16 flex justify-center items-center rounded-sm shadow-md ${cell ? 'bg-' : 'bg-white'}`}
                  style={{
                    backgroundColor: isPlayer ? '#4ADE80' : cell ? '#1F2937' : '#F3F4F9',
                  }}
                >
                  {isPlayer && <div className="grid center w-1/2 h-1/2 rounded-full bg-blue-500" />}
                </div>
              );
            }))}
          </div>
        </div>

        <div className="flex justify-center flex-row w-full md:w-1/2 md:flex-col">
          <div className="flex justify-center mt-2">
            <video ref={videoRef} className="hidden" autoPlay playsInline />
            <canvas ref={canvasRef} width="600" height="500" className="border-2 border-gray-500 rounded-lg" />
          </div>
        </div>
      </div>

      <Modal
        title="Congratulations!"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="text-center">
          <p>Game Over</p>
          <button
            onClick={() => {
              setPosition(initialPosition);
              setShowModal(false);
            }}
            type="button"
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>

        </div>
      </Modal>
    </div>
  );
}

export default Maze;
