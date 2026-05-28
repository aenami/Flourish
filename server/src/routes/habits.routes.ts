import express from 'express'
// Importamos metodos de nuestro controlador
import { Habits } from '../controllers/habits.controller';
import { authenticateUser } from '../middlewares/auth.middleware.js';
const router = express.Router()

// Ruta para traer todos los habitos y la información mas relevante relacionada a estos
router.get('/Habits', authenticateUser, Habits)



export default router

