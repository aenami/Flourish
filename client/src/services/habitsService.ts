import { api } from './Api'

export interface CheckResponse {
  error: boolean
  message: string
  data: {
    id_habito: number
    momentum_habito: number
    xp_total_habito?: number
  }
}

/**
 * Registra el check diario de un hábito positivo en la base de datos.
 * @param id ID único del hábito positivo
 */
export async function checkHabit(id: number): Promise<CheckResponse> {
  return (await api.post(`/habits/${id}/check`, {})) as CheckResponse
}

/**
 * Registra una recaída de un hábito negativo en la base de datos.
 * @param id ID único del hábito a eliminar (negativo)
 */
export async function relapseHabit(id: number): Promise<CheckResponse> {
  return (await api.post(`/habits/${id}/relapse`, {})) as CheckResponse
}
