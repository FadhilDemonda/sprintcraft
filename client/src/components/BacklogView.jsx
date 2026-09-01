import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, GripVertical, CheckCircle2, Flame, AlignLeft, Calendar, Trash2, Play, Check, Pencil, X, Save, ChevronDown, Folder, RotateCcw } from 'lucide-react'

// Helper component for a draggable task row
const TaskRow = ({ task, isDark }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const priorityColors = {
    'High': isDark ? 'text-pink-400 bg-pink-500/10 border-pink-500/20' : 'text-pink-600 bg-pink-50 border-pink-200',
    'Medium': isDark ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'Low': isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-200',
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`flex items-center gap-3 p-3 mb-2 rounded-xl border cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 hover:shadow-md ${isDark
          ? 'bg-[#111827] border-[#1F293D] hover:border-teal-500/50'
          : 'bg-white border-slate-200 hover:border-teal-400'
        }`}
    >
      <GripVertical className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />

      <div className={`w-2 h-2 rounded-full shrink-0 ${task.columnId === 'done' ? 'bg-emerald-400' :
          task.columnId === 'in_progress' ? 'bg-amber-400' : 'bg-slate-400'
        }`} />

      <div className="flex-1 flex items-center justify-between min-w-0 gap-4">
        <span className={`font-medium text-sm truncate ${task.columnId === 'done' ? (isDark ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : ''}`}>
          {task.title}
        </span>

        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors['Medium']}`}>
            {task.priority}
          </span>
          <div className={`flex items-center gap-1 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="font-bold">{task.storyPoints}</span> pts
          </div>
          {task.assignee && (
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              title={task.assignee.name}
              className={`w-6 h-6 rounded-full object-cover border-2 ${isDark ? 'border-[#111827]' : 'border-white'}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export const BacklogView = () => {
  const {
    theme,
    currentProjectId,
    projects,
    tasks,
    sprints,
    moveTaskToSprint,
    addSprint,
    updateSprint,
    deleteSprint,
    setViewMode
  } = useStore()

  const [isDragOverSprint, setIsDragOverSprint] = useState(null)
  const [editingSprintId, setEditingSprintId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', startDate: '', endDate: '' })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isDark = theme === 'dark'
  const project = projects.find(p => p.id === currentProjectId)

  if (!project) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors duration-200 ${isDark ? 'bg-[#090D16] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
        <h2 className="text-xl font-bold mb-2">No Project Selected</h2>
        <button
          onClick={() => setViewMode('dashboard')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl"
        >
          Go to Projects Dashboard
        </button>
      </div>
    )
  }

  const projectTasks = tasks.filter(t => t.projectId === currentProjectId)
  const projectSprints = sprints.filter(s => s.projectId === currentProjectId).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  const backlogTasks = projectTasks.filter(t => !t.sprintId)

  const handleDragOver = (e, targetId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (isDragOverSprint !== targetId) setIsDragOverSprint(targetId)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOverSprint(null)
    }
  }

  const handleDrop = (e, sprintId) => {
    e.preventDefault()
    setIsDragOverSprint(null)
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      moveTaskToSprint(taskId, sprintId)
    }
  }

  return (
    <div className={`flex-1 overflow-y-auto p-6 transition-colors duration-200 ${isDark ? 'bg-[#090D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-30">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Sprint Planning</h1>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Plan your upcoming work for:
            </span>
            
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all shadow-sm ${
                  isDark 
                    ? 'bg-[#111827] border-[#1F293D] hover:border-teal-500/50 text-white' 
                    : 'bg-white border-slate-200 hover:border-teal-400 text-slate-900'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                  <Folder className="w-3 h-3" />
                </div>
                <span className="font-bold text-sm truncate max-w-[200px]">
                  {project.title}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className={`absolute top-full mt-2 w-72 rounded-2xl border shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
                    isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider border-b ${isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                      Select Project Workspace
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1.5">
                      {projects.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            useStore.setState({ currentProjectId: p.id })
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                            currentProjectId === p.id 
                              ? (isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600')
                              : (isDark ? 'text-slate-300 hover:bg-[#172033]' : 'text-slate-700 hover:bg-slate-50')
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            currentProjectId === p.id 
                              ? (isDark ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50')
                              : (isDark ? 'border-[#1F293D] bg-[#0B1120]' : 'border-slate-200 bg-white')
                          }`}>
                            <Folder className={`w-4 h-4 ${currentProjectId === p.id ? 'text-teal-500' : (isDark ? 'text-slate-500' : 'text-slate-400')}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-bold truncate">{p.title}</span>
                            {p.sprint && <span className={`block text-xs truncate mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{p.sprint}</span>}
                          </div>
                          {currentProjectId === p.id && <Check className="w-4 h-4 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            const sprintNum = projectSprints.length + 1
            addSprint({
              projectId: currentProjectId,
              name: `Sprint ${sprintNum} (New)`,
            })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Sprint
        </button>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">

        {/* Product Backlog Section */}
        <div
          onDragOver={(e) => handleDragOver(e, 'backlog')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, null)}
          className={`rounded-2xl border transition-all duration-200 ${isDragOverSprint === 'backlog'
              ? 'ring-2 ring-pink-500/80 border-pink-500 bg-pink-500/5'
              : isDark ? 'bg-[#0B1120] border-[#1F293D]' : 'bg-slate-50 border-slate-200'
            }`}
        >
          <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">Product Backlog</h3>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#1F293D] text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
                {backlogTasks.length} issues
              </span>
            </div>
            <button className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'bg-[#1F293D] hover:bg-[#2D3B54] text-white' : 'bg-white border hover:bg-slate-50 text-slate-700'
              }`}>
              <Plus className="w-3.5 h-3.5" />
              Create Issue
            </button>
          </div>

          <div className="p-4">
            {backlogTasks.length > 0 ? (
              backlogTasks.map(task => (
                <TaskRow key={task.id} task={task} isDark={isDark} />
              ))
            ) : (
              <div className={`flex items-center justify-center h-32 rounded-xl border-2 border-dashed ${isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-200 text-slate-400'
                }`}>
                Your backlog is empty.
              </div>
            )}
          </div>
        </div>

        {/* Sprints Section */}
        {projectSprints.map(sprint => {
          const sprintTasks = projectTasks.filter(t => t.sprintId === sprint.id)
          const totalPoints = sprintTasks.reduce((sum, t) => sum + (Number(t.storyPoints) || 0), 0)

          return (
            <div
              key={sprint.id}
              onDragOver={(e) => handleDragOver(e, sprint.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, sprint.id)}
              className={`rounded-2xl border transition-all duration-200 ${isDragOverSprint === sprint.id
                  ? 'ring-2 ring-teal-500/80 border-teal-500 bg-teal-500/5'
                  : isDark ? 'bg-[#0B1120]/80 border-[#1F293D] shadow-sm backdrop-blur-sm' : 'bg-white border-slate-200 shadow-sm'
                }`}
            >
              <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-[#1F293D]' : 'border-slate-100'}`}>
                {editingSprintId === sprint.id ? (
                  <div className="flex-1 flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus:border-teal-500 ${isDark ? 'bg-[#172033] border-[#1F293D] text-white' : 'bg-white border-slate-200'}`}
                    />
                    <input
                      type="date"
                      value={editForm.startDate}
                      onChange={e => setEditForm({ ...editForm, startDate: e.target.value })}
                      className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus:border-teal-500 ${isDark ? 'bg-[#172033] border-[#1F293D] text-white text-xs' : 'bg-white border-slate-200 text-xs'}`}
                    />
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>-</span>
                    <input
                      type="date"
                      value={editForm.endDate}
                      onChange={e => setEditForm({ ...editForm, endDate: e.target.value })}
                      className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus:border-teal-500 ${isDark ? 'bg-[#172033] border-[#1F293D] text-white text-xs' : 'bg-white border-slate-200 text-xs'}`}
                    />
                    <button
                      onClick={() => {
                        updateSprint(sprint.id, editForm)
                        setEditingSprintId(null)
                      }}
                      className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSprintId(null)}
                      className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#1F293D]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold">{sprint.name}</h3>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${sprint.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : sprint.status === 'completed'
                            ? (isDark ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-purple-50 text-purple-600 border border-purple-200')
                            : isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                        {sprint.status.toUpperCase()}
                      </span>
                      <div className={`flex items-center gap-1.5 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{sprint.startDate} - {sprint.endDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-mono font-bold ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                        {totalPoints} pts
                      </span>

                      <div className="flex items-center gap-2">
                        {sprint.status === 'active' ? (
                          <button
                            onClick={() => updateSprint(sprint.id, { status: 'completed' })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Complete Sprint
                          </button>
                        ) : sprint.status === 'planned' ? (
                          <button
                            onClick={() => {
                              updateSprint(sprint.id, { status: 'active' })
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Start Sprint
                          </button>
                        ) : (
                          <button
                            onClick={() => updateSprint(sprint.id, { status: 'planned' })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${isDark
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                              }`}
                            title="Reset sprint status back to planned"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Start Over
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setEditingSprintId(sprint.id)
                            setEditForm({ name: sprint.name, startDate: sprint.startDate, endDate: sprint.endDate })
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-500 hover:text-teal-400 hover:bg-teal-500/10' : 'text-slate-400 hover:text-teal-500 hover:bg-teal-50'}`}
                          title="Edit Sprint"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteSprint(sprint.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                          title="Delete Sprint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4">
                {sprintTasks.length > 0 ? (
                  sprintTasks.map(task => (
                    <TaskRow key={task.id} task={task} isDark={isDark} />
                  ))
                ) : (
                  <div className={`flex items-center justify-center h-20 rounded-xl border-2 border-dashed ${isDragOverSprint === sprint.id
                      ? 'border-teal-500/50 bg-teal-500/10 text-teal-400 font-semibold'
                      : isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-200 text-slate-400'
                    }`}>
                    Drop tasks here to plan this sprint
                  </div>
                )}
              </div>
            </div>
          )
        })}



      </div>
    </div>
  )
}
