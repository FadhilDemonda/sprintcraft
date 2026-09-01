import React, { useState, useRef } from 'react'
import { useStore } from '../store/useStore'
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Flag, AlertTriangle, ArrowDown, GripVertical } from 'lucide-react'
import confetti from 'canvas-confetti'

// Map priority to visual styles
const priorityConfig = {
  Urgent: { icon: AlertTriangle, color: 'text-red-500' },
  High: { icon: Flag, color: 'text-orange-500' },
  Medium: { icon: Flag, color: 'text-yellow-500' },
  Low: { icon: ArrowDown, color: 'text-slate-400' },
}

// Helper to render Category badges with dynamic pastel colors
const getCategoryColor = (category, isDark) => {
  const catColors = {
    'Frontend': isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
    'Backend': isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Database': isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200',
    'Design': isDark ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-pink-50 text-pink-600 border-pink-200',
    'Content': isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200',
    'Security': isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200',
    'AI / LLM': isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-200',
  }
  return catColors[category] || (isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200')
}

// Renders a single Task Row
const TaskRow = ({ task, isDark, onClick }) => {
  const PriorityIcon = priorityConfig[task.priority]?.icon || Circle
  const priorityColor = priorityConfig[task.priority]?.color || 'text-slate-400'

  const [isDragging, setIsDragging] = useState(false)
  const isDraggingJustNowRef = useRef(false)

  // Drag Handlers
  const handleDragStart = (e) => {
    isDraggingJustNowRef.current = true
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setTimeout(() => {
      isDraggingJustNowRef.current = false
    }, 150)
  }

  const handleClick = (e) => {
    if (isDraggingJustNowRef.current || isDragging) return
    onClick(e)
  }

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`group flex items-center justify-between py-2 px-3 sm:px-4 cursor-grab active:cursor-grabbing transition-colors border-b select-none ${
        isDragging 
          ? 'opacity-40 bg-teal-500/10 border-teal-500/30' 
          : isDark 
            ? 'border-[#1F293D] hover:bg-[#111827]' 
            : 'border-slate-100 hover:bg-slate-50'
      }`}
    >
      {/* Left: Icon & Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <GripVertical className={`w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-40 transition-opacity ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
        {task.columnId === 'done' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        ) : (
          <Circle className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-600 group-hover:text-slate-400' : 'text-slate-300 group-hover:text-slate-400'}`} />
        )}
        <span className={`text-sm truncate font-medium ${task.columnId === 'done' ? (isDark ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : ''}`}>
          {task.title}
        </span>
      </div>

      {/* Right: Assignee, Priority, Category */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0 ml-4">
        {/* Assignee Avatar */}
        <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full overflow-hidden bg-slate-200 shrink-0" title={task.assignee?.name}>
          {task.assignee?.avatar ? (
            <img src={task.assignee.avatar} alt="Assignee" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold text-slate-600">
              {task.assignee?.name?.charAt(0) || '?'}
            </span>
          )}
        </div>

        {/* Priority */}
        <div className="hidden md:flex items-center gap-1.5 w-20">
          <PriorityIcon className={`w-3.5 h-3.5 ${priorityColor}`} />
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{task.priority}</span>
        </div>
        
        {/* Story Points */}
        <div className={`hidden md:flex text-xs font-mono w-6 justify-end ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {task.storyPoints}
        </div>

        {/* Category Badge */}
        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border w-20 text-center truncate ${getCategoryColor(task.category, isDark)}`}>
          {task.category || 'Task'}
        </div>
      </div>
    </div>
  )
}

// Renders a Group of Tasks (e.g. all To Do tasks)
const TaskGroup = ({ column, tasks, isDark, openTaskDrawer, moveTask }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!isDragOver) setIsDragOver(true)
    if (!isExpanded) setIsExpanded(true) // Auto expand when hovering with dragged item
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
      className={`mb-4 transition-colors duration-200 rounded-lg ${isDragOver ? (isDark ? 'bg-[#111827] ring-1 ring-teal-500/50' : 'bg-slate-50 ring-1 ring-teal-500/50') : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Group Header */}
      <div 
        className="flex items-center gap-2 mb-1 cursor-pointer select-none group w-fit pt-2 px-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className={`p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        <div 
          className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-slate-900 shadow-sm"
          style={{ backgroundColor: column.color }}
        >
          {column.title}
        </div>
        
        <span className={`text-xs ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Tasks List */}
      {isExpanded && (
        <div className={`flex flex-col border-l-2 ml-[17px] pl-3 py-1 min-h-[40px] transition-colors ${isDragOver ? 'border-teal-400' : ''}`} style={{ borderColor: isDragOver ? undefined : `${column.color}20` }}>
          {tasks.length === 0 ? (
            <div className={`py-3 px-4 text-xs italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No tasks in this group
            </div>
          ) : (
            tasks.map(task => (
              <TaskRow 
                key={task.id} 
                task={task} 
                isDark={isDark} 
                onClick={() => openTaskDrawer(task.id)} 
              />
            ))
          )}
          
          {/* Add Task Quick Row (Visual only for mockup purposes) */}
          <div className={`flex items-center gap-3 py-2 px-3 sm:px-4 cursor-pointer transition-colors border-b border-transparent ${
            isDark ? 'hover:bg-[#111827] text-slate-500' : 'hover:bg-slate-50 text-slate-400'
          }`}>
            <div className="w-4 h-4 flex items-center justify-center font-bold text-lg leading-none shrink-0 opacity-50">+</div>
            <span className="text-sm">Add task</span>
          </div>

          {isDragOver && tasks.length > 0 && (
            <div className="py-1 mt-1 border border-dashed border-teal-500/80 bg-teal-500/10 rounded-md text-center text-[10px] font-semibold text-teal-400">
              Drop here to move to {column.title}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const ProjectListView = ({ columns, tasks }) => {
  const { theme, openTaskDrawer, moveTask } = useStore()
  const isDark = theme === 'dark'

  return (
    <div className={`flex-1 overflow-y-auto pr-2 pb-12 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      <div className={`max-w-5xl mx-auto rounded-xl border p-4 sm:p-6 ${isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-white border-slate-200 shadow-sm'}`}>
        {columns.map(column => {
          const columnTasks = tasks.filter(t => t.columnId === column.id)
          return (
            <TaskGroup 
              key={column.id} 
              column={column} 
              tasks={columnTasks} 
              isDark={isDark} 
              openTaskDrawer={openTaskDrawer}
              moveTask={moveTask}
            />
          )
        })}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 opacity-50 text-sm">
            No tasks found matching your filters.
          </div>
        )}
      </div>
    </div>
  )
}
