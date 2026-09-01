import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, GripVertical, CheckCircle2, Flame, AlignLeft, Calendar, Trash2, Play, Check, Pencil, X, Save, ChevronDown, Folder, RotateCcw, Sparkles } from 'lucide-react'

// Helper component for a draggable task row
const TaskRow = ({ task, isDark, onTaskClick }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const priorityColors = {
    'Urgent': isDark ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-red-600 bg-red-50 border-red-200',
    'High': isDark ? 'text-pink-400 bg-pink-500/10 border-pink-500/20' : 'text-pink-600 bg-pink-50 border-pink-200',
    'Medium': isDark ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'Low': isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-200',
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onTaskClick && onTaskClick(task.id)}
      className={`flex items-center gap-3 p-3 mb-2 rounded-xl border cursor-pointer active:cursor-grabbing transition-all hover:-translate-y-0.5 hover:shadow-md ${isDark
          ? 'bg-[#111827] border-[#1F293D] hover:border-teal-500/50'
          : 'bg-white border-slate-200 hover:border-teal-400 shadow-xs'
        }`}
    >
      <GripVertical className={`w-4 h-4 shrink-0 cursor-grab ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />

      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
        task.columnId === 'done' ? 'bg-emerald-400 ring-2 ring-emerald-500/20' :
        task.columnId === 'in_progress' ? 'bg-amber-400 ring-2 ring-amber-500/20' : 'bg-slate-400'
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
              src={task.assignee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
              alt={task.assignee.name || 'User'}
              title={task.assignee.name || 'User'}
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
    addTask,
    openTaskDrawer,
    setViewMode
  } = useStore()

  const [isDragOverSprint, setIsDragOverSprint] = useState(null)
  const [editingSprintId, setEditingSprintId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', startDate: '', endDate: '' })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Inline Issue Creator states
  const [isCreatingBacklogIssue, setIsCreatingBacklogIssue] = useState(false)
  const [newBacklogTitle, setNewBacklogTitle] = useState('')
  const [newBacklogPriority, setNewBacklogPriority] = useState('Medium')
  const [newBacklogPoints, setNewBacklogPoints] = useState('3')
  const [newBacklogCategory, setNewBacklogCategory] = useState('Feature')

  const [creatingSprintIssueId, setCreatingSprintIssueId] = useState(null)
  const [newSprintIssueTitle, setNewSprintIssueTitle] = useState('')
  const [newSprintIssuePriority, setNewSprintIssuePriority] = useState('Medium')
  const [newSprintIssuePoints, setNewSprintIssuePoints] = useState('3')

  const isDark = theme === 'dark'
  const project = projects.find(p => p.id === currentProjectId) || projects[0]

  if (!project) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors duration-200 ${isDark ? 'bg-[#090D16] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
        <h2 className="text-xl font-bold mb-2">No Project Selected</h2>
        <p className={`text-xs mb-6 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Create a project or switch workspace to start planning your sprint backlog.
        </p>
        <button
          onClick={() => setViewMode('dashboard')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-md"
        >
          Go to Projects Dashboard
        </button>
      </div>
    )
  }

  const projectTasks = tasks.filter(t => t.projectId === project.id)
  const projectSprints = sprints.filter(s => s.projectId === project.id).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
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

  // Handle creating issue directly in Product Backlog
  const handleCreateBacklogIssue = () => {
    if (!newBacklogTitle.trim()) return
    const newTask = addTask({
      projectId: project.id,
      sprintId: null,
      columnId: 'backlog',
      status: 'backlog',
      title: newBacklogTitle.trim(),
      priority: newBacklogPriority,
      category: newBacklogCategory,
      storyPoints: Number(newBacklogPoints) || 3,
    })
    setNewBacklogTitle('')
    setIsCreatingBacklogIssue(false)
  }

  // Handle creating issue directly into a specific Sprint
  const handleCreateSprintIssue = (sprintId) => {
    if (!newSprintIssueTitle.trim()) return
    const newTask = addTask({
      projectId: project.id,
      sprintId: sprintId,
      columnId: 'todo',
      status: 'todo',
      title: newSprintIssueTitle.trim(),
      priority: newSprintIssuePriority,
      category: 'Feature',
      storyPoints: Number(newSprintIssuePoints) || 3,
    })
    setNewSprintIssueTitle('')
    setCreatingSprintIssueId(null)
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
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all shadow-sm cursor-pointer ${
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
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                            project.id === p.id 
                              ? (isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600')
                              : (isDark ? 'text-slate-300 hover:bg-[#172033]' : 'text-slate-700 hover:bg-slate-50')
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            project.id === p.id 
                              ? (isDark ? 'border-teal-500/30 bg-teal-500/10' : 'border-teal-200 bg-teal-50')
                              : (isDark ? 'border-[#1F293D] bg-[#0B1120]' : 'border-slate-200 bg-white')
                          }`}>
                            <Folder className={`w-4 h-4 ${project.id === p.id ? 'text-teal-500' : (isDark ? 'text-slate-500' : 'text-slate-400')}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-bold truncate">{p.title}</span>
                            {p.sprint && <span className={`block text-xs truncate mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{p.sprint}</span>}
                          </div>
                          {project.id === p.id && <Check className="w-4 h-4 shrink-0" />}
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
              projectId: project.id,
              name: `Sprint ${sprintNum}`,
            })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer"
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
            <button 
              onClick={() => setIsCreatingBacklogIssue(!isCreatingBacklogIssue)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                isCreatingBacklogIssue 
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : isDark ? 'bg-[#1F293D] hover:bg-[#2D3B54] text-white' : 'bg-white border hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreatingBacklogIssue ? 'Close Form' : 'Create Issue'}</span>
            </button>
          </div>

          <div className="p-4">
            {/* Inline Issue Creator Card for Product Backlog */}
            {isCreatingBacklogIssue && (
              <div className={`p-4 mb-4 rounded-2xl border transition-all shadow-md animate-fade-in ${
                isDark ? 'bg-[#111827] border-teal-500/40' : 'bg-white border-teal-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    New Backlog Issue
                  </span>
                  <button 
                    onClick={() => setIsCreatingBacklogIssue(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={newBacklogTitle}
                  onChange={e => setNewBacklogTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleCreateBacklogIssue()
                    if (e.key === 'Escape') setIsCreatingBacklogIssue(false)
                  }}
                  placeholder="What needs to be done? (e.g. Implement OAuth login with GitHub)"
                  autoFocus
                  className={`w-full px-3.5 py-2.5 text-sm font-medium rounded-xl border focus:outline-none focus:border-teal-500 transition-smooth ${
                    isDark ? 'bg-[#090D16] border-[#1F293D] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />

                <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <select
                      value={newBacklogPriority}
                      onChange={e => setNewBacklogPriority(e.target.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                        isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-700'
                      }`}
                    >
                      <option value="Low">Priority: Low</option>
                      <option value="Medium">Priority: Medium</option>
                      <option value="High">Priority: High</option>
                      <option value="Urgent">Priority: Urgent</option>
                    </select>

                    <select
                      value={newBacklogPoints}
                      onChange={e => setNewBacklogPoints(e.target.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                        isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-700'
                      }`}
                    >
                      <option value="1">1 Point</option>
                      <option value="2">2 Points</option>
                      <option value="3">3 Points</option>
                      <option value="5">5 Points</option>
                      <option value="8">8 Points</option>
                      <option value="13">13 Points</option>
                    </select>

                    <select
                      value={newBacklogCategory}
                      onChange={e => setNewBacklogCategory(e.target.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                        isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-700'
                      }`}
                    >
                      <option value="Feature">Category: Feature</option>
                      <option value="Frontend">Category: Frontend</option>
                      <option value="Backend">Category: Backend</option>
                      <option value="Database">Category: Database</option>
                      <option value="Bug">Category: Bug</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCreatingBacklogIssue(false)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateBacklogIssue}
                      disabled={!newBacklogTitle.trim()}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      Add Issue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {backlogTasks.length > 0 ? (
              backlogTasks.map(task => (
                <TaskRow key={task.id} task={task} isDark={isDark} onTaskClick={openTaskDrawer} />
              ))
            ) : !isCreatingBacklogIssue && (
              <div className={`flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed ${
                isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-200 text-slate-400'
              }`}>
                <p className="text-sm font-medium mb-3">Your product backlog is empty.</p>
                <button
                  onClick={() => setIsCreatingBacklogIssue(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/30 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Issue</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sprints Section */}
        {projectSprints.map(sprint => {
          const sprintTasks = projectTasks.filter(t => t.sprintId === sprint.id)
          const totalPoints = sprintTasks.reduce((sum, t) => sum + (Number(t.storyPoints) || 0), 0)
          const isCreatingInThisSprint = creatingSprintIssueId === sprint.id

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
                      className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSprintId(null)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#1F293D]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
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
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Complete Sprint
                          </button>
                        ) : sprint.status === 'planned' ? (
                          <button
                            onClick={() => {
                              updateSprint(sprint.id, { status: 'active' })
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Start Sprint
                          </button>
                        ) : (
                          <button
                            onClick={() => updateSprint(sprint.id, { status: 'planned' })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${isDark
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
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-slate-500 hover:text-teal-400 hover:bg-teal-500/10' : 'text-slate-400 hover:text-teal-500 hover:bg-teal-50'}`}
                          title="Edit Sprint"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteSprint(sprint.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
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
                {/* Inline Quick Add for this Sprint */}
                {isCreatingInThisSprint && (
                  <div className={`p-3.5 mb-3 rounded-xl border transition-all shadow-md animate-fade-in ${
                    isDark ? 'bg-[#111827] border-teal-500/40' : 'bg-white border-teal-300'
                  }`}>
                    <input
                      type="text"
                      value={newSprintIssueTitle}
                      onChange={e => setNewSprintIssueTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleCreateSprintIssue(sprint.id)
                        if (e.key === 'Escape') setCreatingSprintIssueId(null)
                      }}
                      placeholder={`Add issue to ${sprint.name}... (Press Enter)`}
                      autoFocus
                      className={`w-full px-3 py-2 text-sm font-medium rounded-lg border focus:outline-none focus:border-teal-500 ${
                        isDark ? 'bg-[#090D16] border-[#1F293D] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <div className="flex items-center justify-between mt-2.5 gap-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={newSprintIssuePriority}
                          onChange={e => setNewSprintIssuePriority(e.target.value)}
                          className={`text-xs px-2 py-1 rounded-md border focus:outline-none ${
                            isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-200' : 'bg-white border-slate-300 text-slate-700'
                          }`}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                        <select
                          value={newSprintIssuePoints}
                          onChange={e => setNewSprintIssuePoints(e.target.value)}
                          className={`text-xs px-2 py-1 rounded-md border focus:outline-none ${
                            isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-200' : 'bg-white border-slate-300 text-slate-700'
                          }`}
                        >
                          <option value="1">1 pt</option>
                          <option value="2">2 pts</option>
                          <option value="3">3 pts</option>
                          <option value="5">5 pts</option>
                          <option value="8">8 pts</option>
                          <option value="13">13 pts</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCreatingSprintIssueId(null)}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleCreateSprintIssue(sprint.id)}
                          disabled={!newSprintIssueTitle.trim()}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-md shadow-xs cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {sprintTasks.length > 0 ? (
                  sprintTasks.map(task => (
                    <TaskRow key={task.id} task={task} isDark={isDark} onTaskClick={openTaskDrawer} />
                  ))
                ) : !isCreatingInThisSprint && (
                  <div className={`flex items-center justify-between p-4 rounded-xl border-2 border-dashed ${
                    isDragOverSprint === sprint.id
                      ? 'border-teal-500/50 bg-teal-500/10 text-teal-400 font-semibold'
                      : isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-200 text-slate-400'
                  }`}>
                    <span className="text-xs">Drag tasks here from backlog, or:</span>
                    <button
                      onClick={() => setCreatingSprintIssueId(sprint.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-teal-500 hover:text-teal-400 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Task Directly
                    </button>
                  </div>
                )}

                {!isCreatingInThisSprint && sprintTasks.length > 0 && (
                  <button
                    onClick={() => setCreatingSprintIssueId(sprint.id)}
                    className={`w-full mt-2 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl border border-dashed transition-all cursor-pointer ${
                      isDark 
                        ? 'border-[#1F293D] hover:border-teal-500/50 hover:bg-[#111827] text-slate-400 hover:text-teal-400' 
                        : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50 text-slate-500 hover:text-teal-600'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task to {sprint.name}</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}
