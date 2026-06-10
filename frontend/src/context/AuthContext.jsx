import { createContext, useContext, useState, useEffect } from 'react'
import { getProfile } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getProfile()
        .then(res => setUser(res.data.data || res.data))
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAdmin = user?.isAdmin === true || user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, loginUser, logoutUser, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
