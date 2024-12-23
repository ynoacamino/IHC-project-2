import { useState, useEffect, useCallback } from 'react';

interface UsePositionHoldProps {
    isActive: boolean;
    requiredHoldTime: number;
    onHoldComplete: () => void;
}

export function usePositionHold({ 
    isActive, 
    requiredHoldTime,
    onHoldComplete 
}: UsePositionHoldProps) {
    const [holdStartTime, setHoldStartTime] = useState<number | null>(null);
    const [currentHoldTime, setCurrentHoldTime] = useState(0);

    const startHolding = useCallback(() => {
        if (!holdStartTime) {
        setHoldStartTime(Date.now());
        }
    }, [holdStartTime]);

    const resetHolding = useCallback(() => {
        setHoldStartTime(null);
        setCurrentHoldTime(0);
    }, []);

    useEffect(() => {
        if (!isActive || !holdStartTime) return;

        const interval = setInterval(() => {
        const elapsed = (Date.now() - holdStartTime) / 1000;
        setCurrentHoldTime(elapsed);
        
        if (elapsed >= requiredHoldTime) {
            onHoldComplete();
            resetHolding();
        }
        }, 100);

        return () => clearInterval(interval);
    }, [holdStartTime, isActive, requiredHoldTime, onHoldComplete, resetHolding]);

    return {
        currentHoldTime,
        startHolding,
        resetHolding,
    };
}