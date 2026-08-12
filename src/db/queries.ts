import { db, type Task, type Session, type Profile, type Reward, type Setting, type Friend, type Challenge } from './schema'

export const tasks = {
  getAll: () => db.tasks.orderBy('createdAt').reverse().toArray(),
  getById: (id: string) => db.tasks.get(id),
  add: (task: Omit<Task, 'id'>) => db.tasks.add({ ...task, id: crypto.randomUUID() }),
  update: (id: string, changes: Partial<Task>) => db.tasks.update(id, changes),
  delete: (id: string) => db.tasks.delete(id),
  getPending: () => db.tasks.where('completed').equals(0).toArray(),
  getCompleted: () => db.tasks.where('completed').equals(1).toArray(),
  getByCategory: (category: Task['category']) => db.tasks.where('category').equals(category).toArray(),
}

export const sessions = {
  getAll: () => db.sessions.orderBy('startedAt').reverse().toArray(),
  getById: (id: string) => db.sessions.get(id),
  add: (session: Omit<Session, 'id'>) => db.sessions.add({ ...session, id: crypto.randomUUID() }),
  getRecent: (days: number = 7) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return db.sessions.where('startedAt').above(cutoff.toISOString()).reverse().sortBy('startedAt')
  },
  getCompleted: () => db.sessions.where('completed').equals(1).toArray(),
}

export const profile = {
  get: () => db.profile.get(1),
  update: (changes: Partial<Profile>) => db.profile.update(1, changes),
}

export const badges = {
  getAll: () => db.badges.toArray(),
  unlock: (id: string) => db.badges.update(id, { unlockedAt: new Date().toISOString() }),
}

export const rewards = {
  getAll: () => db.rewards.toArray(),
  getByType: (type: Reward['type']) => db.rewards.where('type').equals(type).toArray(),
  purchase: (id: string) => db.rewards.update(id, { unlockedAt: new Date().toISOString() }),
}

export const settings = {
  get: () => db.settings.get(1),
  update: (changes: Partial<Setting>) => db.settings.update(1, changes),
}

export const friends = {
  getAll: () => db.friends.orderBy('totalPoints').reverse().toArray(),
  add: (friend: Omit<Friend, 'id'>) => db.friends.add({ ...friend, id: crypto.randomUUID() }),
  delete: (id: string) => db.friends.delete(id),
  getTop: (limit: number = 10) => db.friends.orderBy('totalPoints').reverse().limit(limit).toArray(),
}

export const challenges = {
  getAll: () => db.challenges.orderBy('createdAt').reverse().toArray(),
  add: (challenge: Omit<Challenge, 'id'>) => db.challenges.add({ ...challenge, id: crypto.randomUUID() }),
  update: (id: string, changes: Partial<Challenge>) => db.challenges.update(id, changes),
  delete: (id: string) => db.challenges.delete(id),
  getActive: () => {
    const now = new Date().toISOString()
    return db.challenges.where('completed').equals(0).and(c => c.expiresAt > now).toArray()
  },
}
