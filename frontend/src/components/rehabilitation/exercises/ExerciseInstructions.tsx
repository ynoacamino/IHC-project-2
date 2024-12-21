import React from 'react';
import { Exercise } from './types';

interface ExerciseInstructionsProps {
    exercise: Exercise;
    currentStep: number;
}

function ExerciseInstructions({ exercise, currentStep }: ExerciseInstructionsProps) {
    return (
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
        <p className="text-gray-300">{exercise.description}</p>
        
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Instrucciones:</h3>
            <ul className="list-disc list-inside space-y-2">
            {exercise.instructions.map((instruction, index) => (
                <li
                key={index}
                className={`${
                    index === currentStep
                    ? 'text-green-400 font-bold'
                    : 'text-gray-300'
                }`}
                >
                {instruction}
                </li>
            ))}
            </ul>
        </div>

        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Beneficios:</h3>
            <ul className="list-disc list-inside space-y-1">
            {exercise.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-300">
                {benefit}
                </li>
            ))}
            </ul>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Dificultad: {exercise.difficulty}</span>
            <span>Áreas: {exercise.targetAreas.join(', ')}</span>
        </div>
        </div>
    );
}

export default ExerciseInstructions;