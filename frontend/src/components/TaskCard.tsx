import { Check, Trash2, Clock, Flag, Brain } from 'lucide-react'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import type { Task } from '../types'
import { CATEGORY_EMOJI, PRIORITY_COLOR, PRIORITY_LABELS } from '../types'
import clsx from 'clsx'

interface Props {
  task: Task
  onComplete: (id: number) => void
  onDelete: (id: number) => void
}

export default function TaskCard({ task, onComplete, onDelete }: Props) {
  const isOverdue = task.due_date && !task.completed && isPast(new Date(task.due_date))
  const prob = task.predicted_completion_prob

  return (
    <div className={clsx(
      'bg-dark-800 border rounded-2xl p-4 transition-all hover:border-brand-500/50 group',
      task.completed ? 'border-dark-600 opacity-60' : isOverdue ? 'border-red-500/40' : 'border-dark-600'
    )}>
      <div className="flex items-start gap-3">
        {/* Completion button */}
        <button
          onClick={() => !task.completed && onComplete(task.id)}
          disabled={task.completed}
          className={clsx(
            'mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
            task.completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-dark-400 hover:border-brand-500 hover:bg-brand-500/10'
          )}
        >
          {task.completed && <Check size={12} className="text-white" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={clsx('font-medium text-sm leading-snug', task.completed ? 'line-through text-gray-500' : 'text-white')}>
              {task.title}
            </h3>
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {task.description && (
            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-dark-700 text-gray-400">
              {CATEGORY_EMOJI[task.category]} {task.category}
            </span>

            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', PRIORITY_COLOR[task.priority])}>
              <Flag size={10} className="inline mr-1" />
              {PRIORITY_LABELS[task.priority]}
            </span>

            {task.due_date && (
              <span className={clsx('text-xs flex items-center gap-1', isOverdue ? 'text-red-400' : 'text-gray-500')}>
                <Clock size={10} />
                {isOverdue ? 'Overdue' : formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
              </span>
            )}

            {task.reminders_sent > 0 && (
              <span className="text-xs text-amber-400/70">
                🔔 {task.reminders_sent} reminder{task.reminders_sent > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* AI probability bar */}
          {!task.completed && prob !== null && prob !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Brain size={10} /> Rem thinks you'll do this now
                </span>
                <span className={clsx('text-xs font-medium', prob > 0.6 ? 'text-emerald-400' : prob > 0.35 ? 'text-amber-400' : 'text-gray-500')}>
                  {Math.round(prob * 100)}%
                </span>
              </div>
              <div className="h-1 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all', prob > 0.6 ? 'bg-emerald-500' : prob > 0.35 ? 'bg-amber-500' : 'bg-dark-400')}
                  style={{ width: `${Math.round(prob * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
