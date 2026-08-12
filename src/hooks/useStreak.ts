import { useApp } from '../context/AppContext'
import { getStreakStatus } from '../utils/streaks'

export function useStreak() {
  const { state } = useApp()
  const profile = state.profile

  const getCurrentStreak = () => profile?.currentStreak || 0
  const getLongestStreak = () => profile?.longestStreak || 0
  const isStreakActive = () => {
    if (!profile) return false
    const status = getStreakStatus(profile.lastActiveDate, profile.currentStreak)
    return status.active
  }

  return {
    getCurrentStreak,
    getLongestStreak,
    isStreakActive,
  }
}
