import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { subscribeAuth, fetchUserRole, logoutUser } from '../services/authService'
import { isFirebaseConfigured } from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('guest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return subscribeAuth(async (u) => {
      if (!u) {
        setUser(null)
        setRole('guest')
        setLoading(false)
        return
      }
      setUser(u)
      setLoading(true)
      const r = await fetchUserRole(u.uid)
      setRole(r)
      setLoading(false)
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      isAdmin: role === 'admin',
      firebaseReady: isFirebaseConfigured,
      logout: logoutUser,
    }),
    [user, role, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
