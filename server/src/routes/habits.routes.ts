import express from 'express'
// Importamos metodos de nuestro controlador
import { Habits, checkHabit, relapseHabit, createHabit } from '../controllers/habits.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
const router = express.Router()

// Ruta para traer todos los habitos y la información mas relevante relacionada a estos
router.get('/', authenticateUser, Habits)

// Ruta para crear un hábito nuevo
router.post('/', authenticateUser, createHabit)

// Ruta para registrar el check diario de un hábito positivo
router.post('/:id/check', authenticateUser, checkHabit)

// Ruta para registrar una recaída en un hábito negativo
router.post('/:id/relapse', authenticateUser, relapseHabit)



export default router
