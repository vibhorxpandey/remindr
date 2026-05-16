import { useEffect, useState } from 'react'
import { Plus, Filter, Search } from 'lucide-react'
import { getTasks, updateTask, deleteTask, createTask } from '../api'
import type { Task } from '../types'
import { CATEGORIES, CATEGORY_EMOJI } from '../types'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import clsx from 'clsx'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    setLoading(true)
    const params: { completed?: boolean; category?: string } = {}
    if (filter === 'pending') params.completed = false
    if (filter === 'completed') params.completed = true
    if (category !== 'all') params.category = category
    const res = await getTasks(params)
    setTasks(res.data)
    setLoading(false)
  }

  useEffect(() => { fetchTasks() }, [filter, category])

  const displayed = tasks.filter(t =>
    search === '' || t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleComplete = async (id: number) => {
    await updateTask(id, { completed: true })
    fetchTasks()
  }

  const handleDelete = async (id: number) => {
    await deleteTask(id)
    fetchTasks()
  }

  const handleCreate = async (data: Parameters<typeof createTask>[0]) => {
    await createTask(data)
    fetchTasks()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">{tasks.length} total · {tasks.filter(t => !t.completed).length} pending</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 mb-6 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-dark-700 border border-dark-500 text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          {/* Status filter */}
          <div className="flex bg-dark-700 rounded-xl p-1">
            {(['all', 'pending', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                  filter === f ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setCategory('all')}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs transition-all',
                category === 'all' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              All
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs transition-all',
                  category === c ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'text-gray-500 hover:text-gray-300'
                )}
              >
                {CATEGORY_EMOJI[c]} {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">✨</div>
          <p className="text-white font-medium">No tasks here!</p>
          <p className="text-gray-500 text-sm mt-1">
            {filter === 'completed' ? 'Complete some tasks to see them here.' : 'Add your first task to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && <TaskForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
    </div>
  )
}
