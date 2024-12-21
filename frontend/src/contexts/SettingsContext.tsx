import React, { createContext, useContext, useState } from 'react';

interface SettingsContextType {
    rgbColor: string;
    red: number;
    green: number;
    blue: number;
    threshold: number;
    setRed: (value: number) => void;
    setGreen: (value: number) => void;
    setBlue: (value: number) => void;
    setThreshold: (value: number) => void;
    generateBlackAndWhitePreview: (frameData: Uint8ClampedArray) => Uint8ClampedArray;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [red, setRed] = useState(0);
    const [green, setGreen] = useState(0);
    const [blue, setBlue] = useState(0);
    const [threshold, setThreshold] = useState(50);

    const rgbColor = `rgb(${red}, ${green}, ${blue})`;

    const generateBlackAndWhitePreview = (frameData: Uint8ClampedArray): Uint8ClampedArray => {
        const output = new Uint8ClampedArray(frameData.length);

        for (let i = 0; i < frameData.length; i += 4) {
        const r = frameData[i];
        const g = frameData[i + 1];
        const b = frameData[i + 2];

        const colorDistance = Math.sqrt(
            (r - red) ** 2 + (g - green) ** 2 + (b - blue) ** 2,
        );

        if (colorDistance <= threshold) {
            output[i] = 255;
            output[i + 1] = 255;
            output[i + 2] = 255;
            output[i + 3] = 255;
        } else {
            output[i] = 0;
            output[i + 1] = 0;
            output[i + 2] = 0;
            output[i + 3] = 255;
        }
        }

        return output;
    };

    return (
        <SettingsContext.Provider
        value={{
            rgbColor,
            red,
            green,
            blue,
            threshold,
            setRed,
            setGreen,
            setBlue,
            setThreshold,
            generateBlackAndWhitePreview,
        }}
        >
        {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings debe usarse dentro de un SettingsProvider');
    }
    return context;
};