import React, { createContext, useContext, useState } from 'react';

// Definir la forma de los datos que gestionará el contexto
interface SettingsContextType {
  rgbColor: string; // El color actual en formato 'rgb(r, g, b)'
  red: number;
  green: number;
  blue: number;
  setRed: (value: number) => void;
  setGreen: (value: number) => void;
  setBlue: (value: number) => void;
}

// Crear el contexto
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Crear el proveedor
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  const rgbColor = `rgb(${red}, ${green}, ${blue})`;

  return (
    <SettingsContext.Provider
      value={{
        rgbColor,
        red,
        green,
        blue,
        setRed,
        setGreen,
        setBlue,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Crear un hook para usar el contexto fácilmente
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe usarse dentro de un SettingsProvider');
  }
  return context;
};
