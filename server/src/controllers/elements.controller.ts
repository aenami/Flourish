import type { Request, Response} from 'express' // Importamos los tipos de datos para req/res
import prisma from '../lib/prisma.js'

export const Elements = async (req: Request, res: Response) => {
    try {
        // 1. Tomamos el id del usuario
        const idUser = req.idUser

        // 2. Traemos los elementos relacionadas al usuario junto con sus habitos respectivos
        const elements = await prisma.elemento.findMany({
            where: {
                habito: {
                    id_usuario_habito: idUser
                }
            },
            include: {
                habito: {
                    select: {
                        nombre_habito: true,
                        tipo_habito: true
                    }
                }
            }
        })

        res.status(200).json({
            error: false,
            data: elements
        })

    } catch (error) {
        // Devolvemos la respuesta del error de nuestro modelo al frontend
        console.log('Error al obtener todos los elementos ', error)
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

// Guarda la posición (columna y fila) de un elemento en el grid isomérico
export const updateElementPosition = async (req: Request, res: Response) => {
  try {
    const idUser = req.idUser
    const elementId = Number(req.params.id)
    const { grid_col, grid_fila } = req.body

    if (!idUser) {
      return res.status(401).json({
        error: true,
        message: 'No autorizado'
      })
    }

    if (isNaN(elementId)) {
      return res.status(400).json({
        error: true,
        message: 'ID de elemento no válido'
      })
    }

    if (grid_col === undefined || grid_fila === undefined) {
      return res.status(400).json({
        error: true,
        message: 'Faltan coordenadas grid_col o grid_fila'
      })
    }

    // Validar que el elemento exista y pertenezca al usuario (a través de la relación de hábito)
    const element = await prisma.elemento.findUnique({
      where: { id_elemento: elementId },
      include: {
        habito: {
          select: {
            id_usuario_habito: true
          }
        }
      }
    })

    if (!element) {
      return res.status(404).json({
        error: true,
        message: 'El elemento no existe'
      })
    }

    if (element.habito.id_usuario_habito !== idUser) {
      return res.status(403).json({
        error: true,
        message: 'No tienes permiso para modificar este elemento'
      })
    }

    // Actualizar las coordenadas (pueden ser null para devolver a inventario)
    const updatedElement = await prisma.elemento.update({
      where: { id_elemento: elementId },
      data: {
        grid_col: grid_col === null ? null : Number(grid_col),
        grid_fila: grid_fila === null ? null : Number(grid_fila)
      }
    })

    return res.status(200).json({
      error: false,
      message: 'Ubicación del elemento guardada con éxito',
      data: updatedElement
    })
  } catch (error) {
    console.error('Error al actualizar posición del elemento:', error)
    return res.status(500).json({
      error: true,
      message: error instanceof Error ? error.message : 'Error interno al actualizar la posición del elemento'
    })
  }
}