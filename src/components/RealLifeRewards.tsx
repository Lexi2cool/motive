import { useState } from 'react'
import { Gift, Clock, Users, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface RealLifeReward {
  id: string
  name: string
  description: string
  cost: number
  icon: string
  category: 'food' | 'experience' | 'gift' | 'special'
  image?: string
}

const categoryIcons: Record<string, string> = {
  food: '🍔',
  experience: '🎉',
  gift: '🎁',
  special: '⭐',
}

const categoryLabels: Record<string, string> = {
  food: 'Food & Dining',
  experience: 'Experiences',
  gift: 'Gifts',
  special: 'Special',
}

// Sample real-life rewards data
const realLifeRewards: RealLifeReward[] = [
  {
    id: 'dinner-choice',
    name: 'Choose Tonight\'s Dinner',
    description: 'Pick any restaurant for tonight\'s dinner',
    cost: 500,
    icon: '🍽️',
    category: 'food',
  },
  {
    id: 'movie-night',
    name: 'Movie Night',
    description: 'Pick a movie and get snacks of your choice',
    cost: 300,
    icon: '🎬',
    category: 'experience',
  },
  {
    id: 'dessert-treat',
    name: 'Dessert Treat',
    description: 'Get your favorite dessert or ice cream',
    cost: 200,
    icon: '🍰',
    category: 'food',
  },
  {
    id: 'gaming-session',
    name: 'Gaming Session',
    description: 'Extra 2 hours of gaming time',
    cost: 400,
    icon: '🎮',
    category: 'experience',
  },
  {
    id: 'late-bedtime',
    name: 'Later Bedtime',
    description: 'Stay up 1 hour later than usual',
    cost: 350,
    icon: '🌙',
    category: 'special',
  },
  {
    id: 'shopping-spree',
    name: 'Shopping Spree',
    description: 'Get items up to a certain amount',
    cost: 800,
    icon: '🛍️',
    category: 'gift',
  },
  {
    id: 'breakfast-choice',
    name: 'Choose Breakfast',
    description: 'Pick any breakfast meal you want',
    cost: 250,
    icon: '🥞',
    category: 'food',
  },
  {
    id: 'adventure-day',
    name: 'Adventure Day',
    description: 'Plan a fun outing or trip',
    cost: 1000,
    icon: '🎢',
    category: 'experience',
  },
  {
    id: 'device-time',
    name: 'Extra Device Time',
    description: 'Bonus 1 hour on phone/tablet',
    cost: 300,
    icon: '📱',
    category: 'special',
  },
  {
    id: 'skip-chore',
    name: 'Skip a Chore',
    description: 'Skip one household chore',
    cost: 150,
    icon: '✨',
    category: 'special',
  },
]

export default function RealLifeRewards() {
  const { state, purchaseReward } = useApp()
  const [filter, setFilter] = useState<string>('all')
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([])
  
  const profile = state.profile

  const filtered = filter === 'all' ? realLifeRewards : realLifeRewards.filter(r => r.category === filter)

  if (!profile) return null

  const handleRedeem = (reward: RealLifeReward) => {
    if (profile.totalPoints >= reward.cost) {
      // In a real app, this would update the backend
      setRedeemedRewards([...redeemedRewards, reward.id])
      // Optionally deduct points (you'd need to add this to your context)
      alert(`🎉 Redeemed: ${reward.name}!\n\nYour parents have been notified.`)
      setTimeout(() => {
        setRedeemedRewards(redeemedRewards.filter(id => id !== reward.id))
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl">
            <Gift size={24} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-amber-900">Real Life Rewards</h2>
            <p className="text-sm text-amber-600 font-medium">Redeem points for real experiences</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-5 py-2.5 border-2 border-amber-200/60 shadow-lg shadow-amber-100/50">
          <p className="text-xs text-amber-500 font-medium">Available Points</p>
          <p className="text-xl font-black text-amber-900">{profile.totalPoints} pts</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'food', 'experience', 'gift', 'special'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
              filter === type
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200/50'
                : 'bg-white/80 text-amber-700 hover:bg-amber-50 border-2 border-amber-200/60 hover:border-amber-300'
            }`}
          >
            {categoryLabels[type] || type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(reward => {
          const isRedeemed = redeemedRewards.includes(reward.id)
          const canAfford = profile.totalPoints >= reward.cost
          return (
            <div
              key={reward.id}
              className={`relative bg-white/80 backdrop-blur-xl rounded-2xl p-5 border-2 transition-all duration-300 hover:shadow-lg hover:shadow-amber-100/50 hover:border-amber-300 ${
                isRedeemed ? 'border-emerald-300/60 bg-emerald-50/50' : 'border-amber-200/60'
              }`}
            >
              <div className="text-5xl mb-3">{reward.icon}</div>
              <h3 className="font-bold text-amber-900 mb-1">{reward.name}</h3>
              <p className="text-sm text-amber-600 mb-3 line-clamp-2">{reward.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1">
                  <Zap size={16} className="text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">{reward.cost} pts</span>
                </div>
                {isRedeemed ? (
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                    ✓ Redeemed
                  </span>
                ) : (
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50'
                        : 'bg-amber-100 text-amber-400 cursor-not-allowed'
                    }`}
                  >
                    Redeem
                  </button>
                )}
              </div>

              {!canAfford && (
                <p className="text-xs text-red-500 font-medium mt-2">
                  Need {reward.cost - profile.totalPoints} more points
                </p>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-amber-600 font-medium">No rewards in this category</p>
        </div>
      )}
    </div>
  )
}
