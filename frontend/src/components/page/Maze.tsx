import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSettings } from "./SettingsContext";
import Modal from "./Modal";

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
  const { red, green, blue, threshold } = useSettings();
  const [position, setPosition] = useState<Position>(initialPosition);
  const [showModal, setShowModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastMoveTimeRef = useRef<number>(0);

  // Define las áreas de las flechas
  const buttonAreas = {
    up: { x: 240, y: 50, width: 120, height: 80 },
    down: { x: 240, y: 300, width: 120, height: 80 },
    left: { x: 50, y: 175, width: 80, height: 120 },
    right: { x: 430, y: 175, width: 80, height: 120 },
  };

  const movePlayer = (direction: "up" | "down" | "left" | "right") => {
    const { x, y } = position;

    let newCol = x;
    let newRow = y;

    if (direction === "up") newRow--;
    if (direction === "down") newRow++;
    if (direction === "left") newCol--;
    if (direction === "right") newCol++;

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

  const detectColorAndTrigger = (ctx: CanvasRenderingContext2D) => {
    const width = canvasRef.current!.width;
    const height = canvasRef.current!.height;

    const frame = ctx.getImageData(0, 0, width, height);
    const { data } = frame;

    let sumX = 0;
    let sumY = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const colorDistance = Math.sqrt(
        Math.pow(r - red, 2) + Math.pow(g - green, 2) + Math.pow(b - blue, 2)
      );

      if (colorDistance <= threshold) {
        const x = (i / 4) % width;
        const y = Math.floor(i / 4 / width);

        sumX += x;
        sumY += y;
        pixelCount++;
      }
    }

    if (pixelCount > 50) { // Asegúrate de que se detecten suficientes píxeles para evitar falsos positivos
      const centerX = sumX / pixelCount;
      const centerY = sumY / pixelCount;

      // Dibujar el círculo de reconocimiento
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Verificar si el puntero está en el área de las flechas
      const currentTime = Date.now();
      if (currentTime - lastMoveTimeRef.current > 500) { // Control de tiempo para evitar movimientos continuos
        for (const [direction, area] of Object.entries(buttonAreas)) {
          if (
            centerX >= area.x &&
            centerX <= area.x + area.width &&
            centerY >= area.y &&
            centerY <= area.y + area.height
          ) {
            movePlayer(direction as "up" | "down" | "left" | "right");
            lastMoveTimeRef.current = currentTime;
            break; // Evita múltiples movimientos en una sola detección
          }
        }
      }
    }
  };

  const drawButtons = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    Object.entries(buttonAreas).forEach(([direction, area]) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(area.x, area.y, area.width, area.height);
      ctx.fillStyle = "black";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        direction === "up"
          ? "⬆"
          : direction === "down"
            ? "⬇"
            : direction === "left"
              ? "⬅"
              : "➡",
        area.x + area.width / 2,
        area.y + area.height / 2
      );
    });
    ctx.restore();
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
        pixelCount++;
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
              const renderFrame = () => {
                ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                ctx.save();
                ctx.scale(-1, 1); // Efecto espejo
                ctx.translate(-canvasRef.current!.width, 0);
                ctx.drawImage(
                  videoRef.current!,
                  0,
                  0,
                  canvasRef.current!.width,
                  canvasRef.current!.height
                );
                ctx.restore();

                drawButtons(ctx);
                detectColorAndTrigger(ctx);
                requestAnimationFrame(renderFrame); // Utilizar requestAnimationFrame para una animación más suave
              };
              renderFrame();
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
  }, [red, green, blue, threshold]);

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
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Maze</h1>
      </div>
      <div
        className="mx-auto w-[100%] md:w-[40%] h-auto bg-slate-50 p-3 flex flex-col
      justify-center items-center
      rounded-md"
      >
        <div
          className="w-[60%] h-auto grid grid-cols-7 gap-2 justify-center items-center rounded-sm"
        >
          {mazeGrid.map((row, rowIndex) =>
            row.map((cell, cellIndex) => {
              const isPlayer = position.y === rowIndex && position.x === cellIndex;

              return (
                <div
                  key={`${rowIndex},${cellIndex}`}
                  className={`w/7 h-12 flex justify-center items-center
                   rounded-sm shadow-md
                   ${cell ? "bg-" : "bg-white"}`}
                  style={{
                    backgroundColor: isPlayer ? "#4ADE80" : cell ? "#1F2937" : "#F3F4F9",
                  }}
                >
                  {isPlayer && (
                    <div
                      className="grid center w-1/2 h-1/2 rounded-full bg-blue-500"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-col justify-center items-center gap-1 mt-4">
          <button onClick={() => movePlayer("up")} className="p-2 bg-blue-700 text-white rounded-md">
            <ArrowUp />
          </button>
          <div className="flex space-x-2">
            <button onClick={() => movePlayer("left")} className="p-2 bg-blue-700 text-white rounded-md">
              <ArrowLeft />
            </button>
            <button onClick={() => movePlayer("down")} className="p-2 bg-blue-700 text-white rounded-md">
              <ArrowDown />
            </button>
            <button onClick={() => movePlayer("right")} className="p-2 bg-blue-700 text-white rounded-md">
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Cámara y Canvas */}
      <div className="flex justify-center mt-8">
        <video ref={videoRef} className="hidden" autoPlay playsInline />
        <canvas
          ref={canvasRef}
          width="300"
          height="200"
          className="border-2 border-gray-500 rounded-lg"
        ></canvas>
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
