// Importamos el modelo
import { existsUser } from "../services/models/User.js"
import type { Request, Response} from 'express' // Importamos los tipos de datos para req/res
import { hashPassword, compareHash } from "../services/passwordService.js" // Improtamos el servicio de password
import { generateToken } from "../services/tokenService.js"
import prisma from '../lib/prisma.js'

export const createUser = async (req: Request, res: Response) => {
    // Extrameos la informacion del formulario
    const {username, email, password } = req.body

    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Nombre, email y contraseña son obligatorios'
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: true,
                message: 'La contraseña debe tener minimo 8 caracteres'
            })
        }

        //-------------- Validaciones previas a la insercion
        // Verificar que el email no haya sido usado previamente
        const validationInfo = await existsUser(email);

        if(validationInfo){
            return res.status(409).json({
                error: true,
                message: 'El email ya esta siendo utilizado por otro usuario'
            })
        }

        //------------- Logica para la insercion del usuario
        //1. Hasheamos la contraseña
        const hashedPassword = await hashPassword(password);

        //2. Intentamos insertar el usuario
        const user = await prisma.usuario.create({
            data: {
                nombre_usuario: username,
                email_usuario: email,
                password_hash: hashedPassword,
                habitacion_usuario: {
                    create: {}
                },
            }
        })

        const token = generateToken(user.id_usuario)

        res.status(201).json({
            error: false,
            message: 'Usuario creado con exito',
            token: token,
            user: {
                id: user.id_usuario,
                nombre: user.nombre_usuario,
            }
        })
        
    } catch (error) {
        // Devolvemos la respuesta del error de nuestro modelo al frontend
        console.log('Error al crear el usuario: ', error)
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        //1. Extraemos la informacion del formulario
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Email y contraseña son obligatorios'
            })
        }

        //2. Verificamos que el usuario exista en la db
        const userExists = await prisma.usuario.findFirst({
            where:{
                email_usuario: email
            }
        })

        if(!userExists){
            return res.status(409).json({
                error: true,
                message: 'El email ingresado no coincide con el de ningun usuario registrado'
            })
        }

        //3. Verificar la informacion ingresada por el usuario
        const validateData = await compareHash(password, userExists.password_hash)

        if(!validateData) {
            return res.status(409).json({
                error: true,
                message: 'Contraseña o email incorrectos. Verifica la informacion'
            })
        }

        // Luego de validar que si se ingreso la contraseña corecta, hacemos una consulta que traera el id del usuario el cual incluiremos en el body de nuestro token. Tambien informacion extra

        const token = generateToken(userExists.id_usuario)
        
        //-------Devolvemos la respuesta correcta al frontend con el token y la informacion del user logeado
        return res.status(200).json({
            error: false,
            message: 'Login exitoso..',
            token: token,
            user: {
                id: userExists.id_usuario,
                nombre: userExists.nombre_usuario,
            }

        })

    } catch (error) {
        console.log('Error al logear el usuario', error)
        return res.status(500).json({
            error: true,
            message: error
        })
    }
}
