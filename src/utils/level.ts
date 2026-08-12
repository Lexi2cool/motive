import { calculateLevelPoints } from './points'

export function getLevelTitle(level: number): string {
  if (level < 3) return 'Beginner'
  if (level < 6) return 'Intermediate'
  if (level < 10) return 'Advanced'
  if (level < 15) return 'Expert'
  if (level < 20) return 'Master'
  return 'Grandmaster'
}

export function getLevelProgress(xp: number, level: number): number {
  const needed = calculateLevelPoints(level)
  return Math.min((xp / needed) * 100, 100)
}

export function getXPNeededForNextLevel(level: number): number {
  return calculateLevelPoints(level)
}
