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

    // Calcular el inicio de la semana actual (Lunes a las 00:00) para traer solo checks relevantes
    const now = new Date()
    const currentDay = now.getDay()
    const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
    
    // Lunes de la semana actual en la zona horaria del servidor
    const mondayLocal = new Date(now)
    mondayLocal.setDate(diffToMonday)
    
    // Objeto Date representando la medianoche UTC de ese mismo lunes local
    const startOfWeek = new Date(Date.UTC(
      mondayLocal.getFullYear(),
      mondayLocal.getMonth(),
      mondayLocal.getDate(),
      0, 0, 0, 0
    ))

    // 2. Traemos los habitos del usuario junto con sus identidades asociadas y registros de la semana
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
        elemento_habito: true,
        registroDiario: {
          where: {
            fecha_registro: {
              gte: startOfWeek,
            },
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

        // Calcular qué días de la semana ya fueron marcados
        const diasCompletados: number[] = []
        const diasRecaidos: number[] = []

        habit.registroDiario.forEach((reg: any) => {
          // Obtener el día de la semana en UTC (1 = Lunes, ..., 7 = Domingo)
          const checkDayOfWeek = new Date(reg.fecha_registro).getUTCDay()
          const checkDayValue = checkDayOfWeek === 0 ? 7 : checkDayOfWeek

          if (reg.check_realizado_registro) {
            diasCompletados.push(checkDayValue)
          } else {
            diasRecaidos.push(checkDayValue)
          }
        })

        const formattedHabit = {
          id_habito: habit.id_habito,
          nombre_habito: habit.nombre_habito,
          tipo_habito: habit.tipo_habito,
          momentum_habito: habit.momentum_habito,
          xp_total_habito: habit.xp_total_habito,
          sistema_habito: habit.sistema_habito,
          dias_semana: habit.dias_semana,
          identidad: identidadAsociada,
          dias_completados: diasCompletados,
          dias_recaidos: diasRecaidos,
          elemento: habit.elemento_habito ? {
            nombre_elemento: habit.elemento_habito.nombre_elemento,
            fase_elemento: habit.elemento_habito.fase_elemento,
            xp_fase_actual_elemento: habit.elemento_habito.xp_fase_actual_elemento
          } : null
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


export const checkHabit = async (req: Request, res: Response) => {
  try {
    const idUser = req.idUser
    const { id } = req.params
    const habitId = Number(id)

    if (!idUser) {
      return res.status(401).json({
        error: true,
        message: 'No autorizado',
      })
    }

    // 1. Buscar el hábito y sus identidades vinculadas
    const habit = await prisma.habito.findFirst({
      where: {
        id_habito: habitId,
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

    if (!habit) {
      return res.status(404).json({
        error: true,
        message: 'El hábito no existe o no pertenece al usuario autenticado',
      })
    }

    // 2. Procesar Check en Transacción de Prisma
    const updatedHabitData = await prisma.$transaction(async (tx: any) => {
      const newMomentum = Math.min(habit.momentum_habito + 10, 100)

      // A. Crear registro diario
      await tx.registroDiario.create({
        data: {
          check_realizado_registro: true,
          xp_registro: 20,
          momentum_instante_registro: newMomentum,
          id_habito_registro: habitId,
        },
      })

      // B. Actualizar hábito
      const updatedHabit = await tx.habito.update({
        where: { id_habito: habitId },
        data: {
          momentum_habito: newMomentum,
          xp_total_habito: habit.xp_total_habito + 20,
        },
      })

      // C. Actualizar identidades vinculadas
      for (const rel of habit.habitoIdentidad) {
        const identidad = rel.identidad
        let nextXp = identidad.xp_actual_identidad + 20
        let nextLevel = identidad.nivel_identidad
        
        // Fórmula exponencial: XP necesaria = 100 * (1.12 ^ nivel)
        let xpNeeded = 100 * Math.pow(1.12, nextLevel)
        while (nextXp >= xpNeeded) {
          nextXp -= xpNeeded
          nextLevel += 1
          xpNeeded = 100 * Math.pow(1.12, nextLevel)
        }

        await tx.identidad.update({
          where: { id_identidad: identidad.id_identidad },
          data: {
            nivel_identidad: nextLevel,
            xp_actual_identidad: nextXp,
          },
        })
      }

      // D. Actualizar progreso del elemento visual asociado al hábito
      const element = await tx.elemento.findUnique({
        where: { id_habito_elemento: habitId },
      })

      if (element) {
        let currentPhase = element.fase_elemento
        let elementXp = element.xp_fase_actual_elemento + 20
        let threshold = 100
        
        if (currentPhase === 2) threshold = 200
        if (currentPhase === 3) threshold = 400

        // Si no ha alcanzado la fase máxima (4), evaluar subida de fase
        if (currentPhase < 4 && elementXp >= threshold) {
          elementXp -= threshold
          currentPhase += 1
        }

        await tx.elemento.update({
          where: { id_elemento: element.id_elemento },
          data: {
            fase_elemento: currentPhase,
            xp_fase_actual_elemento: elementXp,
          },
        })
      }

      return updatedHabit
    })

    return res.status(200).json({
      error: false,
      message: 'Hábito completado exitosamente. +20 XP',
      data: {
        id_habito: updatedHabitData.id_habito,
        momentum_habito: updatedHabitData.momentum_habito,
        xp_total_habito: updatedHabitData.xp_total_habito,
      },
    })
  } catch (error) {
    console.error('Error detallado en checkHabit:', error)
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : 'Error interno al procesar el check',
    })
  }
}

export const relapseHabit = async (req: Request, res: Response) => {
  try {
    const idUser = req.idUser
    const { id } = req.params
    const habitId = Number(id)

    if (!idUser) {
      return res.status(401).json({
        error: true,
        message: 'No autorizado',
      })
    }

    // 1. Buscar el hábito
    const habit = await prisma.habito.findFirst({
      where: {
        id_habito: habitId,
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

    if (!habit) {
      return res.status(404).json({
        error: true,
        message: 'El hábito no existe o no pertenece al usuario autenticado',
      })
    }

    // 2. Procesar Recaída en Transacción de Prisma
    const updatedHabitData = await prisma.$transaction(async (tx: any) => {
      const newMomentum = Math.max(habit.momentum_habito - 10, 0)

      // A. Crear registro diario de recaída
      await tx.registroDiario.create({
        data: {
          check_realizado_registro: false,
          xp_registro: -10, // Registro con penalización
          momentum_instante_registro: newMomentum,
          id_habito_registro: habitId,
        },
      })

      // B. Actualizar hábito
      const updatedHabit = await tx.habito.update({
        where: { id_habito: habitId },
        data: {
          momentum_habito: newMomentum,
        },
      })

      // C. Aplicar penalización ligera a las identidades sin reducir el nivel actual (mínimo 0 XP)
      for (const rel of habit.habitoIdentidad) {
        const identidad = rel.identidad
        const nextXp = Math.max(identidad.xp_actual_identidad - 10, 0)

        await tx.identidad.update({
          where: { id_identidad: identidad.id_identidad },
          data: {
            xp_actual_identidad: nextXp,
          },
        })
      }

      return updatedHabit
    })

    return res.status(200).json({
      error: false,
      message: 'Recaída registrada. Momentum reducido.',
      data: {
        id_habito: updatedHabitData.id_habito,
        momentum_habito: updatedHabitData.momentum_habito,
      },
    })
  } catch (error) {
    console.error('Error detallado en relapseHabit:', error)
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : 'Error interno al registrar la recaída',
    })
  }
}

export const createHabit = async (req: Request, res: Response) => {
  try {
    const idUser = req.idUser
    const { nombre_habito, tipo_habito, sistema_habito, dias_semana, id_identidad, nombre_elemento } = req.body

    if (!idUser) {
      return res.status(401).json({
        error: true,
        message: 'No autorizado',
      })
    }

    if (!nombre_habito || !tipo_habito || !sistema_habito || !dias_semana || !Array.isArray(dias_semana)) {
      return res.status(400).json({
        error: true,
        message: 'Faltan campos obligatorios para crear el hábito',
      })
    }

    const createdHabit = await prisma.$transaction(async (tx: any) => {
      // 1. Crear el hábito
      const habit = await tx.habito.create({
        data: {
          nombre_habito: nombre_habito.trim(),
          tipo_habito: tipo_habito,
          momentum_habito: 0,
          xp_total_habito: 0,
          sistema_habito: sistema_habito,
          dias_semana: dias_semana,
          id_usuario_habito: idUser,
        },
      })

      // 2. Si hay id_identidad, enlazar con HabitoIdentidad
      if (id_identidad) {
        await tx.habitoIdentidad.create({
          data: {
            id_identidad_habitoIdentidad: Number(id_identidad),
            id_habito_habitoIdentidad: habit.id_habito,
          },
        })
      }

      // 3. Crear el elemento de habitación por defecto para el Manifiesto Visual (sin colocar por defecto)
      await tx.elemento.create({
        data: {
          nombre_elemento: nombre_elemento ? nombre_elemento.trim() : 'Libro Antiguo',
          fase_elemento: 1,
          grid_col: null,
          grid_fila: null,
          xp_fase_actual_elemento: 0,
          id_habito_elemento: habit.id_habito,
        },
      })

      return habit
    })

    return res.status(201).json({
      error: false,
      message: 'Hábito forjado exitosamente.',
      data: createdHabit,
    })
  } catch (error) {
    console.error('Error detallado en createHabit:', error)
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : 'Error interno al crear el hábito',
    })
  }
}

