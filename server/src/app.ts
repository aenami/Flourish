// -------Impotando modulos y librearias
import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import elementRoutes from './routes/elements.routes.js'
import habitRoutes from './routes/habits.routes.js'
import identitiesRoutes from './routes/identities.routes.js'
dotenv.config();
const app = express()

// ------- Settings de nuestro backend
app.set('case sensitive routing', true)
app.set('appName', 'Express app')
app.set('port', process.env.PORT ?? 3000) // -----TRAER EL PUERTO CON UNA VARIBALE DE ENTORNO


// ------- MIDDLEWARES ------
app.use(cors( {
    origin: "http://localhost:5173"
} ))
app.use(express.json())
app.use(express.urlencoded( {extended: false} ))


// ------- RUTAS CREADAS -----
app.use('/auth', authRoutes)
app.use('/elements', elementRoutes)
app.use('/habits', habitRoutes)
app.use('/identities', identitiesRoutes)

export default app
