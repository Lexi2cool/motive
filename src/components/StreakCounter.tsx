import { Flame } from 'lucide-react'

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
  isActive: boolean
}

export default function StreakCounter({ currentStreak, longestStreak, isActive }: StreakCounterProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${isActive ? 'bg-orange-100' : 'bg-purple-100'}`}>
            <Flame size={28} className={isActive ? 'text-orange-500' : 'text-purple-300'} />
          </div>
          <div>
            <p className="text-2xl font-black text-purple-900">{currentStreak}</p>
            <p className="text-sm text-purple-600 font-medium">Day Streak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-purple-700">{longestStreak}</p>
          <p className="text-xs text-purple-500">Best: {longestStreak} days</p>
        </div>
      </div>
    </div>
  )
}
