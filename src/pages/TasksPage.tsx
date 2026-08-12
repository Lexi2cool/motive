import { useState } from 'react'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import StreakCounter from '../components/StreakCounter'
import OnboardingBanner from '../components/OnboardingBanner'
import { useApp } from '../context/AppContext'
import type { Task } from '../db/schema'
import { Users } from 'lucide-react'

type Filter = 'all' | 'pending' | 'completed'

interface TasksPageProps {
  onOpenSocial?: () => void
}

export default function TasksPage({ onOpenSocial }: TasksPageProps) {
  const { state, finishOnboarding, addTask, updateTask, deleteTask, completeTask } = useApp()
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [filter, setFilter] = useState<Filter>('all')
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      await updateTask(editingTask.id!, taskData)
      setEditingTask(undefined)
    } else {
      await addTask(taskData)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleComplete = async (task: Task) => {
    await completeTask(task)
  }

  const handleOnboardingComplete = async (house: 'nebula' | 'eclipse' | 'solstice' | 'supernova', displayName: string) => {
    await finishOnboarding(house, displayName)
  }

  return (
    <div className="space-y-6">
      {!state.profile?.hasCompletedOnboarding && (
        <OnboardingBanner onComplete={handleOnboardingComplete} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black gradient-text">Tasks</h2>
          <p className="text-sm text-purple-600 font-medium mt-1">Manage your tasks and earn points</p>
        </div>
        <div className="flex gap-2">
          {onOpenSocial && (
            <button
              onClick={onOpenSocial}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2.5 rounded-2xl font-bold shadow-lg shadow-emerald-200/50 transition-all"
            >
              <Users size={18} className="inline mr-1" />
              Friends
            </button>
          )}
          <button
            onClick={() => { setShowForm(!showForm); setEditingTask(undefined) }}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300"
          >
            {showForm && !editingTask ? 'Cancel' : '+ New Task'}
          </button>
        </div>
      </div>

      <StreakCounter
        currentStreak={state.profile?.currentStreak || 0}
        longestStreak={state.profile?.longestStreak || 0}
        isActive={true}
      />

      {(showForm || editingTask) && (
        <TaskForm
          onSubmit={handleSubmit}
          initialData={editingTask}
          onCancel={() => { setShowForm(false); setEditingTask(undefined) }}
        />
      )}

      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
              filter === f
                ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-200/50'
                : 'bg-white/80 text-purple-700 hover:bg-purple-50 border-2 border-purple-200/60 hover:border-purple-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <TaskList
        tasks={state.tasks}
        onComplete={handleComplete}
        onEdit={handleEdit}
        onDelete={deleteTask}
        filter={filter}
      />
    </div>
  )
}
