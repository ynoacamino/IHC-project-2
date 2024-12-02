import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
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

  const detectColorAndMove = (ctx: CanvasRenderingContext2D) => {
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
                detectColorAndMove(ctx);
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
        <h1 className="text-4xl font-bold mb-8">Maze</h1>
      </div>

      <div className="flex flex-col md:flex-row w-[100%]">
        <div
          className="mx-auto w-[100%] md:w-[40%] h-auto bg-slate-50 p-3 flex flex-col
      justify-center items-center
      rounded-md"
        >
          <div
            className="w-[70%] md:w-[90%] h-auto grid grid-cols-7 gap-2 justify-center items-center rounded-sm"
          >
            {mazeGrid.map((row, rowIndex) =>
              row.map((cell, cellIndex) => {
                const isPlayer = position.y === rowIndex && position.x === cellIndex;

                return (
                  <div
                    key={`${rowIndex},${cellIndex}`}
                    className={`w/7 h-16 flex justify-center items-center
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
              <button onClick={() => movePlayer("left")} className="
              p-2 bg-blue-700 text-white rounded-md">
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
        <div className="flex justify-center flex-row w-full md:w-1/2 md:flex-col">
          {/* Cámara y Canvas */}
          <div className="flex justify-center mt-2">
            <video ref={videoRef} className="hidden" autoPlay playsInline />
            <canvas
              ref={canvasRef}
              width="300"
              height="200"
              className="border-2 border-gray-500 rounded-lg"
            ></canvas>
          </div>
          <div className="text-center">
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
