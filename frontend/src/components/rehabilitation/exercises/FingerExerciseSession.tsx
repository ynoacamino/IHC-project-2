import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';
import ExerciseCamera from './ExerciseCamera';
import ExerciseTimer from './ExerciseTimer';
import ExerciseInstructions from './ExerciseInstructions';
import { fingerExercises } from './fingerExercises';
import type { ExerciseProgress, Zone } from './types';

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const FINGER_ZONES: Zone[] = [
    { x: 120, y: 140, width: 80, height: 80, label: "Pulgar" },
    { x: 220, y: 140, width: 80, height: 80, label: "Índice" },
    { x: 320, y: 140, width: 80, height: 80, label: "Medio" },
    { x: 420, y: 140, width: 80, height: 80, label: "Anular" },
    { x: 520, y: 140, width: 80, height: 80, label: "Meñique" }
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

    const handleColorDetected = useCallback((x: number, y: number) => {
        // Implementar lógica de detección específica para ejercicios de dedos
        console.log('Color detected at:', x, y);
    }, []);

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
                        <div className="text-2xl">
                        Puntuación: {progress.score}
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
                        }}
                        className="flex-1 py-3 bg-gray-600 rounded-lg"
                        type="button"
                        >
                        Reiniciar
                        </button>
                    </div>
                    </div>
                </div>

                <ExerciseCamera
                    onColorDetected={handleColorDetected}
                    zones={FINGER_ZONES}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                />
                </div>
            </div>
        </div>
    );
}

export default FingerExerciseSession;