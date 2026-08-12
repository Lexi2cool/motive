import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { tasks as taskQueries, sessions as sessionQueries, profile as profileQueries, badges as badgeQueries, rewards as rewardQueries, userRewards as userRewardQueries, settings as settingsQueries, friends as friendQueries, challenges as challengeQueries, tournaments as tournamentQueries, houseEvents as houseEventQueries, gifts as giftQueries } from '../db/queries'
import { calculatePoints, addPoints, calculateLevelPoints } from '../utils/points'
import { updateStreak } from '../utils/streaks'
import { seedDatabase } from '../db/schema'
import type { Task, Session, Profile, Badge, Reward, Setting, Friend, Challenge, Tournament, HouseEvent, Gift } from '../db/schema'

seedDatabase().catch(() => {})

interface AppState {
  tasks: Task[]
  sessions: Session[]
  profile: Profile | null
  badges: Badge[]
  rewards: Reward[]
  settings: Setting | null
  friends: Friend[]
  challenges: Challenge[]
  tournaments: Tournament[]
  houseEvents: HouseEvent[]
  gifts: Gift[]
  loading: boolean
  showOnboarding: boolean
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; changes: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_SESSIONS'; payload: Session[] }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'SET_PROFILE'; payload: Profile }
  | { type: 'SET_BADGES'; payload: Badge[] }
  | { type: 'SET_REWARDS'; payload: Reward[] }
  | { type: 'SET_SETTINGS'; payload: Setting }
  | { type: 'SET_FRIENDS'; payload: Friend[] }
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'DELETE_FRIEND'; payload: string }
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'ADD_CHALLENGE'; payload: Challenge }
  | { type: 'UPDATE_CHALLENGE'; payload: { id: string; changes: Partial<Challenge> } }
  | { type: 'DELETE_CHALLENGE'; payload: string }
  | { type: 'SET_TOURNAMENTS'; payload: Tournament[] }
  | { type: 'ADD_TOURNAMENT'; payload: Tournament }
  | { type: 'UPDATE_TOURNAMENT'; payload: { id: string; changes: Partial<Tournament> } }
  | { type: 'SET_HOUSE_EVENTS'; payload: HouseEvent[] }
  | { type: 'ADD_HOUSE_EVENT'; payload: HouseEvent }
  | { type: 'UPDATE_HOUSE_EVENT'; payload: { id: string; changes: Partial<HouseEvent> } }
  | { type: 'SET_GIFTS'; payload: Gift[] }
  | { type: 'ADD_GIFT'; payload: Gift }
  | { type: 'COMPLETE_TASK'; payload: { task: Task; durationMinutes?: number } }
  | { type: 'COMPLETE_SESSION'; payload: Session }
  | { type: 'SHOW_ONBOARDING'; payload: boolean }

