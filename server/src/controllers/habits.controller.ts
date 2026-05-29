import type { Request, Response} from 'express' // Importamos los tipos de datos para req/res
import prisma from '../lib/prisma.js'

interface Habit {
    id_habito: number;
    nombre_habito: string;
    tipo_habito: "POSITIVO" | "NEGATIVO"
    momentum_habito: number;
    xp_total_habito: number;
    sistema_habito: unknown; 
    dias_semana: number[];
    id_usuario_habito: number;
}

export const Habits = async (req: Request, res: Response) => {
    try {
        // 1. Tomamos el id del usuario
        const idUser = req.idUser

        if (!idUser) {
            return res.status(401).json({
                error: true,
                message: 'No autorizado'
            })
        }

        // 2. Traemos los habitos relacionadas al usuario
        const habits = await prisma.habito.findMany({
            where: {
                id_usuario_habito: idUser
            }
        }) as Habit[]

        // 3. Formateamos la estructura de los habitos devueltos
        const classifiedHabits = habits.reduce<{positivos: Habit[], negativos: Habit[]}>((acumulador, habit: Habit) => {
            if (habit.tipo_habito === "POSITIVO") {
                // Guardamos todo el habito como un objeto
                acumulador.positivos.push(habit);
            } else {
                acumulador.negativos.push(habit);
            }
            return acumulador;
        }, { positivos: [], negativos: [] }); // <- Iniciamos con las dos listas vacías


        res.status(200).json({
            error: false,
            data: classifiedHabits
        })

    } catch (error) {
        // Devolvemos la respuesta del error de nuestro modelo al frontend
        console.log('Error al obtener todos los habitos ', error)
        res.status(500).json({
            error: true,
            message: error
        })
    }
}
