import express from 'express'
// Importamos metodos de nuestro controlador
import { Elements, updateElementPosition } from '../controllers/elements.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
const router = express.Router()

// Ruta para traer todos los habitos y la información mas relevante relacionada a estos
router.get('/', authenticateUser, Elements)

// Ruta para guardar la posición (col, fila) en el grid isomérico
router.patch('/:id/position', authenticateUser, updateElementPosition)

export default router

