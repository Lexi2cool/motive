export const DIFFICULTY_POINTS: Record<1 | 2 | 3, number> = {
  1: 10,
  2: 25,
  3: 50,
}

export function calculatePoints(difficulty: 1 | 2 | 3): number {
  return DIFFICULTY_POINTS[difficulty]
}

export function calculateLevelPoints(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export function addPoints(currentXP: number, points: number): { newXP: number; leveledUp: boolean; levelsGained: number } {
  let xp = currentXP + points
  let level = 1
  let levelsGained = 0
  let threshold = 100

  while (xp >= threshold) {
    xp -= threshold
    level += 1
    levelsGained += 1
    threshold = Math.floor(100 * Math.pow(1.5, level - 1))
  }

  return { newXP: xp, leveledUp: levelsGained > 0, levelsGained }
}
