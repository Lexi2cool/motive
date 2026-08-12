import { useState, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import TasksPage from './pages/TasksPage'
import TimerPage from './pages/TimerPage'
import DashboardPage from './pages/DashboardPage'
import ShopPage from './pages/ShopPage'
import OnboardingQuiz from './components/OnboardingQuiz'
import CapybaraMascot from './components/CapybaraMascot'
import FriendsLeaderboard from './components/FriendsLeaderboard'
import DailySpin from './components/DailySpin'
import AvatarCustomization from './components/AvatarCustomization'
import Minigames from './components/Minigames'
import { ListChecks, Timer, BarChart3, Store, Users, Sparkles } from 'lucide-react'
import './index.css'

type Tab = 'tasks' | 'timer' | 'dashboard' | 'shop' | 'social' | 'avatar' | 'spin'

function AppContent() {
  const { state, refreshData, finishOnboarding } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>('tasks')
  const [showSocial, setShowSocial] = useState(false)
  const [showMinigames, setShowMinigames] = useState(false)

  useEffect(() => {
    refreshData()
  }, [])

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-violet-200 border-b-violet-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-purple-700 font-semibold text-lg">Loading Motive...</p>
          <p className="text-purple-400 text-sm mt-2">Preparing your productivity journey</p>
        </div>
      </div>
    )
  }

  if (state.showOnboarding) {
    return <OnboardingQuiz onComplete={(house, displayName) => finishOnboarding(house, displayName)} />
  }

  const navItems: { id: Tab; label: string; icon: React.ReactNode; gradient: string; activeGradient: string }[] = [
    { id: 'tasks', label: 'Tasks', icon: <ListChecks size={18} />, gradient: 'from-pink-400 to-rose-400', activeGradient: 'from-pink-500 to-rose-500' },
    { id: 'timer', label: 'Timer', icon: <Timer size={18} />, gradient: 'from-violet-400 to-purple-400', activeGradient: 'from-violet-500 to-purple-500' },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} />, gradient: 'from-blue-400 to-cyan-400', activeGradient: 'from-blue-500 to-cyan-500' },
    { id: 'shop', label: 'Shop', icon: <Store size={18} />, gradient: 'from-amber-400 to-orange-400', activeGradient: 'from-amber-500 to-orange-500' },
    { id: 'social', label: 'Social', icon: <Users size={18} />, gradient: 'from-emerald-400 to-teal-400', activeGradient: 'from-emerald-500 to-teal-500' },
    { id: 'avatar', label: 'Avatar', icon: <Sparkles size={18} />, gradient: 'from-pink-400 to-rose-400', activeGradient: 'from-pink-500 to-rose-500' },
  ]

  const houseInfo = {
    nebula: { emoji: '🌟', color: 'from-violet-500 to-purple-600' },
    eclipse: { emoji: '🌑', color: 'from-slate-600 to-slate-800' },
    solstice: { emoji: '☀️', color: 'from-amber-500 to-orange-600' },
    supernova: { emoji: '💫', color: 'from-pink-500 to-rose-600' },
  }

  const currentHouse = state.profile?.house || 'nebula'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 text-purple-900 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-3xl bg-gradient-to-br ${houseInfo[currentHouse].color} flex items-center justify-center shadow-lg text-2xl`}>
                {houseInfo[currentHouse].emoji}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black gradient-text tracking-tight">
                  Motive
                </h1>
                <p className="text-sm text-purple-600 font-semibold mt-0.5">
                  {state.profile?.displayName || 'Student'} • Level {state.profile?.level || 1} • {state.profile?.totalPoints || 0} pts
                </p>
              </div>
            </div>

            <nav className="flex items-center gap-1 bg-white/80 backdrop-blur-xl rounded-2xl p-1.5 border border-purple-200/60 shadow-lg shadow-purple-100/50 overflow-x-auto">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === item.id
                      ? 'text-white shadow-md'
                      : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50/80'
                  }`}
                >
                  {activeTab === item.id && (
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.activeGradient} shadow-md`} />
                  )}
                  <span className={`relative ${activeTab === item.id ? 'text-white' : 'text-purple-500'}`}>
                    {item.icon}
                  </span>
                  <span className={`relative ${activeTab === item.id ? 'text-white' : 'hidden sm:inline text-purple-600'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="relative">
          <div className={`rounded-3xl border-2 transition-all duration-500 ${
            activeTab === 'tasks' ? 'border-pink-300/50 bg-gradient-to-br from-pink-50/80 to-white/60' :
            activeTab === 'timer' ? 'border-violet-300/50 bg-gradient-to-br from-violet-50/80 to-white/60' :
            activeTab === 'dashboard' ? 'border-blue-300/50 bg-gradient-to-br from-blue-50/80 to-white/60' :
            activeTab === 'shop' ? 'border-amber-300/50 bg-gradient-to-br from-amber-50/80 to-white/60' :
            activeTab === 'social' ? 'border-emerald-300/50 bg-gradient-to-br from-emerald-50/80 to-white/60' :
            'border-pink-300/50 bg-gradient-to-br from-pink-50/80 to-white/60'
          }`}>
            <div className="p-4 sm:p-6">
              {activeTab === 'tasks' && <TasksPage onOpenSocial={() => setShowSocial(true)} />}
              {activeTab === 'timer' && <TimerPage onOpenMinigames={() => setShowMinigames(true)} />}
              {activeTab === 'dashboard' && <DashboardPage />}
              {activeTab === 'shop' && <ShopPage />}
              {activeTab === 'social' && <div className="text-center py-12"><p className="text-purple-600 font-semibold">Use the Social button in Tasks page to access friends & challenges!</p></div>}
              {activeTab === 'avatar' && <AvatarCustomization />}
            </div>
          </div>
        </main>

        <footer className="mt-8 sm:mt-12 pb-8">
          <div className="relative rounded-3xl border-2 border-purple-200/60 bg-white/70 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-purple-100/50">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full" />
            <DailySpin />
          </div>
        </footer>
      </div>

      <CapybaraMascot />
      {showSocial && <FriendsLeaderboard onClose={() => setShowSocial(false)} />}
      {showMinigames && <Minigames onClose={() => setShowMinigames(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
