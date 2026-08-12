import { useState } from 'react'
import { Trophy, Users, Plus, Trash2, Swords, Crown } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Friend, Challenge } from '../db/schema'

const houseColors: Record<string, string> = {
  nebula: 'from-violet-500 to-purple-600',
  eclipse: 'from-slate-600 to-slate-800',
  solstice: 'from-amber-500 to-orange-600',
  supernova: 'from-pink-500 to-rose-600',
}

const houseEmojis: Record<string, string> = {
  nebula: '🌟',
  eclipse: '🌑',
  solstice: '☀️',
  supernova: '💫',
}

interface FriendsLeaderboardProps {
  onClose: () => void
}

export default function FriendsLeaderboard({ onClose }: FriendsLeaderboardProps) {
  const { state, addFriend, removeFriend, addChallenge, completeChallenge } = useApp()
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'challenges'>('leaderboard')
  const [newFriendName, setNewFriendName] = useState('')
  const [newFriendHouse, setNewFriendHouse] = useState<Friend['house']>('nebula')
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', pointsReward: 50 })
  const [showAddChallenge, setShowAddChallenge] = useState(false)

  const handleAddFriend = () => {
    if (!newFriendName.trim()) return
    addFriend({
      username: newFriendName.trim(),
      house: newFriendHouse,
      avatar: { head: '😊', body: '👕', accessory: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      totalPoints: Math.floor(Math.random() * 500),
      level: Math.floor(Math.random() * 10) + 1,
      currentStreak: Math.floor(Math.random() * 14),
      lastActiveDate: new Date().toISOString().split('T')[0],
      addedAt: new Date().toISOString(),
    })
    setNewFriendName('')
    setShowAddFriend(false)
  }

  const handleAddChallenge = () => {
    if (!newChallenge.title.trim()) return
    addChallenge({
      title: newChallenge.title,
      description: newChallenge.description,
      pointsReward: newChallenge.pointsReward,
      createdBy: state.profile?.displayName || 'You',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    })
    setNewChallenge({ title: '', description: '', pointsReward: 50 })
    setShowAddChallenge(false)
  }

  const myRank = [...state.friends, { username: state.profile?.displayName || 'You', totalPoints: state.profile?.totalPoints || 0 }]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .findIndex(f => f.username === (state.profile?.displayName || 'You')) + 1

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-purple-900">Social</h3>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-1 mb-4 bg-purple-100/50 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'leaderboard' ? 'bg-white text-purple-900 shadow-sm' : 'text-purple-600 hover:text-purple-800'
            }`}
          >
            <Trophy size={16} className="inline mr-1" />
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'friends' ? 'bg-white text-purple-900 shadow-sm' : 'text-purple-600 hover:text-purple-800'
            }`}
          >
            <Users size={16} className="inline mr-1" />
            Friends
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'challenges' ? 'bg-white text-purple-900 shadow-sm' : 'text-purple-600 hover:text-purple-800'
            }`}
          >
            <Swords size={16} className="inline mr-1" />
            Challenges
          </button>
        </div>

        {activeTab === 'leaderboard' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl p-4 border-2 border-purple-200/60 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Crown size={20} className="text-amber-500" />
                <span className="text-sm font-bold text-purple-700">Your Rank</span>
              </div>
              <p className="text-3xl font-black text-purple-900">#{myRank || 'Unranked'}</p>
              <p className="text-xs text-purple-600">{state.profile?.totalPoints || 0} pts</p>
            </div>

            {[...state.friends, { username: state.profile?.displayName || 'You', totalPoints: state.profile?.totalPoints || 0 }]
              .sort((a, b) => b.totalPoints - a.totalPoints)
              .map((friend, idx) => (
                <div
                  key={friend.username + idx}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${
                    friend.username === (state.profile?.displayName || 'You')
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-white/80 border-purple-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                    idx === 0 ? 'bg-amber-100 text-amber-700' :
                    idx === 1 ? 'bg-slate-100 text-slate-700' :
                    idx === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-purple-900 text-sm">{friend.username}</p>
                    <p className="text-xs text-purple-500">{friend.totalPoints} pts</p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-3">
            {!showAddFriend ? (
              <button
                onClick={() => setShowAddFriend(true)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all font-bold text-sm"
              >
                <Plus size={16} className="inline mr-1" />
                Add Friend
              </button>
            ) : (
              <div className="bg-purple-50/80 rounded-2xl p-4 border-2 border-purple-200/60 space-y-3">
                <input
                  type="text"
                  value={newFriendName}
                  onChange={e => setNewFriendName(e.target.value)}
                  placeholder="Friend's username"
                  className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-2.5 text-sm text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200"
                />
                <select
                  value={newFriendHouse}
                  onChange={e => setNewFriendHouse(e.target.value as Friend['house'])}
                  className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-2.5 text-sm text-purple-900"
                >
                  <option value="nebula">🌟 Nebula</option>
                  <option value="eclipse">🌑 Eclipse</option>
                  <option value="solstice">☀️ Solstice</option>
                  <option value="supernova">💫 Supernova</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={handleAddFriend} className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-2 rounded-xl font-bold text-sm">
                    Add
                  </button>
                  <button onClick={() => setShowAddFriend(false)} className="px-4 py-2 text-purple-600 font-bold text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {state.friends.map(friend => (
              <div key={friend.id} className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border-2 border-purple-100">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${houseColors[friend.house]} flex items-center justify-center text-white text-lg`}>
                  {houseEmojis[friend.house]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-purple-900 text-sm truncate">{friend.username}</p>
                  <p className="text-xs text-purple-500">{friend.totalPoints} pts • {friend.level} lvl</p>
                </div>
                <button onClick={() => friend.id && removeFriend(friend.id)} className="text-purple-400 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-3">
            {!showAddChallenge ? (
              <button
                onClick={() => setShowAddChallenge(true)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all font-bold text-sm"
              >
                <Plus size={16} className="inline mr-1" />
                Create Challenge
              </button>
            ) : (
              <div className="bg-purple-50/80 rounded-2xl p-4 border-2 border-purple-200/60 space-y-3">
                <input
                  type="text"
                  value={newChallenge.title}
                  onChange={e => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Challenge title"
                  className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-2.5 text-sm text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200"
                />
                <textarea
                  value={newChallenge.description}
                  onChange={e => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-2.5 text-sm text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200 resize-none"
                  rows={2}
                />
                <input
                  type="number"
                  value={newChallenge.pointsReward}
                  onChange={e => setNewChallenge(prev => ({ ...prev, pointsReward: Number(e.target.value) }))}
                  placeholder="Points reward"
                  className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-2.5 text-sm text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddChallenge} className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-2 rounded-xl font-bold text-sm">
                    Create
                  </button>
                  <button onClick={() => setShowAddChallenge(false)} className="px-4 py-2 text-purple-600 font-bold text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {state.challenges.map(challenge => (
              <div key={challenge.id} className="p-4 bg-white/80 rounded-2xl border-2 border-purple-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-purple-900 text-sm">{challenge.title}</h4>
                    <p className="text-xs text-purple-600 mt-1">{challenge.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
                        {challenge.pointsReward} pts
                      </span>
                      <span className="text-xs text-purple-400">by {challenge.createdBy}</span>
                    </div>
                  </div>
                  {!challenge.completed && (
                    <button
                      onClick={() => challenge.id && completeChallenge(challenge.id)}
                      className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-xl font-bold transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  {challenge.completed && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold">
                      Done!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
