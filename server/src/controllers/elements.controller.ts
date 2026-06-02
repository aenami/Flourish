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