import app from './app.js'
import dotenv from 'dotenv'
import prisma from './lib/prisma.js'

dotenv.config() // Inicializamos variables de entorno en este archivo para todo el proyecto

const PORT = process.env.PORT ?? 3000;

// Funcion principal
const startServer = async () => {
    try {
        // Verificamos que prisma haya arrancado correctamente
        await prisma.$connect()

        app.listen(PORT, () => {
            console.log(`Servidor escuchando por peticiones en el puerto ${PORT}`)
        })
    } catch (error) {
        console.log('Ocurrio un error al intentar levantar el servidor: ', error)
    }
}

startServer()
