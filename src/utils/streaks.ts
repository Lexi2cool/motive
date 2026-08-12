export function getStreakStatus(lastActiveDate: string, currentStreak: number): { streak: number; active: boolean } {
  const today = new Date().toISOString().split('T')[0]
  if (!lastActiveDate) {
    return currentStreak > 0 ? { streak: currentStreak, active: true } : { streak: 0, active: false }
  }

  if (lastActiveDate === today) {
    return { streak: currentStreak, active: true }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (lastActiveDate === yesterdayStr) {
    return { streak: currentStreak, active: false }
  }

  return { streak: 0, active: false }
}

export function updateStreak(lastActiveDate: string, currentStreak: number, longestStreak: number): { currentStreak: number; longestStreak: number; isNewDay: boolean } {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak = currentStreak
  let newLongest = longestStreak

  if (lastActiveDate !== today) {
    if (lastActiveDate === yesterdayStr) {
      newStreak += 1
    } else if (lastActiveDate) {
      newStreak = 1
    } else {
      newStreak = 1
    }

    if (newStreak > newLongest) {
      newLongest = newStreak
    }
  }

  return { currentStreak: newStreak, longestStreak: newLongest, isNewDay: lastActiveDate !== today }
}
