import type { Request, Response } from 'express'
import prisma from '../lib/prisma.js'

interface HabitInput {
  nombre_habito: string
  tipo_habito: 'POSITIVO' | 'NEGATIVO'
  momentum_habito: number
  xp_total_habito: number
  sistema_habito: Record<string, unknown>
  dias_semana: number[]
}

export const Habits = async (req: Request, res: Response) => {
  try {
    // 1. Tomamos el id del usuario de la request (establecido por el auth.middleware)
    const idUser = req.idUser

    if (!idUser) {
      return res.status(401).json({
        error: true,
        message: 'No autorizado',
      })
    }

    // 2. Traemos los habitos del usuario junto con sus identidades asociadas
    let habits = await prisma.habito.findMany({
      where: {
        id_usuario_habito: idUser,
      },
      include: {
        habitoIdentidad: {
          include: {
            identidad: true,
          },
        },
      },
    })
    // 3. Si no tiene hábitos, simplemente devolveremos listas vacías y el frontend mostrará el empty state

    // 4. Clasificamos y formateamos la estructura de los habitos devueltos
    const classifiedHabits = habits.reduce<{ positivos: any[]; negativos: any[] }>(
      (acumulador: { positivos: any[]; negativos: any[] }, habit: any) => {
        // Formateamos para incluir la identidad directamente si existe
        const identidadAsociada = habit.habitoIdentidad[0]?.identidad?.nombre_identidad || null
        const formattedHabit = {
          id_habito: habit.id_habito,
          nombre_habito: habit.nombre_habito,
          tipo_habito: habit.tipo_habito,
          momentum_habito: habit.momentum_habito,
          xp_total_habito: habit.xp_total_habito,
          sistema_habito: habit.sistema_habito,
          dias_semana: habit.dias_semana,
          identidad: identidadAsociada,
        }

        if (habit.tipo_habito === 'POSITIVO') {
          acumulador.positivos.push(formattedHabit)
        } else {
          acumulador.negativos.push(formattedHabit)
        }
        return acumulador
      },
      { positivos: [], negativos: [] }
    )

    return res.status(200).json({
      error: false,
      data: classifiedHabits,
    })
  } catch (error) {
    console.log('Error al obtener todos los habitos ', error)
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : 'Error interno del servidor',
    })
  }
}
