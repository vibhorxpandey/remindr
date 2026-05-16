import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api'

interface Props { onAuth: (token: string) => void }

export default function Login({ onAuth }: Props) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = mode === 'login'
        ? await login(email, password)
        : await register(email, username, password)
      onAuth(res.data.access_token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
            🧠
          </div>
          <h1 className="text-3xl font-bold text-white">Remindr</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Meet <span className="text-brand-500 font-medium">Rem</span> — your AI friend who learns your patterns and never lets you forget.
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 shadow-2xl">
          <div className="flex bg-dark-700 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Your name</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="What should Rem call you?"
                  className="w-full bg-dark-700 border border-dark-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-dark-700 border border-dark-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-700 border border-dark-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all mt-2"
            >
              {loading ? '...' : mode === 'login' ? 'Sign In' : 'Meet Rem →'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Your data stays on your machine. 🔒
        </p>
      </div>
    </div>
  )
}
