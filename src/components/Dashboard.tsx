import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useApp } from '../context/AppContext'
import { getLevelTitle, getLevelProgress } from '../utils/level'

const houseInfo = {
  nebula: { emoji: '🌟', color: 'from-violet-500 to-purple-600' },
  eclipse: { emoji: '🌑', color: 'from-slate-600 to-slate-800' },
  solstice: { emoji: '☀️', color: 'from-amber-500 to-orange-600' },
  supernova: { emoji: '💫', color: 'from-pink-500 to-rose-600' },
}

export default function Dashboard() {
  const { state } = useApp()
  const { profile, sessions, tasks, friends } = state

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed).length
    const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0)
    const totalPoints = profile?.totalPoints || 0
    const currentStreak = profile?.currentStreak || 0

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toISOString().split('T')[0]
      const daySessions = sessions.filter(s => s.startedAt.startsWith(dateStr) && s.completed)
      const dayTasks = tasks.filter(t => t.completedAt?.startsWith(dateStr))
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        focusMinutes: daySessions.reduce((acc, s) => acc + s.durationMinutes, 0),
        tasksCompleted: dayTasks.length,
      }
    })

    const categoryBreakdown = ['Study', 'Assignment', 'Exam', 'Personal'].map(cat => ({
      name: cat,
      completed: tasks.filter(t => t.category === cat && t.completed).length,
      total: tasks.filter(t => t.category === cat).length,
    }))

    const leaderboard = [
      { name: profile?.displayName || 'You', points: profile?.totalPoints || 0, isYou: true },
      ...friends.map(f => ({ name: f.username, points: f.totalPoints, isYou: false })),
    ].sort((a, b) => b.points - a.points)

    return {
      completedTasks,
      totalFocusMinutes,
      totalPoints,
      currentStreak,
      last7Days,
      categoryBreakdown,
      leaderboard,
    }
  }, [sessions, tasks, profile, friends])

  if (!profile) return null

  const currentHouse = profile.house || 'nebula'
  const house = houseInfo[currentHouse]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-3xl p-5 border-2 border-purple-200/60">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${house.color} flex items-center justify-center text-2xl shadow-lg`}>
            {house.emoji}
          </div>
          <div>
            <p className="text-sm font-bold text-purple-700">Your House</p>
            <p className="text-xl font-black text-purple-900 capitalize">{currentHouse}</p>
            <p className="text-xs text-purple-600">Rank #{stats.leaderboard.findIndex(l => l.isYou) + 1} on the leaderboard</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
          <p className="text-sm text-purple-500 font-medium mb-1">Level</p>
          <p className="text-2xl font-black text-purple-900">{profile.level}</p>
          <p className="text-xs text-purple-600 font-medium">{getLevelTitle(profile.level)}</p>
          <div className="mt-2 h-2 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all"
              style={{ width: `${getLevelProgress(profile.totalPoints, profile.level)}%` }}
            />
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
          <p className="text-sm text-purple-500 font-medium mb-1">Tasks Done</p>
          <p className="text-2xl font-black text-purple-900">{stats.completedTasks}</p>
          <p className="text-xs text-purple-600 font-medium">of {tasks.length} total</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
          <p className="text-sm text-purple-500 font-medium mb-1">Focus Time</p>
          <p className="text-2xl font-black text-purple-900">{Math.floor(stats.totalFocusMinutes / 60)}h {stats.totalFocusMinutes % 60}m</p>
          <p className="text-xs text-purple-600 font-medium">{sessions.filter(s => s.completed).length} sessions</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
          <p className="text-sm text-purple-500 font-medium mb-1">Points</p>
          <p className="text-2xl font-black text-purple-900">{profile.totalPoints}</p>
          <p className="text-xs text-purple-600 font-medium">{profile.xpToNextLevel} to next level</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
        <h3 className="text-lg font-black text-purple-900 mb-4">🏆 Leaderboard</h3>
        <div className="space-y-2">
          {stats.leaderboard.slice(0, 5).map((entry, idx) => (
            <div
              key={entry.name + idx}
              className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${
                entry.isYou ? 'bg-purple-50 border-purple-300' : 'bg-white/80 border-purple-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                idx === 0 ? 'bg-amber-100 text-amber-700' :
                idx === 1 ? 'bg-slate-100 text-slate-700' :
                idx === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                #{idx + 1}
              </div>
              <div className="flex-1">
                <p className="font-bold text-purple-900 text-sm">{entry.name} {entry.isYou && '(You)'}</p>
              </div>
              <p className="text-sm font-bold text-purple-700">{entry.points} pts</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
        <h3 className="text-lg font-black text-purple-900 mb-4">Focus Activity (Last 7 Days)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.last7Days}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey="date" stroke="#a78bfa" fontSize={12} tickLine={false} />
              <YAxis stroke="#a78bfa" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px' }}
                labelStyle={{ color: '#581c87' }}
              />
              <Area type="monotone" dataKey="focusMinutes" stroke="#8b5cf6" fill="url(#focusGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
        <h3 className="text-lg font-black text-purple-900 mb-4">Tasks Completed (Last 7 Days)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey="date" stroke="#a78bfa" fontSize={12} tickLine={false} />
              <YAxis stroke="#a78bfa" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px' }}
                labelStyle={{ color: '#581c87' }}
              />
              <Bar dataKey="tasksCompleted" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
        <h3 className="text-lg font-black text-purple-900 mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {stats.categoryBreakdown.map(cat => {
            const pct = cat.total > 0 ? (cat.completed / cat.total) * 100 : 0
            return (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-purple-800 font-medium">{cat.name}</span>
                  <span className="text-purple-500">{cat.completed}/{cat.total}</span>
                </div>
                <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