const initialState: AppState = {
  tasks: [],
  sessions: [],
  profile: null,
  badges: [],
  rewards: [],
  settings: null,
  friends: [],
  challenges: [],
  tournaments: [],
  houseEvents: [],
  gifts: [],
  loading: true,
  showOnboarding: false,
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] }
    case 'UPDATE_TASK': {
      const updated = state.tasks.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload.changes } : t
      )
      return { ...state, tasks: updated }
    }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload }
    case 'ADD_SESSION':
      return { ...state, sessions: [action.payload, ...state.sessions] }
    case 'SET_PROFILE':
      return { ...state, profile: action.payload }
    case 'SET_BADGES':
      return { ...state, badges: action.payload }
    case 'SET_REWARDS':
      return { ...state, rewards: action.payload }
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload }
    case 'SET_FRIENDS':
      return { ...state, friends: action.payload }
    case 'ADD_FRIEND':
      return { ...state, friends: [action.payload, ...state.friends] }
    case 'DELETE_FRIEND':
      return { ...state, friends: state.friends.filter(f => f.id !== action.payload) }
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload }
    case 'ADD_CHALLENGE':
      return { ...state, challenges: [action.payload, ...state.challenges] }
    case 'UPDATE_CHALLENGE': {
      const updated = state.challenges.map(c =>
        c.id === action.payload.id ? { ...c, ...action.payload.changes } : c
      )
      return { ...state, challenges: updated }
    }
    case 'DELETE_CHALLENGE':
      return { ...state, challenges: state.challenges.filter(c => c.id !== action.payload) }
    case 'SET_TOURNAMENTS':
      return { ...state, tournaments: action.payload }
    case 'ADD_TOURNAMENT':
      return { ...state, tournaments: [action.payload, ...state.tournaments] }
    case 'UPDATE_TOURNAMENT': {
      const updated = state.tournaments.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload.changes } : t
      )
      return { ...state, tournaments: updated }
    }
    case 'SET_HOUSE_EVENTS':
      return { ...state, houseEvents: action.payload }
    case 'ADD_HOUSE_EVENT':
      return { ...state, houseEvents: [action.payload, ...state.houseEvents] }
    case 'UPDATE_HOUSE_EVENT': {
      const updated = state.houseEvents.map(e =>
        e.id === action.payload.id ? { ...e, ...action.payload.changes } : e
      )
      return { ...state, houseEvents: updated }
    }
    case 'SET_GIFTS':
      return { ...state, gifts: action.payload }
    case 'ADD_GIFT':
      return { ...state, gifts: [action.payload, ...state.gifts] }
    case 'COMPLETE_TASK': {
      const { task, durationMinutes } = action.payload
      const points = calculatePoints(task.difficulty) + (durationMinutes ? Math.floor(durationMinutes / 5) * 2 : 0)
      const streakResult = updateStreak(
        state.profile?.lastActiveDate || '',
        state.profile?.currentStreak || 0,
        state.profile?.longestStreak || 0
      )
      const xpResult = addPoints(state.profile?.totalPoints || 0, points)
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === task.id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t),
        profile: state.profile ? {
          ...state.profile,
          totalPoints: xpResult.newXP,
          level: state.profile.level + xpResult.levelsGained,
          currentStreak: streakResult.currentStreak,
          longestStreak: streakResult.longestStreak,
          lastActiveDate: new Date().toISOString().split('T')[0],
          xpToNextLevel: calculateLevelPoints(state.profile.level + xpResult.levelsGained),
        } : state.profile,
      }
    }
    case 'COMPLETE_SESSION': {
      const session = action.payload
      const points = session.pointsEarned
      const streakResult = updateStreak(
        state.profile?.lastActiveDate || '',
        state.profile?.currentStreak || 0,
        state.profile?.longestStreak || 0
      )
      const xpResult = addPoints(state.profile?.totalPoints || 0, points)
      return {
        ...state,
        sessions: [session, ...state.sessions],
        profile: state.profile ? {
          ...state.profile,
          totalPoints: xpResult.newXP,
          level: state.profile.level + xpResult.levelsGained,
          currentStreak: streakResult.currentStreak,
          longestStreak: streakResult.longestStreak,
          lastActiveDate: new Date().toISOString().split('T')[0],
          xpToNextLevel: calculateLevelPoints(state.profile.level + xpResult.levelsGained),
        } : state.profile,
      }
    }
    case 'SHOW_ONBOARDING':
      return { ...state, showOnboarding: action.payload }
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  addTask: (task: Omit<Task, 'id'>) => Promise<void>
  updateTask: (id: string, changes: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  completeTask: (task: Task, durationMinutes?: number) => Promise<void>
  addSession: (session: Omit<Session, 'id'>) => Promise<void>
  completeSession: (session: Session) => Promise<void>
  updateSettings: (changes: Partial<Setting>) => Promise<void>
  updateProfile: (changes: Partial<Profile>) => Promise<void>
  purchaseReward: (rewardId: string) => Promise<boolean>
  addFriend: (friend: Omit<Friend, 'id'>) => Promise<void>
  removeFriend: (id: string) => Promise<void>
  addChallenge: (challenge: Omit<Challenge, 'id'>) => Promise<void>
  completeChallenge: (id: string) => Promise<void>
  createTournament: (tournament: Omit<Tournament, 'id'>) => Promise<void>
  joinTournament: (id: string) => Promise<boolean>
  createHouseEvent: (event: Omit<HouseEvent, 'id'>) => Promise<void>
  joinHouseEvent: (id: string) => Promise<boolean>
  sendGift: (gift: Omit<Gift, 'id'>) => Promise<boolean>
  openMysteryBox: (rewardId: string) => Promise<{ points: number; reward?: Reward }>
  activatePowerUp: (type: string) => Promise<boolean>
  useStreakShield: () => Promise<boolean>
  unlockMinigame: (rewardId: string) => Promise<boolean>
  refreshData: () => Promise<void>
  finishOnboarding: (house: Profile['house'], displayName: string) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const refreshData = async () => {
    const [tasks, sessions, profile, badges, rewards, settings, friends, challenges, tournaments, houseEvents, gifts] = await Promise.all([
      taskQueries.getAll(),
      sessionQueries.getAll(),
      profileQueries.get(),
      badgeQueries.getAll(),
      rewardQueries.getAll(),
      settingsQueries.get(),
      friendQueries.getAll(),
      challengeQueries.getAll(),
      tournamentQueries.getAll(),
      houseEventQueries.getAll(),
      giftQueries.getAll(),
    ])
    dispatch({ type: 'SET_TASKS', payload: tasks })
    dispatch({ type: 'SET_SESSIONS', payload: sessions })
    if (profile) {
      dispatch({ type: 'SET_PROFILE', payload: profile })
      if (!profile.hasCompletedOnboarding) {
        dispatch({ type: 'SHOW_ONBOARDING', payload: true })
      }
    }
    dispatch({ type: 'SET_BADGES', payload: badges })
    dispatch({ type: 'SET_REWARDS', payload: rewards })
    if (settings) dispatch({ type: 'SET_SETTINGS', payload: settings })
    dispatch({ type: 'SET_FRIENDS', payload: friends })
    dispatch({ type: 'SET_CHALLENGES', payload: challenges })
    dispatch({ type: 'SET_TOURNAMENTS', payload: tournaments })
    dispatch({ type: 'SET_HOUSE_EVENTS', payload: houseEvents })
    dispatch({ type: 'SET_GIFTS', payload: gifts })
    dispatch({ type: 'SET_LOADING', payload: false })
  }

  const addTask = async (task: Omit<Task, 'id'>) => {
    await taskQueries.add(task)
    dispatch({ type: 'ADD_TASK', payload: { ...task, id: crypto.randomUUID() } as Task })
  }

  const updateTask = async (id: string, changes: Partial<Task>) => {
    await taskQueries.update(id, changes)
    dispatch({ type: 'UPDATE_TASK', payload: { id, changes } })
  }

  const deleteTask = async (id: string) => {
    await taskQueries.delete(id)
    dispatch({ type: 'DELETE_TASK', payload: id })
  }

  const completeTask = async (task: Task, durationMinutes?: number) => {
    await updateTask(task.id!, { completed: true, completedAt: new Date().toISOString() })
    dispatch({ type: 'COMPLETE_TASK', payload: { task, durationMinutes } })
    const updated = await taskQueries.getById(task.id!)
    if (updated) dispatch({ type: 'UPDATE_TASK', payload: { id: task.id!, changes: updated } })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
  }

  const addSession = async (session: Omit<Session, 'id'>) => {
    await sessionQueries.add(session)
  }

  const completeSession = async (session: Session) => {
    await addSession(session)
    dispatch({ type: 'COMPLETE_SESSION', payload: session })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
  }

  const updateSettings = async (changes: Partial<Setting>) => {
    await settingsQueries.update(changes)
    const settings = await settingsQueries.get()
    if (settings) dispatch({ type: 'SET_SETTINGS', payload: settings })
  }

  const updateProfile = async (changes: Partial<Profile>) => {
    await profileQueries.update(changes)
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
  }

  const purchaseReward = async (rewardId: string): Promise<boolean> => {
    const reward = state.rewards.find(r => r.id === rewardId)
    if (!reward || !state.profile) return false
    if (state.profile.totalPoints < reward.cost) return false

    const xpResult = addPoints(state.profile.totalPoints, -reward.cost)
    await profileQueries.update({
      totalPoints: xpResult.newXP,
      xpToNextLevel: calculateLevelPoints(state.profile.level),
    })

    if (reward.type === 'streak-shield') {
      await profileQueries.update({ streakShields: (state.profile.streakShields || 0) + 1 })
    } else if (reward.type === 'power-up') {
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1)
      await profileQueries.update({
        activePowerUps: [...(state.profile.activePowerUps || []), { type: reward.name, expiresAt: expiresAt.toISOString() }],
      })
    } else if (reward.type === 'minigame') {
      await profileQueries.update({
        unlockedMinigames: [...(state.profile.unlockedMinigames || []), rewardId],
      })
    } else if (reward.type === 'mystery-box') {
      const prize = openMysteryBox()
      if (prize.points > 0) {
        const prizeXP = addPoints(state.profile.totalPoints, prize.points)
        await profileQueries.update({ totalPoints: prizeXP.newXP })
      }
      if (prize.reward) {
        await userRewardQueries.add({ rewardId: prize.reward.id!, userId: 'self', unlockedAt: new Date().toISOString() })
      }
    } else if (reward.type === 'tournament-entry') {
    } else if (reward.type === 'house-event') {
    } else if (reward.type === 'gift') {
    } else {
      await rewardQueries.purchase(rewardId)
    }

    dispatch({
      type: 'SET_REWARDS',
      payload: state.rewards.map(r => r.id === rewardId ? { ...r, unlockedAt: new Date().toISOString() } : r),
    })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
    return true
  }

  const openMysteryBox = async (): Promise<{ points: number; reward?: Reward }> => {
    const roll = Math.random()
    if (roll < 0.15) {
      return { points: -50, reward: undefined }
    } else if (roll < 0.35) {
      return { points: 0, reward: undefined }
    } else if (roll < 0.60) {
      return { points: 25 }
    } else if (roll < 0.80) {
      return { points: 50 }
    } else if (roll < 0.95) {
      return { points: 100 }
    } else {
      const jackpots = state.rewards.filter(r => r.type === 'theme' || r.type === 'avatar')
      const reward = jackpots[Math.floor(Math.random() * jackpots.length)]
      return { points: 0, reward: reward || undefined }
    }
  }

  const activatePowerUp = async (type: string): Promise<boolean> => {
    if (!state.profile) return false
    const now = new Date().toISOString()
    const activePowerUps = state.profile.activePowerUps || []
    const existing = activePowerUps.find(p => p.type === type)
    if (existing && new Date(existing.expiresAt) > new Date()) return false

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)
    await profileQueries.update({
      activePowerUps: [...activePowerUps.filter(p => p.type !== type), { type, expiresAt: expiresAt.toISOString() }],
    })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
    return true
  }

  const useStreakShield = async (): Promise<boolean> => {
    if (!state.profile || state.profile.streakShields === 0) return false
    await profileQueries.update({ streakShields: state.profile.streakShields - 1 })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
    return true
  }

  const unlockMinigame = async (rewardId: string): Promise<boolean> => {
    if (!state.profile) return false
    const existing = state.profile.unlockedMinigames || []
    if (existing.includes(rewardId)) return true
    await profileQueries.update({ unlockedMinigames: [...existing, rewardId] })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
    return true
  }

  const addFriend = async (friend: Omit<Friend, 'id'>) => {
    await friendQueries.add(friend)
    dispatch({ type: 'ADD_FRIEND', payload: { ...friend, id: crypto.randomUUID() } as Friend })
  }

  const removeFriend = async (id: string) => {
    await friendQueries.delete(id)
    dispatch({ type: 'DELETE_FRIEND', payload: id })
  }

  const addChallenge = async (challenge: Omit<Challenge, 'id'>) => {
    await challengeQueries.add(challenge)
    dispatch({ type: 'ADD_CHALLENGE', payload: { ...challenge, id: crypto.randomUUID() } as Challenge })
  }

  const completeChallenge = async (id: string) => {
    await challengeQueries.update(id, { completed: true })
    dispatch({ type: 'UPDATE_CHALLENGE', payload: { id, changes: { completed: true } } })
    const challenge = state.challenges.find(c => c.id === id)
    if (challenge && state.profile) {
      const xpResult = addPoints(state.profile.totalPoints, challenge.pointsReward)
      await profileQueries.update({ totalPoints: xpResult.newXP })
      dispatch({ type: 'SET_PROFILE', payload: { ...state.profile, totalPoints: xpResult.newXP } })
    }
  }

  const createTournament = async (tournament: Omit<Tournament, 'id'>) => {
    await tournamentQueries.add(tournament)
    dispatch({ type: 'ADD_TOURNAMENT', payload: { ...tournament, id: crypto.randomUUID() } as Tournament })
  }

  const joinTournament = async (id: string): Promise<boolean> => {
    const tournament = state.tournaments.find(t => t.id === id)
    if (!tournament || !state.profile) return false
    if (tournament.participants.includes('self')) return false
    if (state.profile.totalPoints < tournament.entryFee) return false

    const xpResult = addPoints(state.profile.totalPoints, -tournament.entryFee)
    await profileQueries.update({ totalPoints: xpResult.newXP })
    await tournamentQueries.join(id, 'self')
    dispatch({ type: 'UPDATE_TOURNAMENT', payload: { id, changes: { participants: [...tournament.participants, 'self'] } } })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
    return true
  }

  const createHouseEvent = async (event: Omit<HouseEvent, 'id'>) => {
    await houseEventQueries.add(event)
    dispatch({ type: 'ADD_HOUSE_EVENT', payload: { ...event, id: crypto.randomUUID() } as HouseEvent })
  }

  const joinHouseEvent = async (id: string): Promise<boolean> => {
    const event = state.houseEvents.find(e => e.id === id)
    if (!event || !state.profile) return false
    if (event.participants.includes('self')) return false
    if (state.profile.totalPoints < event.cost) return false

    const xpResult = addPoints(state.profile.totalPoints, -event.cost)
    await profileQueries.update({ totalPoints: xpResult.newXP })
    await houseEventQueries.join(id, 'self')
    dispatch({ type: 'UPDATE_HOUSE_EVENT', payload: { id, changes: { participants: [...event.participants, 'self'] } } })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
    return true
  }

  const sendGift = async (gift: Omit<Gift, 'id'>): Promise<boolean> => {
    if (!state.profile) return false
    const reward = state.rewards.find(r => r.id === gift.rewardId)
    if (!reward) return false
    if (state.profile.totalPoints < reward.cost) return false

    const xpResult = addPoints(state.profile.totalPoints, -reward.cost)
    await profileQueries.update({ totalPoints: xpResult.newXP })
    await giftQueries.add({ ...gift, fromUserId: 'self', sentAt: new Date().toISOString() })
    dispatch({ type: 'ADD_GIFT', payload: { ...gift, id: crypto.randomUUID(), fromUserId: 'self', sentAt: new Date().toISOString() } as Gift })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
    return true
  }

  const finishOnboarding = async (house: Profile['house'], displayName: string) => {
    await profileQueries.update({ house, displayName, hasCompletedOnboarding: true })
    dispatch({ type: 'SHOW_ONBOARDING', payload: false })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
  }

  return (
    <AppContext.Provider value={{ state, dispatch, addTask, updateTask, deleteTask, completeTask, addSession, completeSession, updateSettings, updateProfile, purchaseReward, addFriend, removeFriend, addChallenge, completeChallenge, createTournament, joinTournament, createHouseEvent, joinHouseEvent, sendGift, openMysteryBox, activatePowerUp, useStreakShield, unlockMinigame, refreshData, finishOnboarding }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
