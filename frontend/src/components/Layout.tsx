import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, MessageCircle, BarChart2, LogOut, Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useWebSocket, useNotificationPermission } from '../hooks/useNotifications'
import { getPendingReminders, acknowledgeReminder } from '../api'
import type { Reminder } from '../types'
import clsx from 'clsx'

interface Props { userId: number; username: string }

export default function Layout({ userId, username }: Props) {
  const navigate = useNavigate()
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showBell, setShowBell] = useState(false)
  const { request, show } = useNotificationPermission()

  useEffect(() => { request() }, [])

  useEffect(() => {
    getPendingReminders().then(r => setReminders(r.data))
  }, [])

  useWebSocket(userId, (data) => {
    if (data.type === 'reminder' || data.type === 'greeting') {
      const id = Date.now()
      setToasts(t => [...t, { id, message: data.message }])
      show('Rem — Remindr', data.message)
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 6000)
      getPendingReminders().then(r => setReminders(r.data))
    }
  })

  const ackAll = async () => {
    for (const r of reminders) {
      await acknowledgeReminder(r.id)
    }
    setReminders([])
    setShowBell(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/chat', icon: MessageCircle, label: 'Chat with Rem' },
    { to: '/analytics', icon: BarChart2, label: 'Patterns' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-dark-600 flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-6 border-b border-dark-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-xl">🧠</div>
            <div>
              <h1 className="text-white font-bold text-lg">Remindr</h1>
              <p className="text-dark-400 text-xs">Hey, {username}! 👋</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              )}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-dark-600 space-y-2">
          <button
            onClick={() => setShowBell(!showBell)}
            className="relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-dark-700 transition-all"
          >
            <Bell size={18} />
            Reminders
            {reminders.length > 0 && (
              <span className="absolute right-4 top-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {reminders.length}
              </span>
            )}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>

      {/* Reminder dropdown */}
      {showBell && reminders.length > 0 && (
        <div className="fixed top-4 right-4 w-80 bg-dark-700 border border-dark-500 rounded-2xl shadow-2xl z-50 p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Pending Reminders</h3>
            <button onClick={ackAll} className="text-brand-500 text-xs hover:underline">Dismiss all</button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {reminders.map(r => (
              <div key={r.id} className="bg-dark-800 rounded-xl p-3 text-sm text-gray-300">
                {r.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className="bg-brand-600 text-white px-4 py-3 rounded-xl shadow-xl max-w-xs text-sm animate-slide-up flex items-start gap-2">
            <span>🧠</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
