import { Exercise } from './types';

export const handExercises: Exercise[] = [
    {
        id: 'hand-flex',
        name: 'Flexión y Extensión',
        description: 'Ejercicio para mejorar la movilidad general de la mano',
        duration: 135,
        difficulty: 'Fácil',
        targetAreas: ['Palma', 'Dedos', 'Muñeca'],
        instructions: [
        'Coloca tu mano frente a la cámara con la palma abierta',
        'Cierra la mano lentamente formando un puño',
        'Mantén la posición por 3 segundos',
        'Abre la mano completamente',
        'Repite el movimiento 10 veces'
        ],
        benefits: [
        'Mejora la flexibilidad de los dedos',
        'Aumenta la fuerza de agarre',
        'Reduce la rigidez articular'
        ]
    },
    {
        id: 'hand-rotation',
        name: 'Rotación de Muñeca',
        description: 'Ejercicio para mejorar la movilidad de la muñeca',
        duration: 90,
        difficulty: 'Medio',
        targetAreas: ['Muñeca', 'Antebrazo'],
        instructions: [
        'Extiende el brazo frente a la cámara',
        'Gira la muñeca en sentido horario',
        'Mantén cada posición por 2 segundos',
        'Cambia al sentido antihorario',
        'Realiza 8 repeticiones en cada dirección'
        ],
        benefits: [
        'Mejora la movilidad de la muñeca',
        'Fortalece los músculos del antebrazo',
        'Ayuda en la coordinación'
        ]
    }
];