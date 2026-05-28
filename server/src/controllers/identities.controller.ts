import type { Request, Response} from 'express' // Importamos los tipos de datos para req/res
import prisma from '../lib/prisma.js'

export const Identities = async (req: Request, res: Response) => {
    try {
        // 1. Tomamos el id del usuario
        const idUser = req.idUser

        // 2. Traemos las identidades relacionadas al usuario
        const identities = await prisma.identidad.findMany({
            where: {
                id_usuario_identidad: idUser,
            }
        })

        res.status(200).json({
            error: false,
            data: identities
        })

    } catch (error) {
        // Devolvemos la respuesta del error de nuestro modelo al frontend
        console.log('Error al obtener todas las identidades: ', error)
        res.status(500).json({
            error: true,
            message: error
        })
    }
}