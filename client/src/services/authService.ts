import { api } from './Api'
import { tokenManager } from '../utils/tokenManager'
import type { UserInfo } from '../utils/tokenManager'

type AuthResponse = {
  error: boolean
  message: string
  token?: string
  user?: UserInfo
}

type AuthSession = {
  error: false
  message: string
  token: string
  user: UserInfo
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = LoginPayload & {
  username: string
}

function parseAuthSession(response: AuthResponse): AuthSession {
  if (response.error) {
    throw new Error(response.message || 'No fue posible completar la solicitud')
  }

  if (!response.token || !response.user) {
    throw new Error('La respuesta de autenticacion no incluyo una sesion valida')
  }

  return {
    error: false,
    message: response.message,
    token: response.token,
    user: response.user,
  }
}

export async function login(payload: LoginPayload) {
  const response = (await api.post('/auth/login', payload, true)) as AuthResponse
  return parseAuthSession(response)
}

export async function register(payload: RegisterPayload) {
  const response = (await api.post('/auth/register', payload, true)) as AuthResponse
  return parseAuthSession(response)
}

export function saveAuthSession(token: string, user: UserInfo, remember = true) {
  tokenManager.saveSession(token, user, remember)
}
