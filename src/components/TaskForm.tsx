import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import type { Task, SubTask } from '../db/schema'
import SubtaskManager from '../components/SubtaskManager'
import { analyzeTaskTitle, getBreakdownConfidence } from '../utils/taskBreakdown'

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void
  initialData?: Task
  onCancel?: () => void
}

export default function TaskForm({ onSubmit, initialData, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [category, setCategory] = useState<Task['category']>(initialData?.category || 'Study')
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(initialData?.difficulty || 1)
  const [dueDate, setDueDate] = useState(initialData?.dueDate?.split('T')[0] || '')
  const [subtasks, setSubtasks] = useState<SubTask[]>(initialData?.subtasks || [])
  const [isBreakingDown, setIsBreakingDown] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      difficulty,
      dueDate: dueDate || undefined,
      completed: initialData?.completed || false,
      completedAt: initialData?.completedAt,
      pointsReward: difficulty === 1 ? 10 : difficulty === 2 ? 25 : 50,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      subtasks,
    })
    if (!initialData) {
      setTitle('')
      setDescription('')
      setCategory('Study')
      setDifficulty(1)
      setDueDate('')
      setSubtasks([])
    }
  }

  const handleAIBreakdown = () => {
    if (!title.trim()) return
    setIsBreakingDown(true)
    setTimeout(() => {
      const result = analyzeTaskTitle(title)
      setSubtasks(result.breakdown)
      setIsBreakingDown(false)
    }, 800)
  }

  const confidence = title.trim() ? getBreakdownConfidence(title) : 'low'
  const showBreakdownButton = !initialData && title.trim().length > 3

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200/60 mb-6 shadow-xl shadow-purple-100/50">
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full bg-white/80 border-2 border-purple-200 rounded-2xl px-5 py-3 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium"
          required
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          className="w-full bg-white/80 border-2 border-purple-200 rounded-2xl px-5 py-3 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all resize-none"
          rows={2}
        />

        {showBreakdownButton && (
          <button
            type="button"
            onClick={handleAIBreakdown}
            disabled={isBreakingDown}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-100 to-violet-100 border-2 border-purple-200 text-purple-700 font-bold hover:from-purple-200 hover:to-violet-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isBreakingDown ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Breaking it down...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                ✨ AI Break It Down
                {confidence === 'high' && <span className="text-xs bg-purple-200 px-2 py-0.5 rounded-full">Smart match</span>}
                {confidence === 'medium' && <span className="text-xs bg-purple-100 px-2 py-0.5 rounded-full">Good match</span>}
                {confidence === 'low' && <span className="text-xs bg-purple-50 px-2 py-0.5 rounded-full">Generic</span>}
              </>
            )}
          </button>
        )}

        {subtasks.length > 0 && (
          <div className="bg-purple-50/80 rounded-2xl p-4 border-2 border-purple-200/60">
            <h4 className="text-sm font-bold text-purple-800 mb-3">AI-Generated Subtasks</h4>
            <SubtaskManager
              subtasks={subtasks}
              onUpdate={setSubtasks}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Task['category'])}
            className="bg-white/80 border-2 border-purple-200 rounded-2xl px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium"
          >
            <option value="Study">📚 Study</option>
            <option value="Assignment">📝 Assignment</option>
            <option value="Exam">🎯 Exam</option>
            <option value="Personal">✨ Personal</option>
          </select>
          <select
            value={difficulty}
            onChange={e => setDifficulty(Number(e.target.value) as 1 | 2 | 3)}
            className="bg-white/80 border-2 border-purple-200 rounded-2xl px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium"
          >
            <option value={1}>😊 Easy (+10 pts)</option>
            <option value={2}>🤔 Medium (+25 pts)</option>
            <option value={3}>🔥 Hard (+50 pts)</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="bg-white/80 border-2 border-purple-200 rounded-2xl px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium"
          />
          <div className="flex gap-2 ml-auto">
            {onCancel && (
              <button type="button" onClick={onCancel} className="px-5 py-2.5 text-purple-600 hover:text-purple-800 font-bold transition-colors">
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300"
            >
              {initialData ? 'Update' : 'Add Task'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
