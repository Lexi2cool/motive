import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

const questions = [
  {
    id: 'style',
    question: 'How do you approach challenges?',
    options: [
      { text: 'Take charge and lead the way', house: 'nebula' },
      { text: 'Observe first, then make my move', house: 'eclipse' },
      { text: 'Dive right in, no hesitation', house: 'solstice' },
      { text: 'Find a creative solution nobody else sees', house: 'supernova' },
    ],
  },
  {
    id: 'social',
    question: 'In a group project, you...',
    options: [
      { text: 'Naturally step up as the leader', house: 'nebula' },
      { text: 'Work independently on my part', house: 'eclipse' },
      { text: 'Push for bold, exciting ideas', house: 'solstice' },
      { text: 'Come up with something totally unique', house: 'supernova' },
    ],
  },
  {
    id: 'stress',
    question: 'When things get stressful...',
    options: [
      { text: 'I stay calm and guide others', house: 'nebula' },
      { text: 'I retreat to think it through', house: 'eclipse' },
      { text: 'I act fast to fix it', house: 'solstice' },
      { text: 'I express myself to process it', house: 'supernova' },
    ],
  },
  {
    id: 'freeTime',
    question: 'Your ideal weekend?',
    options: [
      { text: 'Hosting a game night with friends', house: 'nebula' },
      { text: 'Reading or gaming solo', house: 'eclipse' },
      { text: 'Road trip or adventure', house: 'solstice' },
      { text: 'Painting, writing, or making something', house: 'supernova' },
    ],
  },
  {
    id: 'strength',
    question: 'What are you most proud of?',
    options: [
      { text: 'My ability to inspire others', house: 'nebula' },
      { text: 'My sharp intuition and awareness', house: 'eclipse' },
      { text: 'My courage and determination', house: 'solstice' },
      { text: 'My originality and imagination', house: 'supernova' },
    ],
  },
]

const houseInfo = {
  nebula: { emoji: '🌟', name: 'Nebula', color: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50', border: 'border-violet-200', traits: 'Leaders & Visionaries' },
  eclipse: { emoji: '🌑', name: 'Eclipse', color: 'from-slate-600 to-slate-800', bg: 'from-slate-50 to-gray-50', border: 'border-slate-200', traits: 'Mysterious & Calculated' },
  solstice: { emoji: '☀️', name: 'Solstice', color: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', traits: 'Bold Adventurers' },
  supernova: { emoji: '💫', name: 'Supernova', color: 'from-pink-500 to-rose-600', bg: 'from-pink-50 to-rose-50', border: 'border-pink-200', traits: 'Creative Rebels' },
}

interface OnboardingBannerProps {
  onComplete: (house: 'nebula' | 'eclipse' | 'solstice' | 'supernova', displayName: string) => void
}

export default function OnboardingBanner({ onComplete }: OnboardingBannerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [displayName, setDisplayName] = useState('')
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (questionId: string, house: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: house }))
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResult(true)
    }
  }

  const calculateHouse = (): 'nebula' | 'eclipse' | 'solstice' | 'supernova' => {
    const counts: Record<string, number> = { nebula: 0, eclipse: 0, solstice: 0, supernova: 0 }
    Object.values(answers).forEach(house => {
      counts[house] = (counts[house] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as 'nebula' | 'eclipse' | 'solstice' | 'supernova'
  }

  const handleFinish = () => {
    const house = calculateHouse()
    onComplete(house, displayName || 'Student')
  }

  if (showResult) {
    const house = calculateHouse()
    const info = houseInfo[house]
    return (
      <div className={`bg-gradient-to-r ${info.bg} rounded-3xl p-6 border-2 ${info.border} shadow-lg`}>
        <div className="text-center">
          <div className="text-4xl mb-2">{info.emoji}</div>
          <h3 className="text-xl font-black text-purple-900 mb-1">You're in {info.name}!</h3>
          <p className="text-xs text-purple-600 font-medium mb-1">{info.traits}</p>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="What's your name?"
            className="w-full bg-white/80 border-2 border-purple-200 rounded-2xl px-4 py-2.5 text-sm text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium mb-3"
          />
          <button
            onClick={handleFinish}
            className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-purple-200/50 transition-all"
          >
            Start Crushing It ✨
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-purple-600">House Quiz - Question {currentQuestion + 1}/{questions.length}</span>
          <span className="text-sm text-purple-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h3 className="text-lg font-black text-purple-900 mb-4">{question.question}</h3>

      <div className="space-y-2">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(question.id, option.house)}
            className="w-full text-left p-3 rounded-2xl border-2 border-purple-200 bg-white/80 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 font-medium text-sm text-purple-900 hover:shadow-md"
          >
            {option.text}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-purple-600 hover:text-purple-800 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    </div>
  )
}
