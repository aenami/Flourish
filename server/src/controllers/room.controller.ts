import type { Request, Response } from 'express'
import prisma from '../lib/prisma.js'

// Obtiene la configuración de la habitación del usuario
export const getRoom = async (req: Request, res: Response) => {
  try {
    const idUser = req.idUser

    if (!idUser) {
      return res.status(401).json({
        error: true,
        message: 'No autorizado'
      })
    }

    // Buscamos la habitación del usuario
    let room = await prisma.habitacion.findUnique({
      where: { id_usuario_habitacion: idUser }
    })

    // Caso de seguridad: si el usuario es antiguo y no tiene habitación creada, se la creamos en caliente
    if (!room) {
      console.log(`[ROOM DEFENSA] Creando habitación faltante para usuario ID: ${idUser}`)
      room = await prisma.habitacion.create({
        data: {
          id_usuario_habitacion: idUser,
          momentum_general_habitacion: 0,
          ciclo_actual_habitacion: 'DIA',
          clima_actual_habitacion: 'SOLEADO'
        }
      })
    }

    return res.status(200).json({
      error: false,
      data: room
    })
  } catch (error) {
    console.error('Error al obtener la habitación del usuario:', error)
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : 'Error interno al cargar la habitación'
    })
  }
}

// Actualiza el estado atmosférico (clima o ciclo horario) de la habitación
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const idUser = req.idUser
    const { ciclo_actual_habitacion, clima_actual_habitacion } = req.body

    if (!idUser) {
      return res.status(401).json({
        error: true,
        message: 'No autorizado'
      })
    }

    // Validar enums del ciclo
    if (ciclo_actual_habitacion && !['DIA', 'NOCHE', 'AMANECER'].includes(ciclo_actual_habitacion)) {
      return res.status(400).json({
        error: true,
        message: 'Ciclo de habitación no válido. Debe ser: DIA, NOCHE o AMANECER'
      })
    }

    // Validar enums del clima
    if (clima_actual_habitacion && !['SOLEADO', 'LLUVIOSO', 'NUBLADO'].includes(clima_actual_habitacion)) {
      return res.status(400).json({
        error: true,
        message: 'Clima de habitación no válido. Debe ser: SOLEADO, LLUVIOSO o NUBLADO'
      })
    }

    // Construimos la data dinámica para la actualización
    const updateData: any = {}
    if (ciclo_actual_habitacion) updateData.ciclo_actual_habitacion = ciclo_actual_habitacion
    if (clima_actual_habitacion) updateData.clima_actual_habitacion = clima_actual_habitacion

    const updatedRoom = await prisma.habitacion.update({
      where: { id_usuario_habitacion: idUser },
      data: updateData
    })

    return res.status(200).json({
      error: false,
      message: 'Habitación actualizada correctamente',
      data: updatedRoom
    })
  } catch (error) {
    console.error('Error al actualizar la habitación del usuario:', error)
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : 'Error interno al actualizar la habitación'
    })
  }
}
