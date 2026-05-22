// Importamos el cliente de prisma sobre el cual haremos nuestras consultas
import prisma from '../../lib/prisma.js'

export const existsUser = async (email: string) => {
    // Creando y devolviendo la respuesta de la consulta
    return await prisma.usuario.findFirst({
        where: {
            email_usuario: email
        }
    })

}





