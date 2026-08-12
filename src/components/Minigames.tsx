import { useState, useEffect } from 'react'
import { Trophy, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const EMOJIS = ['🎮', '🎯', '🎨', '🎪', '🎭', '🎬', '🎤', '🎸']

interface MinigamesProps {
  onClose: () => void
}

export default function Minigames({ onClose }: MinigamesProps) {
  const { state, completeSession } = useApp()
  const [activeGame, setActiveGame] = useState<'menu' | 'memory' | 'math'>('menu')
  const [memoryCards, setMemoryCards] = useState<{ id: string; emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [mathScore, setMathScore] = useState(0)
  const [mathQuestion, setMathQuestion] = useState({ a: 0, b: 0, op: '+', answer: 0 })
  const [mathInput, setMathInput] = useState('')
  const [mathTimeLeft, setMathTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (activeGame === 'memory' && memoryCards.length === 0) {
      initMemoryGame()
    }
  }, [activeGame])

  const initMemoryGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: `card-${idx}`,
        emoji,
        flipped: false,
        matched: false,
      }))
    setMemoryCards(shuffled)
    setSelectedCards([])
    setGameOver(false)
  }

  const flipCard = (idx: number) => {
    if (selectedCards.length === 2 || memoryCards[idx].flipped || memoryCards[idx].matched) return

    const newCards = [...memoryCards]
    newCards[idx].flipped = true
    setMemoryCards(newCards)

    if (selectedCards.length === 0) {
      setSelectedCards([idx])
    } else {
      const [first] = selectedCards
      if (memoryCards[first].emoji === memoryCards[idx].emoji) {
        newCards[first].matched = true
        newCards[idx].matched = true
        setMemoryCards(newCards)
        setSelectedCards([])

        const allMatched = newCards.every(c => c.matched)
        if (allMatched) {
          setGameOver(true)
        }
      } else {
        setTimeout(() => {
          const resetCards = [...newCards]
          resetCards[first].flipped = false
          resetCards[idx].flipped = false
          setMemoryCards(resetCards)
          setSelectedCards([])
        }, 800)
      }
    }
  }

  const generateMathQuestion = () => {
    const ops = ['+', '-', '×']
    const op = ops[Math.floor(Math.random() * ops.length)]
    let a = Math.floor(Math.random() * 20) + 1
    let b = Math.floor(Math.random() * 20) + 1
    let answer: number
    if (op === '+') answer = a + b
    else if (op === '-') answer = a - b
    else answer = a * b
    setMathQuestion({ a, b, op, answer })
    setMathInput('')
  }

  const startMathGame = () => {
    setMathScore(0)
    setMathTimeLeft(30)
    setGameOver(false)
    generateMathQuestion()
  }

  useEffect(() => {
    if (activeGame === 'math' && mathTimeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setMathTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [activeGame, mathTimeLeft, gameOver])

  const handleMathSubmit = () => {
    if (Number(mathInput) === mathQuestion.answer) {
      setMathScore(prev => prev + 1)
      generateMathQuestion()
    }
  }

  const finishGame = async () => {
    const points = activeGame === 'memory' ? 50 : mathScore * 10
    if (points > 0) {
      await completeSession({
        taskId: undefined,
        durationMinutes: 5,
        completed: true,
        pointsEarned: points,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      })
    }
    onClose()
  }

  if (activeGame === 'menu') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50 max-w-sm w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-purple-900">Minigames</h3>
            <button onClick={onClose} className="text-purple-400 hover:text-purple-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setActiveGame('memory'); initMemoryGame() }}
              className="w-full p-4 rounded-2xl border-2 border-purple-200 bg-white/80 hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
            >
              <div className="text-3xl mb-2">🧠</div>
              <h4 className="font-bold text-purple-900">Memory Match</h4>
              <p className="text-xs text-purple-600">Match all pairs to win 50 pts</p>
            </button>

            <button
              onClick={() => { setActiveGame('math'); startMathGame() }}
              className="w-full p-4 rounded-2xl border-2 border-purple-200 bg-white/80 hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
            >
              <div className="text-3xl mb-2">🔢</div>
              <h4 className="font-bold text-purple-900">Quick Math</h4>
              <p className="text-xs text-purple-600">Solve as many as you can in 30s</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (activeGame === 'memory') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50 max-w-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-purple-900">Memory Match</h3>
            <button onClick={onClose} className="text-purple-400 hover:text-purple-600">
              <X size={24} />
            </button>
          </div>

          {gameOver ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h4 className="text-2xl font-black text-purple-900 mb-2">You Win!</h4>
              <p className="text-purple-600 mb-6">+50 points</p>
              <button onClick={finishGame} className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-2xl font-bold">
                Claim Reward
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {memoryCards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => flipCard(idx)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                    card.flipped || card.matched
                      ? 'bg-gradient-to-br from-purple-400 to-violet-500 text-white rotate-0'
                      : 'bg-gradient-to-br from-purple-200 to-violet-200 text-transparent rotate-180'
                  }`}
                >
                  {card.flipped || card.matched ? card.emoji : '?'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (activeGame === 'math') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50 max-w-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-purple-900">Quick Math</h3>
            <button onClick={onClose} className="text-purple-400 hover:text-purple-600">
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-purple-600">Score: {mathScore}</div>
            <div className="text-sm font-bold text-purple-600">Time: {mathTimeLeft}s</div>
          </div>

          {gameOver ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h4 className="text-2xl font-black text-purple-900 mb-2">Time's Up!</h4>
              <p className="text-purple-600 mb-1">You got {mathScore} correct!</p>
              <p className="text-purple-600 mb-6">+{mathScore * 10} points</p>
              <button onClick={finishGame} className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-2xl font-bold">
                Claim Reward
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-3xl font-black text-purple-900 py-4">
                {mathQuestion.a} {mathQuestion.op} {mathQuestion.b} = ?
              </div>
              <input
                type="number"
                value={mathInput}
                onChange={e => setMathInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleMathSubmit()}
                className="w-full text-center text-2xl font-mono bg-white border-2 border-purple-200 rounded-2xl px-4 py-3 text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                autoFocus
              />
              <button
                onClick={handleMathSubmit}
                className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 rounded-2xl font-bold"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
