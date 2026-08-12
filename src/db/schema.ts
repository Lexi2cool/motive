import Dexie, { type Table } from 'dexie'

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id?: string
  title: string
  description?: string
  category: 'Study' | 'Assignment' | 'Exam' | 'Personal'
  difficulty: 1 | 2 | 3
  dueDate?: string
  completed: boolean
  completedAt?: string
  pointsReward: number
  createdAt: string
  subtasks: SubTask[]
}

export interface Session {
  id?: string
  taskId?: string
  durationMinutes: number
  completed: boolean
  pointsEarned: number
  startedAt: string
  endedAt: string
}

export interface Profile {
  id?: string
  displayName: string
  totalPoints: number
  level: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  xpToNextLevel: number
  house: 'nebula' | 'eclipse' | 'solstice' | 'supernova'
  avatar: {
    head: string
    body: string
    accessory: string
    background: string
  }
  hasCompletedOnboarding: boolean
}

export interface Badge {
  id?: string
  name: string
  description: string
  icon: string
  criteria: string
  unlockedAt?: string
}

export interface Reward {
  id?: string
  name: string
  description: string
  cost: number
  type: 'theme' | 'avatar' | 'badge' | 'motivation' | 'power-up' | 'minigame'
  unlockedAt?: string
}

export interface Setting {
  id?: string
  focusDuration: number
  breakDuration: number
  theme: 'light' | 'dark' | 'system'
  blockedSites: string[]
  dailySpinsRemaining: number
  lastSpinDate: string
}

export interface Friend {
  id?: string
  username: string
  house: 'nebula' | 'eclipse' | 'solstice' | 'supernova'
  avatar: {
    head: string
    body: string
    accessory: string
    background: string
  }
  totalPoints: number
  level: number
  currentStreak: number
  lastActiveDate: string
  addedAt: string
}

export interface Challenge {
  id?: string
  title: string
  description: string
  pointsReward: number
  createdBy: string
  createdAt: string
  expiresAt: string
  completed: boolean
}

class FocusArenaDB extends Dexie {
  tasks!: Table<Task>
  sessions!: Table<Session>
  profile!: Table<Profile>
  badges!: Table<Badge>
  rewards!: Table<Reward>
  settings!: Table<Setting>
  friends!: Table<Friend>
  challenges!: Table<Challenge>

  constructor() {
    super('focus-arena-db')
    this.version(3).stores({
      tasks: 'id, category, difficulty, completed, dueDate, createdAt',
      sessions: 'id, taskId, startedAt, endedAt',
      profile: 'id',
      badges: 'id, name',
      rewards: 'id, type, cost',
      settings: 'id',
      friends: 'id, username, house, totalPoints',
      challenges: 'id, createdBy, createdAt, completed',
    })
  }
}

export const db = new FocusArenaDB()

export async function seedDatabase() {
  const profileCount = await db.profile.count()
  if (profileCount > 0) return

  await db.profile.add({
    displayName: 'Student',
    totalPoints: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    xpToNextLevel: 100,
    house: 'nebula',
    avatar: {
      head: '😊',
      body: '👕',
      accessory: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    hasCompletedOnboarding: false,
  })

  const defaultBadges: Omit<Badge, 'id'>[] = [
    { name: 'First Steps', description: 'Complete your first task', icon: '🎯', criteria: 'complete_first_task' },
    { name: 'Focus Novice', description: 'Complete 5 focus sessions', icon: '🔥', criteria: 'complete_5_sessions' },
    { name: 'Streak Master', description: 'Maintain a 7-day streak', icon: '⭐', criteria: 'streak_7_days' },
    { name: 'Task Crusher', description: 'Complete 25 tasks', icon: '💪', criteria: 'complete_25_tasks' },
    { name: 'Deep Focus', description: 'Complete a 90-minute focus session', icon: '🧠', criteria: 'complete_90min_session' },
    { name: 'Social Butterfly', description: 'Add your first friend', icon: '🦋', criteria: 'add_first_friend' },
    { name: 'Challenge Accepted', description: 'Complete your first challenge', icon: '⚔️', criteria: 'complete_first_challenge' },
    { name: 'Spin Master', description: 'Use the daily spin 7 times', icon: '🎰', criteria: 'spin_7_times' },
  ]
  await db.badges.bulkAdd(defaultBadges)

  const defaultRewards: Omit<Reward, 'id'>[] = [
    { name: 'Ocean Blue', description: 'A calm blue theme', cost: 50, type: 'theme' },
    { name: 'Forest Green', description: 'A nature-inspired theme', cost: 75, type: 'theme' },
    { name: 'Midnight Purple', description: 'A dark purple theme', cost: 100, type: 'theme' },
    { name: 'Avatar Frame: Gold', description: 'Golden frame for your avatar', cost: 30, type: 'avatar' },
    { name: 'Avatar Frame: Neon', description: 'Neon glow frame', cost: 50, type: 'avatar' },
    { name: 'Morning Motivation', description: 'Start your day inspired', cost: 20, type: 'motivation' },
    { name: 'Focus Boost', description: '2x points for 1 hour', cost: 150, type: 'power-up' },
    { name: 'Streak Shield', description: 'Protect your streak for 1 day', cost: 200, type: 'power-up' },
    { name: 'Memory Match', description: 'Classic memory card game', cost: 100, type: 'minigame' },
    { name: 'Quick Math', description: 'Speed math challenge', cost: 80, type: 'minigame' },
    { name: 'Word Scramble', description: 'Unscramble words before time runs out', cost: 120, type: 'minigame' },
  ]
  await db.rewards.bulkAdd(defaultRewards)

  await db.settings.add({
    focusDuration: 25,
    breakDuration: 5,
    theme: 'system',
    blockedSites: [],
    dailySpinsRemaining: 1,
    lastSpinDate: new Date().toISOString().split('T')[0],
  })
}
