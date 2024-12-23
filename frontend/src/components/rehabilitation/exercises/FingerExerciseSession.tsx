import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ExerciseCamera from './ExerciseCamera';
import ExerciseTimer from './ExerciseTimer';
import ExerciseInstructions from './ExerciseInstructions';
import { StepImages } from './StepImages';
import { usePositionHold } from './usePositionHold';
import { fingerExercises } from './fingerExercises';
import type { ExerciseProgress, Zone } from './types';

import finger1 from '../../../assets/images/finger1.png';
import finger2 from '../../../assets/images/finger2.png';
import finger3 from '../../../assets/images/finger3.png';
import finger4 from '../../../assets/images/finger4.png';
import finger5 from '../../../assets/images/finger5.png';

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const REQUIRED_HOLD_TIME = 5; // segundos
const POINTS_PER_HOLD = 10;

const FINGER_ZONES: Zone[] = [
    { x: 120, y: 140, width: 80, height: 80, label: "Pulgar" },
    { x: 220, y: 140, width: 80, height: 80, label: "Índice" },
    { x: 320, y: 140, width: 80, height: 80, label: "Medio" },
    { x: 420, y: 140, width: 80, height: 80, label: "Anular" },
    { x: 520, y: 140, width: 80, height: 80, label: "Meñique" }
];

const stepImages = [
    {
        src: finger1,
        alt: 'Dedo pulgar'
    },
    {
        src: finger2,
        alt: 'Dedo índice'
    },
    {
        src: finger3,
        alt: 'Dedo medio'
    },
    {
        src: finger4,
        alt: 'Dedo anular'
    },
    {
        src: finger5,
        alt: 'Dedo meñique'
    }
];

function FingerExerciseSession() {
    const navigate = useNavigate();
    const [currentExercise] = useState(fingerExercises[0]);
    const [progress, setProgress] = useState<ExerciseProgress>({
        score: 0,
        completedRepetitions: 0,
        timeLeft: currentExercise.duration,
    });
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentZone, setCurrentZone] = useState(0);

    const handleHoldComplete = useCallback(() => {
        setProgress(prev => ({
        ...prev,
        score: prev.score + POINTS_PER_HOLD,
        completedRepetitions: prev.completedRepetitions + 1
        }));
        setCurrentZone(prev => (prev + 1) % FINGER_ZONES.length);
    }, []);

    const { currentHoldTime, startHolding, resetHolding } = usePositionHold({
        isActive,
        requiredHoldTime: REQUIRED_HOLD_TIME,
        onHoldComplete: handleHoldComplete,
    });

    const handleColorDetected = useCallback((x: number, y: number) => {
        if (!isActive) return;

        const currentTarget = FINGER_ZONES[currentZone];
        const isInZone = x >= currentTarget.x 
        && x <= currentTarget.x + currentTarget.width
        && y >= currentTarget.y 
        && y <= currentTarget.y + currentTarget.height;

        if (isInZone) {
        startHolding();
        } else {
        resetHolding();
        }
    }, [isActive, currentZone, startHolding, resetHolding]);

    const handleTimeUpdate = useCallback((newTime: number) => {
        setProgress(prev => ({ ...prev, timeLeft: newTime }));
    }, []);

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
        <button
            onClick={() => navigate('/rehabilitation')}
            className="absolute top-4 left-4 hover:text-purple-400 transition-colors"
            type="button"
        >
            <ArrowLeft className="h-8 w-8" />
        </button>

        <div className="max-w-6xl mx-auto pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <ExerciseInstructions
                exercise={currentExercise}
                currentStep={currentStep}
                />
                
                <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <ExerciseTimer
                    timeLeft={progress.timeLeft}
                    onTimeUpdate={handleTimeUpdate}
                    isActive={isActive}
                    />
                    <div className="space-y-2">
                    <div className="text-2xl">
                        Puntuación: {progress.score}
                    </div>
                    <div className="text-sm text-gray-400">
                        Tiempo sostenido: {currentHoldTime.toFixed(1)}s / {REQUIRED_HOLD_TIME}s
                    </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                    onClick={() => setIsActive(!isActive)}
                    className={`flex-1 py-3 rounded-lg ${
                        isActive ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    type="button"
                    >
                    {isActive ? 'Pausar' : 'Iniciar'}
                    </button>
                    <button
                    onClick={() => {
                        setIsActive(false);
                        setProgress({
                        score: 0,
                        completedRepetitions: 0,
                        timeLeft: currentExercise.duration,
                        });
                        setCurrentStep(0);
                        setCurrentZone(0);
                        resetHolding();
                    }}
                    className="flex-1 py-3 bg-gray-600 rounded-lg"
                    type="button"
                    >
                    Reiniciar
                    </button>
                </div>
                </div>
            </div>

            <div className="relative">
                <ExerciseCamera
                onColorDetected={handleColorDetected}
                zones={FINGER_ZONES.map((zone, index) => ({
                    ...zone,
                    label: index === currentZone ? `¡${zone.label}!` : zone.label
                }))}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                />
                <div className="relative mt-4 ml-20">
                    <p className="text-2xl font-semibold mb-4">Pasos:</p>
                    <StepImages images={stepImages} />
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default FingerExerciseSession;