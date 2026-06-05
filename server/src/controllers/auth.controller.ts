import type { Request, Response } from 'express'

import prisma from '../lib/prisma.js'
import { compareHash, hashPassword } from '../services/passwordService.js'
import { generateToken } from '../services/tokenService.js'
import { existsUser } from '../services/models/User.js'

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Nombre, email y contrasena son obligatorios',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: true,
        message: 'La contrasena debe tener minimo 8 caracteres',
      })
    }

    const validationInfo = await existsUser(email)

    if (validationInfo) {
      return res.status(409).json({
        error: true,
        message: 'El email ya esta siendo utilizado por otro usuario',
      })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.usuario.create({
      data: {
        nombre_usuario: username,
        email_usuario: email,
        password_hash: hashedPassword,
        habitacion_usuario: {
          create: {},
        },
      },
    })

    const token = generateToken(user.id_usuario)

    return res.status(201).json({
      error: false,
      message: 'Usuario creado con exito',
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre_usuario,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Stack trace del error:', error.stack)
    }
    console.log(error)
    return res.status(500).json({
      error: true,
      message: 'No fue posible crear el usuario. Intenta nuevamente.',
    })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email y contrasena son obligatorios',
      })
    }

    const userExists = await prisma.usuario.findFirst({
      where: {
        email_usuario: email,
      },
    })

    if (!userExists) {
      return res.status(409).json({
        error: true,
        message: 'El email ingresado no coincide con el de ningun usuario registrado',
      })
    }

    const validateData = await compareHash(password, userExists.password_hash)

    if (!validateData) {
      return res.status(409).json({
        error: true,
        message: 'Contrasena o email incorrectos. Verifica la informacion',
      })
    }

    const token = generateToken(userExists.id_usuario)

    return res.status(200).json({
      error: false,
      message: 'Login exitoso',
      token,
      user: {
        id: userExists.id_usuario,
        nombre: userExists.nombre_usuario,
      },
    })
  } catch (error) {
    console.error('Error detallado al logear el usuario:', error)

    return res.status(500).json({
      error: true,
      message: 'No fue posible iniciar sesion. Intenta nuevamente.',
    })
  }
}
