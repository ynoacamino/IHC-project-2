import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css'; // Asegúrate de que tu CSS esté aquí
import App from './App';

const container = document.getElementById('root') as HTMLElement; // Usa la declaración de tipo aquí

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
