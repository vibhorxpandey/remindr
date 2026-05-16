import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Plus, Brain, MessageCircle } from 'lucide-react'
import { getTasks, getDailySummary, getGreeting, createTask, updateTask } from '../api'
import type { Task, User } from '../types'
import { CATEGORY_EMOJI, PRIORITY_COLOR } from '../types'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import { formatDistanceToNow, isPast, isToday } from 'date-fns'
import clsx from 'clsx'

interface Props { user: User; onUserUpdate: () => void }

export default function Dashboard({ user, onUserUpdate }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [greeting, setGreeting] = useState('')
  const [summary, setSummary] = useState<{ message: string; completed_today: number; pending: number; overdue: number } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const [t, g, s] = await Promise.all([
      getTasks({ completed: false }),
      getGreeting(),
      getDailySummary(),
    ])
    setTasks(t.data)
    setGreeting(g.data.message)
    setSummary(s.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleComplete = async (id: number) => {
    await updateTask(id, { completed: true })
    onUserUpdate()
    fetchData()
  }

  const handleDelete = async (id: number) => {
    const { deleteTask } = await import('../api')
    await deleteTask(id)
    fetchData()
  }

  const handleCreate = async (data: Parameters<typeof createTask>[0]) => {
    await createTask(data)
    fetchData()
  }

  const todayTasks = tasks.filter(t => t.due_date && isToday(new Date(t.due_date)))
  const overdueTasks = tasks.filter(t => t.due_date && isPast(new Date(t.due_date)))
  const highPriority = tasks.filter(t => t.priority === 3).slice(0, 3)
  const completionPct = Math.round(user.avg_completion_rate * 100)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Rem is waking up...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Greeting card */}
      <div className="bg-gradient-to-r from-brand-500/20 to-purple-600/20 border border-brand-500/30 rounded-2xl p-6 mb-6 flex items-start gap-4">
        <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          🧠
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">{greeting}</p>
          {summary && (
            <p className="text-gray-400 text-sm mt-1">{summary.message}</p>
          )}
        </div>
        <Link
          to="/chat"
          className="flex items-center gap-2 bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/30 text-brand-400 px-4 py-2 rounded-xl text-sm transition-all flex-shrink-0"
        >
          <MessageCircle size={14} />
          Chat with Rem
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tasks', value: user.total_tasks, icon: CheckCircle, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'Completed', value: user.completed_tasks, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Pending', value: summary?.pending ?? 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Overdue', value: summary?.overdue ?? 0, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg)}>
              <Icon size={18} className={color} />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-gray-500 text-sm mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Today's tasks */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Today's Tasks</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <Plus size={14} />
              Add Task
            </button>
          </div>

          {todayTasks.length === 0 && overdueTasks.length === 0 ? (
            <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-white font-medium">Nothing due today!</p>
              <p className="text-gray-500 text-sm mt-1">Rem is proud of you. Add a task to keep the momentum.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTasks.map(t => (
                <TaskCard key={t.id} task={t} onComplete={handleComplete} onDelete={handleDelete} />
              ))}
              {todayTasks.filter(t => !overdueTasks.includes(t)).map(t => (
                <TaskCard key={t.id} task={t} onComplete={handleComplete} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {/* All pending */}
          {tasks.filter(t => !todayTasks.includes(t) && !overdueTasks.includes(t)).length > 0 && (
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-3">Upcoming</h3>
              <div className="space-y-3">
                {tasks
                  .filter(t => !todayTasks.includes(t) && !overdueTasks.includes(t))
                  .slice(0, 4)
                  .map(t => (
                    <TaskCard key={t.id} task={t} onComplete={handleComplete} onDelete={handleDelete} />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Completion rate */}
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-brand-400" />
              <h3 className="text-white font-medium text-sm">Rem's Analysis</h3>
            </div>
            <div className="text-center py-2">
              <div className="text-4xl font-bold text-white">{completionPct}%</div>
              <div className="text-gray-500 text-xs mt-1">Completion rate</div>
            </div>
            <div className="mt-3 h-2 bg-dark-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            {user.most_productive_hour !== null && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                ⚡ You're most productive at {user.most_productive_hour}:00
              </p>
            )}
          </div>

          {/* High priority */}
          {highPriority.length > 0 && (
            <div className="bg-dark-800 border border-red-500/20 rounded-2xl p-5">
              <h3 className="text-white font-medium text-sm mb-3">🔥 High Priority</h3>
              <div className="space-y-2">
                {highPriority.map(t => (
                  <div key={t.id} className="flex items-center gap-2">
                    <button
                      onClick={() => handleComplete(t.id)}
                      className="w-5 h-5 rounded-full border-2 border-red-400/50 flex-shrink-0 hover:bg-red-400/10 transition-all"
                    />
                    <span className="text-sm text-gray-300 truncate">{CATEGORY_EMOJI[t.category]} {t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick add */}
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-dark-800 border border-dashed border-dark-500 hover:border-brand-500/50 text-gray-500 hover:text-brand-400 rounded-2xl p-4 text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={14} />
            Add new task
          </button>
        </div>
      </div>

      {showForm && (
        <TaskForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}
