import React, { useEffect, useCallback } from 'react';

interface ExerciseTimerProps {
    timeLeft: number;
    onTimeUpdate: (newTime: number) => void;
    isActive: boolean;
}

function ExerciseTimer({ timeLeft, onTimeUpdate, isActive }: ExerciseTimerProps) {
    const updateTime = useCallback(() => {
        if (timeLeft > 0) {
        onTimeUpdate(timeLeft - 1);
        }
    }, [timeLeft, onTimeUpdate]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
        interval = setInterval(updateTime, 1000);
        }

        return () => {
        if (interval) {
            clearInterval(interval);
        }
        };
    }, [isActive, timeLeft, updateTime]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="text-2xl font-bold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
    );
}

export default ExerciseTimer;