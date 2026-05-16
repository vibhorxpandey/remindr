export interface User {
  id: number
  email: string
  username: string
  avg_completion_rate: number
  total_tasks: number
  completed_tasks: number
  most_productive_hour: number | null
  created_at: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  category: string
  priority: number
  due_date: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
  reminders_sent: number
  predicted_completion_prob: number | null
  snoozed_until: string | null
}

export interface Reminder {
  id: number
  task_id: number
  message: string
  sent_at: string
  acknowledged: boolean
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface PatternInsight {
  most_productive_hour: number | null
  best_category: string | null
  completion_rate: number
  total_tasks: number
  completed_tasks: number
  weekly_pattern: number[]
  hourly_pattern: number[]
  category_stats: Record<string, number>
}

export const CATEGORIES = ['work', 'personal', 'health', 'finance', 'social', 'other'] as const
export type Category = typeof CATEGORIES[number]

export const PRIORITY_LABELS: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High' }
export const CATEGORY_EMOJI: Record<string, string> = {
  work: '💼', personal: '🏠', health: '💪', finance: '💰', social: '👥', other: '📌',
}
export const PRIORITY_COLOR: Record<number, string> = {
  1: 'text-emerald-400 bg-emerald-400/10',
  2: 'text-amber-400 bg-amber-400/10',
  3: 'text-red-400 bg-red-400/10',
}
