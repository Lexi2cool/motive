import { useState } from 'react'
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react'
import type { SubTask } from '../utils/taskBreakdown'

interface SubtaskManagerProps {
  subtasks: SubTask[]
  onUpdate: (subtasks: SubTask[]) => void
}

export default function SubtaskManager({ subtasks, onUpdate }: SubtaskManagerProps) {
  const [newTitle, setNewTitle] = useState('')

  const addSubtask = () => {
    if (!newTitle.trim()) return
    onUpdate([...subtasks, { id: crypto.randomUUID(), title: newTitle.trim(), completed: false }])
    setNewTitle('')
  }

  const toggleSubtask = (id: string) => {
    onUpdate(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
  }

  const deleteSubtask = (id: string) => {
    onUpdate(subtasks.filter(s => s.id !== id))
  }

  const completedCount = subtasks.filter(s => s.completed).length
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0

  return (
    <div className="mt-4 space-y-3">
      {subtasks.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-purple-600">{completedCount}/{subtasks.length}</span>
        </div>
      )}

      <div className="space-y-2">
        {subtasks.map(subtask => (
          <div
            key={subtask.id}
            className={`group flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-300 ${
              subtask.completed
                ? 'bg-emerald-50/80 border-emerald-200/60'
                : 'bg-white/80 border-purple-200/60 hover:border-purple-300 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => toggleSubtask(subtask.id)}
              className={`flex-shrink-0 transition-colors ${
                subtask.completed ? 'text-emerald-500' : 'text-purple-300 hover:text-purple-500'
              }`}
            >
              {subtask.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>
            <span className={`flex-1 text-sm font-medium ${subtask.completed ? 'line-through text-purple-400' : 'text-purple-900'}`}>
              {subtask.title}
            </span>
            <button
              onClick={() => deleteSubtask(subtask.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-purple-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
          placeholder="Add a subtask..."
          className="flex-1 bg-white/80 border-2 border-purple-200 rounded-2xl px-4 py-2.5 text-sm text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium"
        />
        <button
          onClick={addSubtask}
          className="p-2.5 rounded-2xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}
