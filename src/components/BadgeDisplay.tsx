interface BadgeDisplayProps {
  badges: {
    id?: string
    name: string
    description: string
    icon: string
    unlockedAt?: string
  }[]
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  const unlocked = badges.filter(b => b.unlockedAt)
  const locked = badges.filter(b => !b.unlockedAt)

  return (
    <div>
      <h3 className="text-lg font-black text-purple-900 mb-4 text-center">🏆 Your Badges</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`relative p-3 rounded-2xl border-2 text-center transition-all ${
              badge.unlockedAt
                ? 'bg-gradient-to-br from-purple-100 to-violet-100 border-purple-300 shadow-md'
                : 'bg-purple-50/50 border-purple-100 opacity-60'
            }`}
          >
            <div className="text-3xl mb-1">{badge.icon}</div>
            <p className="text-xs font-bold text-purple-900 truncate">{badge.name}</p>
            <p className="text-[10px] text-purple-500 mt-1 line-clamp-2">{badge.description}</p>
            {!badge.unlockedAt && (
              <div className="absolute inset-0 flex items-center justify-center bg-purple-50/50 rounded-2xl">
                <span className="text-purple-300 text-lg">🔒</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
