import { Exercise } from './types';

export const fingerExercises: Exercise[] = [
    {
        id: 'finger-tap',
        name: 'Tapping Individual',
        description: 'Ejercicio de precisión para cada dedo',
        duration: 90,
        difficulty: 'Fácil',
        targetAreas: ['Dedos', 'Coordinación'],
        instructions: [
        'Coloca la mano frente a la cámara',
        'Toca con cada dedo la zona indicada',
        'Mantén el contacto por 1 segundo',
        'Sigue el orden: pulgar, índice, medio, anular, meñique',
        'Repite la secuencia 10 veces'
        ],
        benefits: [
        'Mejora la precisión del movimiento',
        'Aumenta la independencia de los dedos',
        'Fortalece la coordinación fina'
        ]
    },
    {
        id: 'finger-stretch',
        name: 'Estiramiento de Dedos',
        description: 'Ejercicio para mejorar la flexibilidad',
        duration: 120,
        difficulty: 'Medio',
        targetAreas: ['Dedos', 'Tendones'],
        instructions: [
        'Extiende todos los dedos',
        'Sepáralos lo máximo posible',
        'Mantén la posición por 5 segundos',
        'Relaja y junta los dedos',
        'Repite 8 veces'
        ],
        benefits: [
        'Aumenta el rango de movimiento',
        'Mejora la flexibilidad',
        'Reduce la tensión muscular'
        ]
    }
];