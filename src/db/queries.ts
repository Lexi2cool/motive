import { db, type Task, type Session, type Profile, type Reward, type Setting, type Friend, type Challenge, type Tournament, type HouseEvent, type Gift, type UserReward } from './schema'

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

export const userRewards = {
  getAll: () => db.userRewards.toArray(),
  getByUser: (userId: string) => db.userRewards.where('userId').equals(userId).toArray(),
  add: (reward: Omit<UserReward, 'id'>) => db.userRewards.add({ ...reward, id: crypto.randomUUID() }),
  hasUnlocked: (rewardId: string, userId: string) => db.userRewards.where('rewardId').equals(rewardId).and(r => r.userId === userId).toArray(),
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

export const tournaments = {
  getAll: () => db.tournaments.orderBy('createdAt').reverse().toArray(),
  getActive: () => {
    const now = new Date().toISOString()
    return db.tournaments.where('completed').equals(0).and(t => t.expiresAt > now).toArray()
  },
  add: (tournament: Omit<Tournament, 'id'>) => db.tournaments.add({ ...tournament, id: crypto.randomUUID() }),
  update: (id: string, changes: Partial<Tournament>) => db.tournaments.update(id, changes),
  join: (id: string, userId: string) => db.tournaments.update(id, { participants: [...(await db.tournaments.get(id)!).participants, userId] }),
}

export const houseEvents = {
  getAll: () => db.houseEvents.orderBy('createdAt').reverse().toArray(),
  getActive: () => {
    const now = new Date().toISOString()
    return db.houseEvents.where('completed').equals(0).and(e => e.expiresAt > now).toArray()
  },
  add: (event: Omit<HouseEvent, 'id'>) => db.houseEvents.add({ ...event, id: crypto.randomUUID() }),
  update: (id: string, changes: Partial<HouseEvent>) => db.houseEvents.update(id, changes),
  join: (id: string, userId: string) => db.houseEvents.update(id, { participants: [...(await db.houseEvents.get(id)!).participants, userId] }),
}

export const gifts = {
  getAll: () => db.gifts.orderBy('sentAt').reverse().toArray(),
  add: (gift: Omit<Gift, 'id'>) => db.gifts.add({ ...gift, id: crypto.randomUUID() }),
  getReceived: (userId: string) => db.gifts.where('toUserId').equals(userId).toArray(),
  getSent: (userId: string) => db.gifts.where('fromUserId').equals(userId).toArray(),
}
