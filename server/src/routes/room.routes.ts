import express from 'express'
import { getRoom, updateRoom } from '../controllers/room.controller.js'
import { authenticateUser } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Obtener la habitación del usuario
router.get('/', authenticateUser, getRoom)

// Actualizar ciclo horario o clima de la habitación
router.patch('/', authenticateUser, updateRoom)

export default router
