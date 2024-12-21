export interface Exercise {
    id: string;
    name: string;
    description: string;
    duration: number;
    difficulty: 'Fácil' | 'Medio' | 'Difícil';
    targetAreas: string[];
    instructions: string[];
    benefits: string[];
}

export interface Zone {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
}

export interface ExerciseProgress {
    score: number;
    completedRepetitions: number;
    timeLeft: number;
}