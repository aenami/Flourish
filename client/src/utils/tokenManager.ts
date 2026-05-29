const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export type UserInfo = {
  id: number
  nombre: string
}

function getStoragePair(remember: boolean) {
  return remember
    ? { storage: localStorage, storageToClean: sessionStorage }
    : { storage: sessionStorage, storageToClean: localStorage }
}

export const tokenManager = {
  saveSession(token: string, user: UserInfo, remember = true) {
    const { storage, storageToClean } = getStoragePair(remember)

    storage.setItem(TOKEN_KEY, token)
    storage.setItem(USER_KEY, JSON.stringify(user))
    storageToClean.removeItem(TOKEN_KEY)
    storageToClean.removeItem(USER_KEY)
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY)
    return user ? (JSON.parse(user) as UserInfo) : null
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
  },

  isAuthenticated() {
    const token = this.getToken()

    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as { exp?: number }
      return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },
}
