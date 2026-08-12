import { useState } from 'react'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

const typeIcons: Record<string, string> = {
  theme: '🎨',
  avatar: '👤',
  badge: '🏆',
  motivation: '💬',
  'power-up': '⚡',
  minigame: '🎮',
}

const typeLabels: Record<string, string> = {
  theme: 'Themes',
  avatar: 'Avatars',
  badge: 'Badges',
  motivation: 'Motivation',
  'power-up': 'Power-ups',
  minigame: 'Minigames',
}

export default function RewardsShop() {
  const { state, purchaseReward } = useApp()
  const [filter, setFilter] = useState<string>('all')
  const rewards = state.rewards
  const profile = state.profile

  const filtered = filter === 'all' ? rewards : rewards.filter(r => r.type === filter)

  if (!profile) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <ShoppingCart size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-purple-900">Rewards Shop</h2>
            <p className="text-sm text-purple-600 font-medium">Spend your hard-earned points</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-5 py-2.5 border-2 border-purple-200/60 shadow-lg shadow-purple-100/50">
          <p className="text-xs text-purple-500 font-medium">Your Balance</p>
          <p className="text-xl font-black text-purple-900">{profile.totalPoints} pts</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'theme', 'avatar', 'badge', 'motivation', 'power-up', 'minigame'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
              filter === type
                ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-200/50'
                : 'bg-white/80 text-purple-700 hover:bg-purple-50 border-2 border-purple-200/60 hover:border-purple-300'
            }`}
          >
            {typeLabels[type] || type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(reward => {
          const isOwned = !!reward.unlockedAt
          const canAfford = profile.totalPoints >= reward.cost
          return (
            <div
              key={reward.id}
              className={`relative bg-white/80 backdrop-blur-xl rounded-2xl p-5 border-2 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 hover:border-purple-300 ${
                isOwned ? 'border-emerald-300/60 bg-emerald-50/50' : 'border-purple-200/60'
              }`}
            >
              <div className="text-4xl mb-3">{typeIcons[reward.type]}</div>
              <h3 className="font-bold text-purple-900 mb-1">{reward.name}</h3>
              <p className="text-sm text-purple-600 mb-3 line-clamp-2">{reward.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-purple-700">{reward.cost} pts</span>
                {isOwned ? (
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                    Owned
                  </span>
                ) : (
                  <button
                    onClick={() => purchaseReward(reward.id!)}
                    disabled={!canAfford}
                    className={`flex items-center gap-1 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      canAfford
                        ? 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg shadow-purple-200/50'
                        : 'bg-purple-100 text-purple-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={14} />
                    Buy
                  </button>
                )}
              </div>
              {isOwned && (
                <div className="absolute top-3 right-3">
                  <Sparkles size={18} className="text-emerald-500" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
