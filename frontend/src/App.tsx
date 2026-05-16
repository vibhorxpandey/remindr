import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { getMe } from './api'
import type { User } from './types'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Chat from './pages/Chat'
import Analytics from './pages/Analytics'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) { setAuthLoading(false); return }
    try {
      const res = await getMe()
      setUser(res.data)
    } catch {
      localStorage.removeItem('token')
    } finally {
      setAuthLoading(false)
    }
  }, [])

  useEffect(() => { fetchUser() }, [fetchUser])

  const handleAuth = (token: string) => {
    localStorage.setItem('token', token)
    fetchUser()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-brand-500/20 rounded-2xl flex items-center justify-center text-3xl animate-pulse-slow">
            🧠
          </div>
          <p className="text-gray-500 text-sm">Starting Rem...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onAuth={handleAuth} />} />

        <Route
          element={
            <ProtectedRoute>
              {user ? <Layout userId={user.id} username={user.username} /> : <Navigate to="/login" />}
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={user ? <Dashboard user={user} onUserUpdate={fetchUser} /> : null}
          />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/chat" element={user ? <Chat user={user} /> : null} />
          <Route path="/analytics" element={user ? <Analytics user={user} /> : null} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
