import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Hand, Pointer, Brain, Info,
} from 'lucide-react';

function Rehabilitation() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <button
            onClick={() => navigate('/game-options')}
            className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
            type="button"
        >
            <ArrowLeft className="h-8 w-8" />
        </button>

        <div className="text-center w-full max-w-7xl">
            <h1 className="text-6xl font-bold text-white mb-8">Rehabilitación</h1>
            
            <div className="bg-gray-800 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <div className="flex items-center mb-4">
                <Info className="h-6 w-6 mr-2 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Guía de Ejercicios</h2>
            </div>
            <p className="text-gray-300 text-left">
                Nuestros ejercicios están diseñados para mejorar la movilidad, fuerza y coordinación
                de manos y dedos. Cada sesión incluye seguimiento en tiempo real y feedback inmediato
                para garantizar una correcta ejecución.
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-11/12 mx-auto">
            <div
                className="bg-green-600 rounded-lg p-8 cursor-pointer hover:bg-green-700 transition-colors transform hover:scale-105"
                onClick={() => navigate('/hand-exercises')}
            >
                <div className="flex items-center justify-center mb-4">
                    <h2 className="text-3xl font-bold">MANOS</h2>
                </div>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2121/2121078.png"
                    alt="Mano"
                    className="w-40 h-40 mx-auto mb-4"
                />
                <p className="text-gray-100 mb-6">
                Ejercicios específicos para mejorar la movilidad y fuerza de la mano completa.
                Incluye movimientos de flexión, extensión y rotación.
                </p>
                <ul className="text-left text-gray-100 space-y-2">
                <li className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Coordinación mano-ojo
                </li>
                <li className="flex items-center">
                    <Hand className="h-4 w-4 mr-2" />
                    Fuerza de agarre
                </li>
                <li className="flex items-center">
                    <Pointer className="h-4 w-4 mr-2" />
                    Control de movimiento
                </li>
                </ul>
            </div>

            <div
                className="bg-yellow-600 rounded-lg p-8 cursor-pointer hover:bg-yellow-700 transition-colors transform hover:scale-105"
                onClick={() => navigate('/finger-exercises')}
            >
                <div className="flex items-center justify-center mb-4">
                    <h2 className="text-3xl font-bold">DEDOS</h2>
                </div>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/6907/6907294.png"
                    alt="Dedos"
                    className="w-40 h-40 mx-auto mb-4"
                />
                <p className="text-gray-100 mb-6">
                Ejercicios precisos para mejorar la destreza y control individual de cada dedo.
                Perfecto para recuperar la motricidad fina.
                </p>
                <ul className="text-left text-gray-100 space-y-2">
                <li className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Precisión
                </li>
                <li className="flex items-center">
                    <Hand className="h-4 w-4 mr-2" />
                    Flexibilidad
                </li>
                <li className="flex items-center">
                    <Pointer className="h-4 w-4 mr-2" />
                    Independencia digital
                </li>
                </ul>
            </div>
            </div>
        </div>
        </div>
    );
}

export default Rehabilitation;