import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const roasts = [
  "Capybara says: Still here? Your tasks aren't going to complete themselves, bestie.",
  "Capybara says: Procrastination level: expert. But I believe in you... barely.",
  "Capybara says: That task has been staring at you for 20 minutes. Be nice to it.",
  "Capybara says: I'm a capybara and even I'm more productive than you right now.",
  "Capybara says: Break? Already? You've been working for... 2 minutes. Bold.",
  "Capybara says: Your focus timer called. It wants its purpose back.",
  "Capybara says: Imagine how satisfied you'll feel after checking that box. Do it.",
  "Capybara says: I chill 24/7 and even I have goals. Just saying.",
  "Capybara says: That task won't complete itself. Neither will this insult. But at least one is helpful.",
  "Capybara says: Your future self will thank you. Or they'll be disappointed. Your call.",
  "Capybara says: You're not lazy, you're just... highly skilled at avoiding things. Work on that.",
  "Capybara says: If procrastination was an Olympic sport, you'd be medaling. Now get to work.",
  "Capybara says: I've seen turtles move faster. And they carry their house on their back. Just saying.",
  "Capybara says: The hardest part is starting. You can do hard things. Probably.",
  "Capybara says: Your to-do list is getting lonely. Give it some love.",
  "Capybara says: You opened this app. That's step 1. Now do step 2.",
  "Capybara says: I'm literally a rodent who's better at time management. Think about that.",
  "Capybara says: That task isn't going to get less intimidating. Start before you overthink it.",
  "Capybara says: Your productivity is currently at capybara-in-a-hot-tub levels. Zero urgency.",
  "Capybara says: One day you'll look back and be glad you started. Today is that day. Probably.",
  "Capybara says: I don't judge. I just sit here. Unlike you, who has things to do.",
  "Capybara says: You're scrolling past this instead of working. I see you.",
  "Capybara says: That task has a deadline. You don't. Choose wisely.",
  "Capybara says: Motivation is a feeling. Discipline is doing it anyway. Pick discipline.",
  "Capybara says: If you were any more relaxed, you'd be me. And I have nothing to do. You do.",
]

export default function CapybaraMascot() {
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setMessage(roasts[Math.floor(Math.random() * roasts.length)])
  }, [])

  const refreshMessage = () => {
    setMessage(roasts[Math.floor(Math.random() * roasts.length)])
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
      >
        <span className="text-2xl">🦦</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 border-2 border-purple-200/60 shadow-xl shadow-purple-100/50 animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="text-4xl flex-shrink-0 animate-bounce-slow">🦦</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-purple-900 font-medium leading-relaxed">{message}</p>
          </div>
          <button onClick={() => setIsVisible(false)} className="text-purple-400 hover:text-purple-600 flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={refreshMessage}
            className="flex-1 text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-2 rounded-xl font-bold transition-colors"
          >
            Roast me again
          </button>
        </div>
      </div>
    </div>
  )
}
