import express from 'express'
// Importamos metodos de nuestro controlador
import { Identities } from '../controllers/identities.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
const router = express.Router()

// Ruta para traer todas las identidades
router.get('/Identities', authenticateUser, Identities)



export default router

