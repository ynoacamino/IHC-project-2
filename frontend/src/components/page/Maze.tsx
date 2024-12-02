import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

const Maze = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position>(initialPosition);
  const [showModal, setShowModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const movePlayer = (direction: "up" | "down" | "left" | "right") => {
    const { x, y } = position;

    let newCol = x;
    let newRow = y;

    if (direction === "up") newRow--;
    else if (direction === "down") newRow++;
    else if (direction === "left") newCol--;
    else if (direction === "right") newCol++;

    if (
      newCol >= 0 &&
      newCol < gridSize &&
      newRow >= 0 &&
      newRow < gridSize &&
      !mazeGrid[newRow][newCol]
    ) {
      setPosition({ x: newCol, y: newRow });
    }
  };

  const detectColorMovement = (ctx: CanvasRenderingContext2D) => {
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

      if (centerY < height * 0.3) movePlayer("up");
      else if (centerY > height * 0.7) movePlayer("down");
      else if (centerX < width * 0.3) movePlayer("left");
      else if (centerX > width * 0.7) movePlayer("right");
    }
  };

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");

            if (ctx) {
              setInterval(() => {
                ctx.drawImage(videoRef.current!, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
                detectColorMovement(ctx);
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (position.x === 6 && position.y === 0) {
      setShowModal(true);
    }
  }, [position]);

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <button
        onClick={() => navigate("/game-options")}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Maze with Camera</h1>
      </div>

      <div className="flex justify-center items-start">
        {/* Laberinto */}
        <div className="grid grid-cols-7 gap-2">
          {mazeGrid.map((row, rowIndex) =>
            row.map((cell, cellIndex) => {
              const isPlayer = position.y === rowIndex && position.x === cellIndex;

              return (
                <div
                  key={`${rowIndex},${cellIndex}`}
                  className={`w-16 h-16 ${
                    cell ? "bg-gray-700" : "bg-gray-300"
                  } flex justify-center items-center`}
                >
                  {isPlayer && <div className="w-12 h-12 bg-blue-500 rounded-full"></div>}
                </div>
              );
            })
          )}
        </div>

        {/* Cámara */}
        <div className="ml-8">
          <video
            ref={videoRef}
            className="w-48 h-36 border-2 border-white rounded-lg"
            autoPlay
            playsInline
          ></video>
          <canvas
            ref={canvasRef}
            className="w-48 h-36 border-2 border-gray-500 rounded-lg mt-2"
          ></canvas>
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
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Maze;
