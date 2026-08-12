import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { tasks as taskQueries, sessions as sessionQueries, profile as profileQueries, badges as badgeQueries, rewards as rewardQueries, settings as settingsQueries, friends as friendQueries, challenges as challengeQueries } from '../db/queries'
import { calculatePoints, addPoints, calculateLevelPoints } from '../utils/points'
import { updateStreak } from '../utils/streaks'
import { seedDatabase } from '../db/schema'
import type { Task, Session, Profile, Badge, Reward, Setting, Friend, Challenge } from '../db/schema'

seedDatabase()

interface AppState {
  tasks: Task[]
  sessions: Session[]
  profile: Profile | null
  badges: Badge[]
  rewards: Reward[]
  settings: Setting | null
  friends: Friend[]
  challenges: Challenge[]
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
  purchaseReward: (rewardId: string) => Promise<boolean>
  addFriend: (friend: Omit<Friend, 'id'>) => Promise<void>
  removeFriend: (id: string) => Promise<void>
  addChallenge: (challenge: Omit<Challenge, 'id'>) => Promise<void>
  completeChallenge: (id: string) => Promise<void>
  refreshData: () => Promise<void>
  startOnboarding: () => void
  finishOnboarding: (house: Profile['house'], displayName: string) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const refreshData = async () => {
    const [tasks, sessions, profile, badges, rewards, settings, friends, challenges] = await Promise.all([
      taskQueries.getAll(),
      sessionQueries.getAll(),
      profileQueries.get(),
      badgeQueries.getAll(),
      rewardQueries.getAll(),
      settingsQueries.get(),
      friendQueries.getAll(),
      challengeQueries.getAll(),
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

  const purchaseReward = async (rewardId: string): Promise<boolean> => {
    const reward = state.rewards.find(r => r.id === rewardId)
    if (!reward || !state.profile) return false
    if (reward.unlockedAt) return false
    if (state.profile.totalPoints < reward.cost) return false

    await rewardQueries.purchase(rewardId)
    const xpResult = addPoints(state.profile.totalPoints, -reward.cost)
    await profileQueries.update({
      totalPoints: xpResult.newXP,
      xpToNextLevel: calculateLevelPoints(state.profile.level),
    })
    dispatch({
      type: 'SET_REWARDS',
      payload: state.rewards.map(r => r.id === rewardId ? { ...r, unlockedAt: new Date().toISOString() } : r),
    })
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

  const startOnboarding = () => {
    dispatch({ type: 'SHOW_ONBOARDING', payload: true })
  }

  const finishOnboarding = async (house: Profile['house'], displayName: string) => {
    await profileQueries.update({ house, displayName, hasCompletedOnboarding: true })
    dispatch({ type: 'SHOW_ONBOARDING', payload: false })
    const profile = await profileQueries.get()
    if (profile) dispatch({ type: 'SET_PROFILE', payload: profile })
  }

  return (
    <AppContext.Provider value={{ state, dispatch, addTask, updateTask, deleteTask, completeTask, addSession, completeSession, updateSettings, purchaseReward, addFriend, removeFriend, addChallenge, completeChallenge, refreshData, startOnboarding, finishOnboarding }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
