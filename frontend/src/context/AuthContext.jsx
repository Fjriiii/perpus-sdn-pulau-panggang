import { useMemo, useState } from 'react'
import api from '../services/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token'))
  const [username, setUsername] = useState(localStorage.getItem('admin_username'))

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_username', data.username)
    setToken(data.token)
    setUsername(data.username)
    return data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_username')
      setToken(null)
      setUsername(null)
    }
  }

  const value = useMemo(() => ({ token, username, isAuthenticated: Boolean(token), login, logout }), [token, username])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
