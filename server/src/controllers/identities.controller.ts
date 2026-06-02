import type { Request, Response } from 'express' // Importamos los tipos de datos para req/res
import prisma from '../lib/prisma.js'

export const Identities = async (req: Request, res: Response) => {
    try {
        // 1. Tomamos el id del usuario
        const idUser = req.idUser

        if (!idUser) {
            return res.status(401).json({
                error: true,
                message: 'No autorizado'
            })
        }

        // 2. Traemos las identidades relacionadas al usuario junto con sus habitos y registros diarios
        const identities = await prisma.identidad.findMany({
            where: {
                id_usuario_identidad: idUser,
            },
            include: {
                HabitoIdentidad: {
                    include: {
                        habito: {
                            include: {
                                registroDiario: {
                                    orderBy: {
                                        fecha_registro: 'desc'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        // 3. Formatear la respuesta agregando momentum promedio y racha real
        const formattedIdentities = identities.map((id: any) => {
            const habits = id.HabitoIdentidad.map((hi: any) => hi.habito)
            
            // A. Calcular momentum promedio de los hábitos asociados
            let averageMomentum = 0
            if (habits.length > 0) {
                const totalMomentum = habits.reduce((acc: number, h: any) => acc + h.momentum_habito, 0)
                averageMomentum = Math.round(totalMomentum / habits.length)
            } else {
                // Si no hay hábitos asociados, podemos dar un valor inicial neutral o 0
                averageMomentum = 0
            }

            // B. Calcular racha actual (días únicos con check realizado)
            let rachaCurrent = 0
            if (habits.length > 0) {
                const allChecks = habits.flatMap((h: any) => h.registroDiario)
                const uniqueCheckDates = Array.from(new Set(
                    allChecks
                        .filter((reg: any) => reg.check_realizado_registro)
                        .map((reg: any) => new Date(reg.fecha_registro).toDateString())
                ))
                rachaCurrent = uniqueCheckDates.length
            }

            return {
                id_identidad: id.id_identidad,
                nombre_identidad: id.nombre_identidad,
                nivel_identidad: id.nivel_identidad,
                xp_actual_identidad: id.xp_actual_identidad,
                momentum: averageMomentum,
                racha: rachaCurrent
            }
        })

        res.status(200).json({
            error: false,
            data: formattedIdentities
        })

    } catch (error) {
        // Devolvemos la respuesta del error de nuestro modelo al frontend
        console.log('Error al obtener todas las identidades: ', error)
        res.status(500).json({
            error: true,
            message: error instanceof Error ? error.message : 'Error interno del servidor'
        })
    }
}

export const createIdentity = async (req: Request, res: Response) => {
    try {
        const idUser = req.idUser
        const { nombre_identidad } = req.body

        if (!idUser) {
            return res.status(401).json({
                error: true,
                message: 'No autorizado'
            })
        }

        if (!nombre_identidad || typeof nombre_identidad !== 'string' || !nombre_identidad.trim()) {
            return res.status(400).json({
                error: true,
                message: 'El nombre de la identidad es requerido'
            })
        }

        // Crear la identidad en la base de datos
        const newIdentity = await prisma.identidad.create({
            data: {
                nombre_identidad: nombre_identidad.trim(),
                id_usuario_identidad: idUser,
                nivel_identidad: 1,
                xp_actual_identidad: 0
            }
        })

        return res.status(201).json({
            error: false,
            data: newIdentity
        })
    } catch (error) {
        console.error('Error al crear identidad: ', error)
        return res.status(500).json({
            error: true,
            message: error instanceof Error ? error.message : 'Error interno al crear identidad'
        })
    }
}