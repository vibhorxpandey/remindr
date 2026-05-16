import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { getChatHistory, sendChat } from '../api'
import type { ChatMessage, User } from '../types'
import { format } from 'date-fns'
import clsx from 'clsx'

interface Props { user: User }

export default function Chat({ user }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getChatHistory().then(r => {
      setMessages(r.data)
      setInitialLoad(false)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setLoading(true)

    // Optimistic user message
    const tempId = Date.now()
    setMessages(prev => [...prev, {
      id: tempId, role: 'user', content: text,
      created_at: new Date().toISOString(),
    }])

    try {
      const res = await sendChat(text)
      setMessages(prev => [...prev, res.data])
    } catch {
      setMessages(prev => [...prev, {
        id: tempId + 1, role: 'assistant',
        content: "Sorry, I had a hiccup there. Try again? 🙈",
        created_at: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const quickPrompts = [
    "What should I focus on today?",
    "How am I doing this week?",
    "I'm feeling overwhelmed",
    "What's overdue?",
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-600 px-8 py-4 flex items-center gap-4">
        <div className="relative">
          <div className="w-11 h-11 bg-brand-500 rounded-xl flex items-center justify-center text-xl">🧠</div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-dark-800" />
        </div>
        <div>
          <h2 className="text-white font-semibold">Rem</h2>
          <p className="text-xs text-emerald-400">Online · Learning your patterns</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {initialLoad ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👋</div>
            <p className="text-white font-medium">Hey {user.username}!</p>
            <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
              I'm Rem, your AI friend. I'm learning your patterns so I can remind you at the right time. Say hello!
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={clsx('flex gap-3 animate-fade-in', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-1">
                  🧠
                </div>
              )}
              <div className={clsx('max-w-xs lg:max-w-md', msg.role === 'user' ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
                <div className={clsx(
                  'px-4 py-3 rounded-2xl text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-brand-500 text-white rounded-tr-sm'
                    : 'bg-dark-700 text-gray-200 rounded-tl-sm'
                )}>
                  {msg.content}
                </div>
                <span className="text-xs text-gray-600 px-1">
                  {format(new Date(msg.created_at), 'h:mm a')}
                </span>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-sm flex-shrink-0">🧠</div>
            <div className="bg-dark-700 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 0 && (
        <div className="px-6 pb-2 flex gap-2 flex-wrap">
          {quickPrompts.map(p => (
            <button
              key={p}
              onClick={() => { setInput(p); }}
              className="bg-dark-700 hover:bg-dark-600 border border-dark-500 text-gray-400 hover:text-white text-xs px-3 py-2 rounded-xl transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-dark-800 border-t border-dark-600 p-4">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Talk to Rem..."
            rows={1}
            className="flex-1 bg-dark-700 border border-dark-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-11 h-11 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
