import { Pool } from 'pg'

// Variable que contendrá el pool de conexiones
let pool: Pool;

// Función que se ejecutará al levantar el servidor
export const initializePool = async () => {

    // Creamos el pool de conexiones
    pool = new Pool({
        host: process.env.HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user:     process.env.DB_USER ,
        password: process.env.DB_PASSWORD ,
    })

    // Verificamos la conexión
    try {
        // Obtenemos una conexión del pool
        const connection = await pool.connect();

        console.log("Conexión realizada con éxito");

        // Liberamos la conexión
        connection.release();

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(
                "Error al intentar crear una conexión:",
                error.message
            );
            process.exit(1);

        } else {
            console.log(
                "Ocurrió un error inesperado al crear el pool hacia la DB"
            );
        }
    }
};

export const getConnection = () => {
    if (!pool) {
        throw new Error(
            "El pool de conexiones no ha sido inicializado"
        );
    }

    return pool;
};