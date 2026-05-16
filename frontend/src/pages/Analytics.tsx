import { useEffect, useState } from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid,
} from 'recharts'
import { getInsights } from '../api'
import type { PatternInsight, User } from '../types'
import { CATEGORY_EMOJI } from '../types'
import { Brain, TrendingUp, Clock, Award } from 'lucide-react'

interface Props { user: User }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TOOLTIP_STYLE = { backgroundColor: '#1e1e35', border: '1px solid #2e2e50', borderRadius: 12, color: '#fff' }

export default function Analytics({ user }: Props) {
  const [insight, setInsight] = useState<PatternInsight | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInsights().then(r => { setInsight(r.data); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!insight) return null

  const weeklyData = DAYS.map((day, i) => ({ day, completions: insight.weekly_pattern[i] }))
  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    activity: insight.hourly_pattern[h],
  })).filter((_, i) => i % 2 === 0) // Show every 2 hours for readability

  const categoryData = Object.entries(insight.category_stats).map(([cat, count]) => ({
    category: `${CATEGORY_EMOJI[cat] || '📌'} ${cat}`,
    count,
  }))

  const completionPct = Math.round(insight.completion_rate * 100)
  const totalTrainingPoints = insight.total_tasks

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pattern Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">
          Rem has analyzed your behavior across {totalTrainingPoints} tasks to build your personal model.
        </p>
      </div>

      {/* Neural network status */}
      <div className="bg-gradient-to-r from-brand-500/10 to-purple-600/10 border border-brand-500/20 rounded-2xl p-6 mb-6 flex items-start gap-5">
        <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center text-3xl">🧠</div>
        <div className="flex-1">
          <h2 className="text-white font-semibold">Your Personal Neural Network</h2>
          <p className="text-gray-400 text-sm mt-1">
            A dedicated neural network (13 inputs → 32 → 16 → 1) has been trained exclusively on your behavior.
            It learns when you're most likely to complete tasks, which types you tend to forget, and the optimal
            time to send you reminders — all personalized just for you.
          </p>
          <div className="flex gap-6 mt-3">
            <div className="text-center">
              <div className="text-xl font-bold text-brand-400">{totalTrainingPoints}</div>
              <div className="text-xs text-gray-500">Training samples</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-400">{completionPct}%</div>
              <div className="text-xs text-gray-500">Completion rate</div>
            </div>
            {insight.most_productive_hour !== null && (
              <div className="text-center">
                <div className="text-xl font-bold text-amber-400">{insight.most_productive_hour}:00</div>
                <div className="text-xs text-gray-500">Peak hour</div>
              </div>
            )}
            {insight.best_category && (
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{CATEGORY_EMOJI[insight.best_category]}</div>
                <div className="text-xs text-gray-500">{insight.best_category}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Weekly pattern */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-400" />
            Weekly Completion Pattern
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#2e2e50' }} />
              <Bar dataKey="completions" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly pattern */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Clock size={16} className="text-amber-400" />
            Hourly Activity
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={hourlyData}>
              <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e50" />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="activity" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Category breakdown */}
        {categoryData.length > 0 && (
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Award size={16} className="text-emerald-400" />
              Tasks by Category
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Insights card */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Brain size={16} className="text-brand-400" />
            Rem's Insights for {user.username}
          </h3>
          <div className="space-y-3">
            {insight.most_productive_hour !== null && (
              <div className="bg-dark-700 rounded-xl p-3 flex items-start gap-3">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-white text-sm font-medium">Peak Productivity Hour</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    You complete the most tasks around <span className="text-brand-400">{insight.most_productive_hour}:00</span>.
                    I'll schedule your most important reminders then.
                  </p>
                </div>
              </div>
            )}

            {insight.best_category && (
              <div className="bg-dark-700 rounded-xl p-3 flex items-start gap-3">
                <span className="text-lg">🏆</span>
                <div>
                  <p className="text-white text-sm font-medium">Strongest Category</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    You're most consistent with <span className="text-emerald-400">{insight.best_category}</span> tasks.
                    Keep it up!
                  </p>
                </div>
              </div>
            )}

            <div className="bg-dark-700 rounded-xl p-3 flex items-start gap-3">
              <span className="text-lg">{completionPct >= 70 ? '🔥' : completionPct >= 40 ? '💪' : '🌱'}</span>
              <div>
                <p className="text-white text-sm font-medium">Overall Completion Rate</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {completionPct >= 70
                    ? `${completionPct}% — You're crushing it! Rem is proud of you.`
                    : completionPct >= 40
                    ? `${completionPct}% — Solid progress! Let's push to 70%+ together.`
                    : `${completionPct}% — Still growing! Rem will help you build better habits.`}
                </p>
              </div>
            </div>

            {totalTrainingPoints < 10 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-3">
                <span className="text-lg">🌱</span>
                <div>
                  <p className="text-amber-400 text-sm font-medium">Training in Progress</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Rem needs more data to fully personalize your model.
                    Add and complete {10 - totalTrainingPoints} more tasks!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
