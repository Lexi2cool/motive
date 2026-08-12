import { useApp } from '../context/AppContext'
import { calculatePoints } from '../utils/points'

export function usePoints() {
  const { state, completeTask, completeSession } = useApp()
  const profile = state.profile

  const getPointsForTask = (difficulty: 1 | 2 | 3) => calculatePoints(difficulty)
  const getPointsForSession = (minutes: number) => Math.floor(minutes / 5) * 2
  const getLevel = () => profile?.level || 1
  const getTotalPoints = () => profile?.totalPoints || 0
  const getXPToNextLevel = () => profile?.xpToNextLevel || 100
  const getLevelProgress = () => {
    if (!profile) return 0
    return (profile.totalPoints / profile.xpToNextLevel) * 100
  }

  return {
    getPointsForTask,
    getPointsForSession,
    getLevel,
    getTotalPoints,
    getXPToNextLevel,
    getLevelProgress,
    completeTask,
    completeSession,
  }
}
