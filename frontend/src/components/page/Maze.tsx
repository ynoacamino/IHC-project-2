import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { Circle } from "lucide-react";
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
]


const Maze = () => {
  const navigate = useNavigate();
  const [position, setPosition] = React.useState<Position>(initialPosition);
  const [showModal, setShowModal] = useState(false);

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    const { x, y } = position;

    let newCol = x;
    let newRow = y;

    if (direction === 'up') newRow--;
    else if (direction === 'down') newRow++;
    else if (direction === 'left') newCol--;
    else if (direction === 'right') newCol++;

    const newPosition = { x: newCol, y: newRow }
    if (!mazeGrid[newRow][newCol] && newCol >= 0 && newCol <= gridSize && newRow >= 0 && newRow <= gridSize) {
      setPosition(newPosition)
    }
  }

  useEffect(() => {
    playEnd()
  }, [position])

  const playEnd = () => {
    if (position.x === 6 && position.y === 0) {
      setShowModal(true)
    }

  }

  return (
    <div className="min-h-screen p-4 bg=">
      <button
        onClick={() => navigate("/game-options")}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Maze</h1>
      </div>

      <div className="
      mx-auto w-[100%] md:w-[40%] h-auto bg-slate-50 p-3 flex flex-col
      justify-center items-center
      rounded-md 
      "
      >
        <div className="
        w-[60%]
        h-auto
        grid grid-cols-7 gap-2 justify-center items-center rounded-sm">
          {mazeGrid.map((row, rowIndex) => (
            row.map((cell, cellIndex) => {
              const isPlayer = position.y === rowIndex && position.x === cellIndex;

              return (<div
                key={`${rowIndex},${cellIndex}`}
                className={`w/7 h-12
               flex justify-center items-center
               rounded-sm shadow-md
              ${cell ? 'bg-' : 'bg-white'}`}
                style={{
                  backgroundColor: isPlayer ? '#4ADE80' : cell ? '#1F2937' : '#F3F4F9'
                }}
              >
                {isPlayer && <div className="grid center
              w-1/2 h-1/2
              rounded-full
              bg-blue-500" />}
              </div>)
            })
          ))}
        </div>

        <div className="flex flex-col justify-center items-center gap-1 mt-4">
          <button onClick={() => movePlayer('up')} className="p-2 bg-blue-700 text-white rounded-md">
            <ArrowUp />
          </button>
          <div>

          </div>
          <div className="flex space-x-2">
            <button onClick={() => movePlayer('left')} className="p-2 bg-blue-700 text-white rounded-md">
              <ArrowLeft />
            </button>
            <button onClick={() => movePlayer('down')} className="p-2 bg-blue-700 text-white rounded-md">
              <ArrowDown />
            </button>
            <button onClick={() => movePlayer('right')} className="p-2 bg-blue-700 text-white rounded-md">
              <ArrowRight />
            </button>
          </div>
        </div>

      </div>
      <Modal
        title="Congrulations"
        isOpen={showModal}
        onClose={() => setShowModal(false)}>
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
