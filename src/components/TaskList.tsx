import type { Task } from '../db/schema'
import { Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  onComplete: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  filter?: 'all' | 'pending' | 'completed'
}

const categoryColors: Record<string, string> = {
  Study: 'bg-blue-100 text-blue-700 border-blue-200',
  Assignment: 'bg-green-100 text-green-700 border-green-200',
  Exam: 'bg-red-100 text-red-700 border-red-200',
  Personal: 'bg-purple-100 text-purple-700 border-purple-200',
}

const difficultyColors = {
  1: 'text-green-600',
  2: 'text-amber-600',
  3: 'text-rose-600',
}

export default function TaskList({ tasks, onComplete, onEdit, onDelete, filter = 'all' }: TaskListProps) {
  let filtered = tasks
  if (filter === 'pending') filtered = tasks.filter(t => !t.completed)
  if (filter === 'completed') filtered = tasks.filter(t => t.completed)

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">✨</div>
        <p className="text-purple-600 font-semibold text-lg">No tasks found</p>
        <p className="text-purple-400 text-sm mt-1">Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map(task => {
        const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0
        const totalSubtasks = task.subtasks?.length || 0
        const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

        return (
          <div
            key={task.id}
            className={`group bg-white/80 backdrop-blur-xl rounded-2xl p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 ${
              task.completed ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => onComplete(task)}
                className={`mt-0.5 flex-shrink-0 transition-colors ${
                  task.completed ? 'text-emerald-500' : 'text-purple-300 hover:text-purple-500'
                }`}
              >
                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-purple-400' : 'text-purple-900'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-purple-600 mt-1.5 line-clamp-2">{task.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`text-xs px-3 py-1 rounded-full border-2 font-semibold ${categoryColors[task.category]}`}>
                    {task.category}
                  </span>
                  <span className={`text-xs font-bold ${difficultyColors[task.difficulty]}`}>
                    {'★'.repeat(task.difficulty)}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-bold border border-purple-200">
                    +{task.pointsReward} pts
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-purple-500 font-medium">
                      📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {totalSubtasks > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${subtaskProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-purple-600">{completedSubtasks}/{totalSubtasks}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(task)}
                  className="p-2 text-purple-400 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(task.id!)}
                  className="p-2 text-purple-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
