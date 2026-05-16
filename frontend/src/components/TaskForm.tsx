import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { CATEGORIES, CATEGORY_EMOJI } from '../types'
import clsx from 'clsx'

interface Props {
  onSubmit: (data: {
    title: string; description?: string; category: string; priority: number; due_date?: string
  }) => Promise<void>
  onClose: () => void
}

export default function TaskForm({ onSubmit, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [priority, setPriority] = useState(2)
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <h2 className="text-white font-semibold text-lg">New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Task title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full bg-dark-700 border border-dark-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={2}
              className="w-full bg-dark-700 border border-dark-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Priority</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={clsx(
                      'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                      priority === p
                        ? p === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : p === 2 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-dark-700 text-gray-500 border border-dark-500 hover:border-dark-400'
                    )}
                  >
                    {p === 1 ? 'Low' : p === 2 ? 'Med' : 'High'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Due date (optional)</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-dark-700 border border-dark-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={16} />
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  )
}
