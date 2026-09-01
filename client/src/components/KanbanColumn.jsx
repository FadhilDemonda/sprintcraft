import React, { useState } from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { useStore } from '../store/useStore'
import confetti from 'canvas-confetti'

export const KanbanColumn = ({ column, tasks }) => {
  const { addTask, moveTask, theme } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  const isDark = theme === 'dark'

  // Calculate total story points in column
  const totalPoints = tasks.reduce((sum, t) => sum + (Number(t.storyPoints) || 0), 0)

  const handleCreateTask = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addTask({
      title: newTitle.trim(),
      columnId: column.id,
      category: 'Frontend',
      priority: 'Medium',
      storyPoints: 3
    })
    setNewTitle('')
    setIsAdding(false)
  }

  // Drag over / drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!isDragOver) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      moveTask(taskId, column.id)
      if (column.id === 'done') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        })
      }
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[280px] max-w-[340px] rounded-2xl border p-3.5 shadow-xs transition-all duration-150 ${
        isDragOver
          ? 'ring-2 ring-teal-500/80 border-teal-500 bg-teal-500/10 shadow-lg'
          : isDark 
            ? 'bg-[#111827] border-[#1F293D]' 
            : 'bg-slate-100/90 border-[#E2E8F0]'
      }`}
    >
      {/* Column Header (Solid Pastel Colors for Both Modes) */}
      <div 
        className="flex items-center justify-between pb-3 mb-3 border-b rounded-t-xl px-2 pt-2 -mx-2 -mt-2"
        style={{ 
          backgroundColor: column.color,
          borderColor: column.color
        }}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-xs tracking-wider uppercase text-slate-900">
            {column.title}
          </h3>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/50 text-slate-900 shadow-sm">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-800">
          <span>{totalPoints} pts</span>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-0.5 min-h-[160px]">
        {tasks.map((task, idx) => (
          <TaskCard key={task.id} task={task} index={idx} />
        ))}

        {tasks.length === 0 && (
          <div className={`flex flex-col items-center justify-center flex-1 py-8 text-center border-2 border-dashed rounded-xl ${
            isDragOver 
              ? 'border-teal-500 text-teal-400 bg-teal-500/5 font-semibold' 
              : isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-300 text-slate-400'
          }`}>
            <span className="text-xs">
              {isDragOver ? 'Drop ticket here' : 'No tasks in this column'}
            </span>
          </div>
        )}

        {/* Indicator when dragging over a column with existing cards */}
        {isDragOver && tasks.length > 0 && (
          <div className="py-2.5 border-2 border-dashed border-teal-500/80 bg-teal-500/10 rounded-xl text-center text-xs font-semibold text-teal-400">
            Drop here to move
          </div>
        )}
      </div>

      {/* Column Footer: Inline Quick Add */}
      <div className={`pt-3 mt-1 border-t ${isDark ? 'border-[#1F293D]' : 'border-[#E2E8F0]'}`}>
        {isAdding ? (
          <form onSubmit={handleCreateTask} className="flex flex-col gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              className={`w-full text-xs p-2.5 rounded-xl border focus:border-teal-500 focus:outline-none shadow-xs ${
                isDark
                  ? 'bg-[#090D16] text-white placeholder-slate-500 border-[#1F293D]'
                  : 'bg-white text-slate-900 placeholder-slate-400 border-slate-300'
              }`}
            />
            <div className="flex items-center gap-1.5 justify-end">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-smooth cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold transition-smooth cursor-pointer shadow-xs"
              >
                Add Task
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs rounded-xl border border-transparent transition-smooth cursor-pointer focus-ring ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-[#172033] hover:border-[#1F293D]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-300 shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        )}
      </div>
    </div>
  )
}
