import { api } from './Api'

export interface RoomData {
  id_habitacion: number
  momentum_general_habitacion: number
  ciclo_actual_habitacion: 'DIA' | 'NOCHE' | 'AMANECER'
  clima_actual_habitacion: 'SOLEADO' | 'LLUVIOSO' | 'NUBLADO'
  id_usuario_habitacion: number
}

// Obtener los datos de la habitación del usuario
export async function getRoomDetails(): Promise<{ error: boolean; data: RoomData }> {
  return (await api.get('/room')) as { error: boolean; data: RoomData }
}

// Actualizar el clima y/o ciclo horario
export async function updateRoomAtmosphere(payload: {
  ciclo_actual_habitacion?: 'DIA' | 'NOCHE' | 'AMANECER'
  clima_actual_habitacion?: 'SOLEADO' | 'LLUVIOSO' | 'NUBLADO'
}): Promise<{ error: boolean; data: RoomData }> {
  return (await api.patch('/room', payload)) as { error: boolean; data: RoomData }
}

// Guardar la nueva posición (columna, fila) de un elemento visual
export async function updateElementPosition(
  idElemento: number,
  payload: { grid_col: number | null; grid_fila: number | null }
): Promise<{ error: boolean; message: string; data: any }> {
  return (await api.patch(`/elements/${idElemento}/position`, payload)) as {
    error: boolean
    message: string
    data: any
  }
}
