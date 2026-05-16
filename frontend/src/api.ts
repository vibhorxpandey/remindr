import axios from 'axios'
import type { User, Task, ChatMessage, Reminder, PatternInsight } from './types'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const register = (email: string, username: string, password: string) =>
  api.post<{ access_token: string; user: User }>('/auth/register', { email, username, password })

export const login = (email: string, password: string) =>
  api.post<{ access_token: string; user: User }>('/auth/login', { email, password })

export const getMe = () => api.get<User>('/auth/me')

// Tasks
export const getTasks = (params?: { completed?: boolean; category?: string }) =>
  api.get<Task[]>('/tasks', { params })

export const createTask = (data: {
  title: string; description?: string; category?: string; priority?: number; due_date?: string
}) => api.post<Task>('/tasks', data)

export const updateTask = (id: number, data: Partial<Task>) =>
  api.patch<Task>(`/tasks/${id}`, data)

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`)

export const getInsights = () => api.get<PatternInsight>('/tasks/stats/insights')

// AI / Chat
export const getGreeting = () => api.get<{ message: string }>('/ai/greeting')

export const sendChat = (content: string) =>
  api.post<ChatMessage>('/ai/chat', { content })

export const getChatHistory = () => api.get<ChatMessage[]>('/ai/chat/history')

export const getDailySummary = () =>
  api.get<{ message: string; completed_today: number; pending: number; overdue: number }>('/ai/daily-summary')

export const getPendingReminders = () => api.get<Reminder[]>('/ai/reminders/pending')

export const acknowledgeReminder = (id: number) =>
  api.post(`/ai/reminders/${id}/ack`)

export default api
