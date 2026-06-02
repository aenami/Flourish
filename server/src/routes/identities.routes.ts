import express from 'express'
// Importamos metodos de nuestro controlador
import { Identities, createIdentity } from '../controllers/identities.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
const router = express.Router()

// Ruta para traer todas las identidades
router.get('/', authenticateUser, Identities)

// Ruta para crear una nueva identidad
router.post('/', authenticateUser, createIdentity)



export default router

