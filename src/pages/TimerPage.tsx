import FocusTimer from '../components/FocusTimer'

interface TimerPageProps {
  onOpenMinigames?: () => void
}

export default function TimerPage({ onOpenMinigames }: TimerPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black gradient-text">Focus Timer</h2>
          <p className="text-sm text-purple-600 font-medium mt-1">Stay focused and earn points for every minute</p>
        </div>
        {onOpenMinigames && (
          <button
            onClick={onOpenMinigames}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2.5 rounded-2xl font-bold shadow-lg shadow-pink-200/50 transition-all"
          >
            🎮 Minigames
          </button>
        )}
      </div>
      <FocusTimer onOpenMinigames={onOpenMinigames} />
    </div>
  )
}
