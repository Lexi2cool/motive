import { useState } from 'react'
import { useApp } from '../context/AppContext'

const spinPrizes = [
  { label: '10 pts', value: 10, probability: 30, startColor: '#a855f7', endColor: '#8b5cf6' },
  { label: '25 pts', value: 25, probability: 25, startColor: '#8b5cf6', endColor: '#7c3aed' },
  { label: '50 pts', value: 50, probability: 15, startColor: '#ec4899', endColor: '#f43f5e' },
  { label: '100 pts', value: 100, probability: 8, startColor: '#f59e0b', endColor: '#f97316' },
  { label: 'Free Spin', value: -1, probability: 5, startColor: '#10b981', endColor: '#14b8a6' },
  { label: '5 pts', value: 5, probability: 12, startColor: '#3b82f6', endColor: '#06b6d4' },
  { label: 'Bad Luck', value: 0, probability: 5, startColor: '#94a3b8', endColor: '#64748b' },
]

export default function DailySpin() {
  const { state, updateSettings } = useApp()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const settings = state.settings
  const today = new Date().toISOString().split('T')[0]
  const spinsRemaining = settings?.lastSpinDate === today ? settings.dailySpinsRemaining : 1

  const getRandomPrize = () => {
    const random = Math.random() * 100
    let cumulative = 0
    for (const prize of spinPrizes) {
      cumulative += prize.probability
      if (random <= cumulative) return prize
    }
    return spinPrizes[0]
  }

  const handleSpin = async () => {
    if (isSpinning || spinsRemaining <= 0) return
    setIsSpinning(true)
    setShowResult(false)
    setResult(null)

    const prize = getRandomPrize()
    const segmentAngle = 360 / spinPrizes.length
    const prizeIndex = spinPrizes.indexOf(prize)
    const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2)
    const spins = 5 + Math.random() * 5
    const newRotation = rotation + spins * 360 + targetAngle

    setRotation(newRotation)

    setTimeout(async () => {
      setIsSpinning(false)
      setResult(prize.label)
      setShowResult(true)

      if (prize.value > 0 && state.profile) {
        await updateSettings({
          dailySpinsRemaining: prize.label === 'Free Spin' ? spinsRemaining : spinsRemaining - 1,
          lastSpinDate: today,
        })
      } else if (prize.label === 'Free Spin') {
        await updateSettings({
          dailySpinsRemaining: spinsRemaining,
          lastSpinDate: today,
        })
      } else {
        await updateSettings({
          dailySpinsRemaining: spinsRemaining - 1,
          lastSpinDate: today,
        })
      }
    }, 4000)
  }

  const segmentAngle = 360 / spinPrizes.length

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-purple-900 mb-1">Daily Spin</h3>
        <p className="text-sm text-purple-600 font-medium">Spin once per day for bonus points!</p>
        <p className="text-xs text-purple-400 mt-1">Spins remaining today: {spinsRemaining}</p>
      </div>

      <div className="relative w-64 h-64 mx-auto mb-6">
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: `rotate(${rotation}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none' }}>
          {spinPrizes.map((prize, idx) => {
            const angle = idx * segmentAngle
            const largeArc = segmentAngle > 180 ? 1 : 0
            const startX = 100 + 80 * Math.cos((angle * Math.PI) / 180)
            const startY = 100 + 80 * Math.sin((angle * Math.PI) / 180)
            const endX = 100 + 80 * Math.cos(((angle + segmentAngle) * Math.PI) / 180)
            const endY = 100 + 80 * Math.sin(((angle + segmentAngle) * Math.PI) / 180)
            const midAngle = ((angle + segmentAngle / 2) * Math.PI) / 180
            const textX = 100 + 50 * Math.cos(midAngle)
            const textY = 100 + 50 * Math.sin(midAngle)

            return (
              <g key={idx}>
                <path
                  d={`M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArc} 1 ${endX} ${endY} Z`}
                  fill={`url(#gradient${idx})`}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  transform={`rotate(${angle + segmentAngle / 2}, ${textX}, ${textY})`}
                >
                  {prize.label}
                </text>
                <defs>
                  <linearGradient id={`gradient${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={prize.startColor} />
                    <stop offset="100%" stopColor={prize.endColor} />
                  </linearGradient>
                </defs>
              </g>
            )
          })}
        </svg>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-purple-900 z-10" />
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || spinsRemaining <= 0}
        className={`w-full py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 ${
          isSpinning || spinsRemaining <= 0
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50'
        }`}
      >
        {isSpinning ? 'Spinning...' : spinsRemaining > 0 ? '✨ SPIN!' : 'Come back tomorrow!'}
      </button>

      {showResult && result && (
        <div className="mt-4 p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 text-center animate-slide-up">
          <p className="text-lg font-black text-purple-900">
            {result === 'Bad Luck' ? '😢 Bad luck! Try again tomorrow!' : result === 'Free Spin' ? '🎰 Free spin! Use it wisely!' : `🎉 You won ${result}!`}
          </p>
        </div>
      )}
    </div>
  )
}
