/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
} from 'lucide-react';
import Modal from './Modal';
import { useSettings } from './SettingsContext';

const gridSize = 7;

type Position = {
  x: number;
  y: number;
};

const initialPosition: Position = {
  x: 0,
  y: 6,
};

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  NULL,
}

const mazeGrid = [
  [true, true, true, true, true, true, false],
  [true, false, false, false, true, false, false],
  [true, false, true, false, true, false, true],
  [true, false, true, false, false, false, true],
  [false, true, true, true, true, false, true],
  [false, false, true, false, false, false, true],
  [false, false, false, true, true, true, true],
];

function Maze() {
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position>(initialPosition);
  const [showModal, setShowModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // const [lastMove, setLastMove] = useState<Direction>(Direction.DOWN);
  const lastMove = useRef<Direction>(Direction.NULL);

  const lastPositionRef = useRef({ x: 0, y: 0 });

  // Movimiento del jugador basado en dirección
  const movePlayer = (direction: Direction) => {
    const { x, y } = position;
    console.log(direction, { x, y });

    let newCol = x;
    let newRow = y;

    if (direction === Direction.UP) newRow -= 1;
    else if (direction === Direction.DOWN) newRow += 1;
    else if (direction === Direction.LEFT) newCol -= 1;
    else if (direction === Direction.RIGHT) newCol += 1;

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

  const { red, green, blue } = useSettings();

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 500;

  const W_1_BOX = 300;
  const W_2_BOX = 80;

  const H_1_BOX = 80;
  const H_2_BOX = 300;

  const SIZES_BOXES = [
    {
      x: (CANVAS_WIDTH - W_1_BOX) / 2,
      y: CANVAS_HEIGHT - ((CANVAS_HEIGHT - (H_2_BOX + H_1_BOX * 2)) / 2) - H_1_BOX,
      width: W_1_BOX,
      height: H_1_BOX,
      direction: Direction.DOWN,
    },
    {
      x: (CANVAS_WIDTH - W_1_BOX) / 2,
      y: (CANVAS_HEIGHT - (H_2_BOX + H_1_BOX * 2)) / 2,
      width: W_1_BOX,
      height: H_1_BOX,
      direction: Direction.UP,
    },
    {
      x: CANVAS_WIDTH - ((CANVAS_WIDTH - (W_1_BOX + 2 * W_2_BOX)) / 2) - W_2_BOX,
      y: 100,
      width: W_2_BOX,
      height: H_2_BOX,
      direction: Direction.RIGHT,
    },
    {
      x: (CANVAS_WIDTH - (W_1_BOX + 2 * W_2_BOX)) / 2,
      y: 100,
      width: W_2_BOX,
      height: H_2_BOX,
      direction: Direction.LEFT,
    },
  ];

  const createBotton = (createBottonProps: {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    width: number
    height: number
  }) => {
    const { ctx } = createBottonProps;

    ctx.strokeStyle = 'black'; // Borde negro
    ctx.lineWidth = 2; // Grosor del borde
    ctx.fillStyle = 'rgba(180, 180, 180, 0.4)'; // Fondo blanco transparente

    ctx.beginPath();
    ctx.roundRect(
      createBottonProps.x,
      createBottonProps.y,
      createBottonProps.width,
      createBottonProps.height,
      10,
    );
    ctx.fill(); // Rellena el fondo transparente
    ctx.stroke(); // Dibuja el borde
  };

  const createBottons = () => {
    const ctx = drawingCanvasRef.current?.getContext('2d') as CanvasRenderingContext2D;

    SIZES_BOXES.forEach((s) => createBotton({ ctx, ...s }));
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
      const centerX = detectedPixels
        .reduce((sum, pixel) => sum + pixel.x, 0) / detectedPixels.length;
      const centerY = detectedPixels
        .reduce((sum, pixel) => sum + pixel.y, 0) / detectedPixels.length;

      const area = detectedPixels.length;
      const radius = Math.sqrt(area / Math.PI) * 1.3;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      lastPositionRef.current = { x: centerX, y: centerY };

      const matchDirection = SIZES_BOXES.find((s) => (
        s.x <= centerX
        && centerX <= s.x + s.width
        && s.y <= centerY
        && centerY <= s.y + s.height
      ));

      if (matchDirection && lastMove.current !== matchDirection.direction) {
        movePlayer(matchDirection.direction);
        if (matchDirection.direction === Direction.UP) {
          console.log('UP');
        }
        if (matchDirection.direction === Direction.DOWN) {
          console.log('DOWN');
        }
        if (matchDirection.direction === Direction.LEFT) {
          console.log('LEFT');
        }
        if (matchDirection.direction === Direction.RIGHT) {
          console.log('RIGHT');
        }
        lastMove.current = matchDirection.direction;
      }
      if (!matchDirection && lastMove.current !== Direction.NULL) {
        lastMove.current = Direction.NULL;
      }
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
                detectColor(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
              }, 300);
            }
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();
    createBottons();

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

      <div className="absolute top-4 left-40 ">
        <button type="button" onClick={() => movePlayer(Direction.UP)}>
          UP
        </button>
        <button type="button" onClick={() => movePlayer(Direction.DOWN)}>
          DOWN
        </button>
        <button type="button" onClick={() => movePlayer(Direction.LEFT)}>
          LEFT
        </button>
        <button type="button" onClick={() => movePlayer(Direction.RIGHT)}>
          RIGHT
        </button>
      </div>

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
          <div className="flex justify-center mt-2 relative">
            <video ref={videoRef} className="hidden" autoPlay playsInline />
            <canvas ref={canvasRef} width="600" height="500" className="border-2 border-gray-500 rounded-lg" />
            <canvas
              ref={drawingCanvasRef}
              className="absolute top-0 left-0 w-full h-full"
              width="600"
              height="500"
            />
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
