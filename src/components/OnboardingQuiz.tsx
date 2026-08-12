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
  nebula: {
    name: 'Nebula',
    emoji: '🌟',
    color: 'from-violet-500 to-purple-600',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    traits: 'Leaders & Visionaries',
    description: 'You shine bright and inspire everyone around you. Charismatic, confident, and naturally born to lead.',
  },
  eclipse: {
    name: 'Eclipse',
    emoji: '🌑',
    color: 'from-slate-600 to-slate-800',
    bg: 'from-slate-50 to-gray-50',
    border: 'border-slate-200',
    traits: 'Mysterious & Calculated',
    description: 'You observe everything and strike when the time is right. Independent, thoughtful, and deeply perceptive.',
  },
  solstice: {
    name: 'Solstice',
    emoji: '☀️',
    color: 'from-amber-500 to-orange-600',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
    traits: 'Bold Adventurers',
    description: 'You charge forward with fearless energy. Passionate, bold, and always ready for the next adventure.',
  },
  supernova: {
    name: 'Supernova',
    emoji: '💫',
    color: 'from-pink-500 to-rose-600',
    bg: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
    traits: 'Creative Rebels',
    description: 'You break the mold and create your own path. Expressive, innovative, and unapologetically unique.',
  },
}

interface OnboardingQuizProps {
  onComplete: (house: 'nebula' | 'eclipse' | 'solstice' | 'supernova', displayName: string) => void
}

export default function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50 text-center">
          <div className="text-6xl mb-4">{info.emoji}</div>
          <h2 className="text-3xl font-black gradient-text mb-2">You're in {info.name}!</h2>
          <p className="text-sm text-purple-600 font-semibold mb-2">{info.traits}</p>
          <p className="text-purple-700 mb-6">{info.description}</p>

          <div className="space-y-3 mb-6">
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="What's your name?"
              className="w-full bg-white/80 border-2 border-purple-200 rounded-2xl px-5 py-3 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium"
            />
          </div>

          <button
            onClick={handleFinish}
            className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300"
          >
            Enter Focus Arena ✨
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-purple-600">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-sm text-purple-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-purple-900 mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(question.id, option.house)}
              className="w-full text-left p-4 rounded-2xl border-2 border-purple-200 bg-white/80 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 font-medium text-purple-900 hover:shadow-md"
            >
              {option.text}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-purple-600 hover:text-purple-800 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
