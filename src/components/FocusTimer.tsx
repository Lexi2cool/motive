import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw, Maximize2, Minimize2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const FOCUS_MODES = [
  { label: '25 min Focus', value: 25 },
  { label: '50 min Focus', value: 50 },
  { label: '90 min Focus', value: 90 },
]

export default function FocusTimer({ onOpenMinigames }: { onOpenMinigames?: () => void }) {
  const { state } = useApp()
  const [focusMinutes, setFocusMinutes] = useState(25)
  const [breakMinutes] = useState(5)
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>()
  const [showChallenge, setShowChallenge] = useState(false)
  const [mathAnswer, setMathAnswer] = useState('')
  const [mathResult, setMathResult] = useState<{ a: number; b: number; answer: number; op: string } | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const pendingTasks = state.tasks.filter(t => !t.completed)

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
  }, [])

  const playBeep = useCallback((frequency = 800, duration = 0.3) => {
    if (!audioContextRef.current) return
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }, [])

  const generateMathChallenge = useCallback(() => {
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    const ops = ['+', '-', '×']
    const op = ops[Math.floor(Math.random() * ops.length)]
    let answer: number
    if (op === '+') answer = a + b
    else if (op === '-') answer = a - b
    else answer = a * b
    setMathResult({ a, b, answer, op })
    setMathAnswer('')
  }, [])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            playBeep(600, 0.5)
            setTimeout(() => playBeep(800, 0.5), 300)
            setTimeout(() => playBeep(1000, 0.8), 600)
            if (isBreak) {
              return focusMinutes * 60
            } else {
              return breakMinutes * 60
            }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, focusMinutes, breakMinutes, playBeep])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

  const exitFocusMode = () => {
    if (isRunning && !isBreak) {
      setShowChallenge(true)
      generateMathChallenge()
    } else {
      document.exitFullscreen()
    }
  }

  const handleChallengeSubmit = () => {
    if (mathResult && Number(mathAnswer) === mathResult.answer) {
      setShowChallenge(false)
      document.exitFullscreen()
      setIsRunning(false)
      setTimeLeft(focusMinutes * 60)
      setIsBreak(false)
    }
  }

  const switchMode = () => {
    initAudio()
    if (isBreak) {
      setIsBreak(false)
      setTimeLeft(focusMinutes * 60)
    } else {
      setIsBreak(true)
      setTimeLeft(breakMinutes * 60)
    }
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(focusMinutes * 60)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progress = isBreak
    ? ((breakMinutes * 60 - timeLeft) / (breakMinutes * 60)) * 100
    : ((focusMinutes * 60 - timeLeft) / (focusMinutes * 60)) * 100

  if (showChallenge) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-200/60 text-center max-w-md mx-auto shadow-xl shadow-purple-100/50">
        <h2 className="text-2xl font-black text-purple-900 mb-2">Focus Mode Challenge</h2>
        <p className="text-purple-600 mb-6 font-medium">Solve this to exit focus mode:</p>
        <div className="text-4xl font-mono font-black text-purple-600 mb-6">
          {mathResult?.a} {mathResult?.op} {mathResult?.b} = ?
        </div>
        <input
          type="number"
          value={mathAnswer}
          onChange={e => setMathAnswer(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleChallengeSubmit()}
          className="w-20 text-center text-2xl font-mono bg-white border-2 border-purple-200 rounded-2xl px-4 py-3 text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 mb-4"
          autoFocus
        />
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleChallengeSubmit}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-purple-200/50 transition-all"
          >
            Submit
          </button>
          <button
            onClick={() => setShowChallenge(false)}
            className="bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-6 py-2.5 rounded-2xl font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200/60 shadow-xl shadow-purple-100/50 ${isFullscreen ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/95' : 'p-6'}`}>
      {isFullscreen && (
        <button onClick={exitFocusMode} className="absolute top-4 right-4 text-purple-400 hover:text-purple-600">
          <X size={28} />
        </button>
      )}
      <div className={`flex flex-col items-center ${isFullscreen ? 'gap-6' : 'gap-4'}`}>
        <div className={`relative ${isFullscreen ? 'w-64 h-64' : 'w-48 h-48'} flex items-center justify-center`}>
          <svg className={`transform -rotate-90 ${isFullscreen ? 'w-64 h-64' : 'w-48 h-48'}`}>
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-purple-100"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={`${progress * 2.83} 283`}
              strokeLinecap="round"
              className={isBreak ? 'text-emerald-400' : 'text-purple-500'}
              style={{ filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.4))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-mono font-black ${isFullscreen ? 'text-7xl' : 'text-4xl'} text-purple-900`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-purple-500 font-semibold mt-1">
              {isBreak ? 'Break Time ☕' : 'Focus Time 🎯'}
            </span>
          {isBreak && onOpenMinigames && (
            <button
              onClick={onOpenMinigames}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg shadow-pink-200/50 hover:shadow-xl transition-all"
            >
              🎮 Play
            </button>
          )}
        </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTaskId || ''}
            onChange={e => setSelectedTaskId(e.target.value || undefined)}
            className="bg-white border-2 border-purple-200 rounded-2xl px-4 py-2.5 text-sm text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium"
          >
            <option value="">No task selected</option>
            {pendingTasks.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { initAudio(); setIsRunning(!isRunning) }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 ${
              isRunning
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-rose-200/50'
                : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-purple-200/50'
            }`}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={switchMode}
            className="px-4 py-3 rounded-2xl bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-bold transition-colors"
          >
            {isBreak ? 'Focus' : 'Break'}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-2xl bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        <div className="flex gap-2">
          {FOCUS_MODES.map(mode => (
            <button
              key={mode.value}
              onClick={() => { initAudio(); setFocusMinutes(mode.value); setTimeLeft(mode.value * 60); setIsRunning(false) }}
              className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                focusMinutes === mode.value && !isBreak
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-200/50'
                  : 'bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
