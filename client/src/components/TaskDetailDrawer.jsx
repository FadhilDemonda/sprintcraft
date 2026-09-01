import React, { useState, useEffect } from 'react'
import {
  X,
  Trash2,
  Check,
  Sparkles,
  Plus,
  MessageSquare,
  CheckSquare,
  User,
  UserCheck,
  UserMinus,
  Calendar,
  AlertCircle,
  Tag,
  Hash,
  ChevronDown
} from 'lucide-react'
import { useStore } from '../store/useStore'

export const TaskDetailDrawer = () => {
  const {
    isTaskDrawerOpen,
    closeTaskDrawer,
    selectedTaskId,
    tasks,
    updateTask,
    deleteTask,
    toggleAcceptanceCriterion,
    addAcceptanceCriterion,
    addComment,
    columns,
    user,
    theme
  } = useStore()

  const isDark = theme === 'dark'
  const task = tasks.find((t) => t.id === selectedTaskId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Frontend')
  const [priority, setPriority] = useState('Medium')
  const [storyPoints, setStoryPoints] = useState(3)
  const [columnId, setColumnId] = useState('backlog')
  const [assignee, setAssignee] = useState(null)
  const [newAcText, setNewAcText] = useState('')
  const [newCommentText, setNewCommentText] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setCategory(task.category || 'Frontend')
      setPriority(task.priority || 'Medium')
      setStoryPoints(task.storyPoints || 3)
      setColumnId(task.columnId || 'backlog')
      setAssignee(task.assignee || { name: 'Unassigned', avatar: '', role: 'Unassigned' })
    }
  }, [task])

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isTaskDrawerOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeTaskDrawer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isTaskDrawerOpen, closeTaskDrawer])

  if (!isTaskDrawerOpen || !task) return null

  const handleSave = () => {
    updateTask(task.id, {
      title,
      description,
      category,
      priority,
      storyPoints: Number(storyPoints),
      columnId,
      assignee
    })
    closeTaskDrawer()
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id)
    }
  }

  const handleAddAc = (e) => {
    e.preventDefault()
    if (!newAcText.trim()) return
    addAcceptanceCriterion(task.id, newAcText)
    setNewAcText('')
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newCommentText.trim()) return
    addComment(task.id, newCommentText)
    setNewCommentText('')
  }

  const handleAssignToMe = () => {
    const me = {
      id: user?.id || 'user-me',
      name: user?.name || 'Me',
      email: user?.email || '',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: user?.role || 'Lead Engineer'
    }
    setAssignee(me)
  }

  const handleUnassign = () => {
    setAssignee({ name: 'Unassigned', avatar: '', role: 'Unassigned' })
  }

  const isAssignedToMe = () => {
    if (!assignee || !user) return false
    const myName = (user.name || '').trim().toLowerCase()
    const myEmail = (user.email || '').trim().toLowerCase()
    const myId = user.id
    
    if (typeof assignee === 'string') {
      const a = assignee.trim().toLowerCase()
      return a === myName || a === myEmail
    }
    return (myId && assignee.id === myId) || 
           (myName && assignee.name?.toLowerCase() === myName) || 
           (myEmail && assignee.email?.toLowerCase() === myEmail)
  }

  const isUnassigned = !assignee || assignee.name === 'Unassigned' || assignee === 'Unassigned'

  const completedAcCount = task.acceptanceCriteria?.filter((ac) => ac.completed).length || 0
  const totalAcCount = task.acceptanceCriteria?.length || 0
  const progressPercent = totalAcCount > 0 ? (completedAcCount / totalAcCount) * 100 : 0

  const categories = ['Frontend', 'Backend', 'Database', 'Security', 'AI / LLM', 'Planning', 'DevOps']
  const priorities = ['High', 'Medium', 'Low']

  const teamPresets = [
    { name: 'Unassigned', role: 'None', avatar: '' },
    ...(user ? [{ name: user.name || 'Me (You)', role: user.role || 'Lead Engineer', avatar: user.avatar || '' }] : []),
    { name: 'Sarah Chen', role: 'Backend Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
    { name: 'Alex Rivera', role: 'Frontend Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
    { name: 'Elena Rostova', role: 'AI Specialist', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
    { name: 'Marcus Vance', role: 'DevOps Architect', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
  ]

  return (
    <div 
      onClick={closeTaskDrawer}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end cursor-pointer"
    >

      {/* Drawer Card */}
      <div
        className={`w-full max-w-xl h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200 border-l cursor-default ${isDark
          ? 'bg-[#111827] border-[#1F293D] text-[#F8FAFC]'
          : 'bg-white border-[#E2E8F0] text-[#0F172A]'
          }`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Top Action Bar */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-[#1F293D] bg-[#111827]' : 'border-[#E2E8F0] bg-white'
          }`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/30">
              #{task.id.slice(-4).toUpperCase()}
            </span>
            {task.isAiGenerated && (
              <span className="flex items-center gap-1 text-[11px] text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>AI Generated</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-smooth cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeTaskDrawer}
              className={`p-2 rounded-xl transition-smooth cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* Editable Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-teal-500 uppercase tracking-wider">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full text-base sm:text-lg font-bold p-3 rounded-xl border focus:border-teal-500 focus:outline-none shadow-xs ${isDark
                ? 'bg-[#090D16] text-white border-[#1F293D]'
                : 'bg-slate-50 text-slate-900 border-slate-300'
                }`}
            />
          </div>

          {/* Quick Meta Controls Grid */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl border ${isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-50 border-slate-200'
            }`}>

            {/* Status / Column */}
            <div className="flex flex-col gap-1">
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Status</span>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className={`text-xs p-2 rounded-xl border focus:border-teal-500 focus:outline-none cursor-pointer ${isDark ? 'bg-[#111827] text-white border-[#1F293D]' : 'bg-white text-slate-800 border-slate-300'
                  }`}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`text-xs p-2 rounded-xl border focus:border-teal-500 focus:outline-none cursor-pointer ${isDark ? 'bg-[#111827] text-white border-[#1F293D]' : 'bg-white text-slate-800 border-slate-300'
                  }`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1">
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`text-xs p-2 rounded-xl border focus:border-teal-500 focus:outline-none cursor-pointer ${isDark ? 'bg-[#111827] text-white border-[#1F293D]' : 'bg-white text-slate-800 border-slate-300'
                  }`}
              >
                {priorities.map((pri) => (
                  <option key={pri} value={pri}>
                    {pri}
                  </option>
                ))}
              </select>
            </div>

            {/* Story Points */}
            <div className="flex flex-col gap-1">
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Estimate</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="21"
                  value={storyPoints}
                  onChange={(e) => setStoryPoints(e.target.value)}
                  className={`w-full font-mono font-bold text-xs p-2 rounded-xl border focus:border-teal-500 focus:outline-none text-center ${isDark ? 'bg-[#111827] text-teal-400 border-[#1F293D]' : 'bg-white text-teal-700 border-slate-300'
                    }`}
                />
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>pts</span>
              </div>
            </div>

          </div>

          {/* Interactive Assignee Section */}
          <div className={`p-4 rounded-2xl border flex flex-col gap-3.5 transition-all ${
            isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-teal-400" />
                <span className="text-[11px] font-bold text-teal-500 uppercase tracking-wider">
                  Assigned Engineer
                </span>
              </div>

              {/* Assign to Me / Unassign Quick Buttons */}
              <div className="flex items-center gap-2">
                {!isAssignedToMe() && (
                  <button
                    type="button"
                    onClick={handleAssignToMe}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign to Me</span>
                  </button>
                )}

                {!isUnassigned && (
                  <button
                    type="button"
                    onClick={handleUnassign}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title="Remove assignment"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Unassign</span>
                  </button>
                )}
              </div>
            </div>

            {/* Assignee Card & Selector */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {assignee?.avatar ? (
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/40 shrink-0"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm shrink-0 ${
                    isUnassigned
                      ? (isDark ? 'bg-[#172033] border-[#1F293D] text-slate-500' : 'bg-slate-200 border-slate-300 text-slate-500')
                      : 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                  }`}>
                    {assignee?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{assignee?.name || 'Unassigned'}</span>
                    {isAssignedToMe() && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400">
                        You
                      </span>
                    )}
                  </div>
                  <span className={`text-xs block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {assignee?.role || (isUnassigned ? 'No one assigned yet' : 'Engineer')}
                  </span>
                </div>
              </div>

              {/* Quick Select Teammate Dropdown */}
              <div className="relative">
                <select
                  value={assignee?.name || 'Unassigned'}
                  onChange={(e) => {
                    const selected = teamPresets.find(p => p.name === e.target.value)
                    if (selected) {
                      if (selected.name === 'Unassigned') {
                        handleUnassign()
                      } else if (selected.name === (user?.name || 'Me (You)')) {
                        handleAssignToMe()
                      } else {
                        setAssignee(selected)
                      }
                    }
                  }}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border focus:outline-none focus:border-teal-500 cursor-pointer ${
                    isDark ? 'bg-[#111827] text-slate-200 border-[#1F293D]' : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  {teamPresets.map((member, idx) => (
                    <option key={idx} value={member.name}>
                      {member.name} {member.role !== 'None' ? `(${member.role})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-teal-500 uppercase tracking-wider">
              Description & Context
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add technical context, API specifications, or implementation notes..."
              className={`w-full text-xs p-3.5 rounded-2xl border focus:border-teal-500 focus:outline-none resize-none leading-relaxed shadow-xs ${isDark
                ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500'
                : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                }`}
            />
          </div>

          {/* Acceptance Criteria Checklist */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-teal-500" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Acceptance Criteria
                </span>
              </div>
              <span className="text-xs font-mono text-teal-500 font-bold">
                {completedAcCount} / {totalAcCount} Done
              </span>
            </div>

            {/* AC Progress Bar */}
            <div className={`w-full h-2 rounded-full overflow-hidden border ${isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-100 border-slate-200'
              }`}>
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Criteria List */}
            <div className="flex flex-col gap-2">
              {task.acceptanceCriteria?.map((ac) => (
                <div
                  key={ac.id}
                  onClick={() => toggleAcceptanceCriterion(task.id, ac.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border transition-smooth cursor-pointer select-none ${ac.completed
                    ? isDark ? 'bg-[#090D16]/60 border-[#1F293D] text-slate-500 line-through' : 'bg-slate-100/70 border-slate-200 text-slate-400 line-through'
                    : isDark ? 'bg-[#090D16] border-[#1F293D] text-white hover:border-teal-500/50' : 'bg-white border-slate-200 text-slate-800 hover:border-teal-500/40'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={ac.completed}
                    onChange={() => { }}
                    className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-0 cursor-pointer accent-teal-600"
                  />
                  <span className="text-xs leading-relaxed font-medium">
                    {ac.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Add new AC inline */}
            <form onSubmit={handleAddAc} className="flex gap-2 mt-1">
              <input
                type="text"
                value={newAcText}
                onChange={(e) => setNewAcText(e.target.value)}
                placeholder="Add acceptance criterion..."
                className={`flex-1 text-xs p-2.5 rounded-xl border focus:border-teal-500 focus:outline-none ${isDark
                  ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500'
                  : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                  }`}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition-smooth cursor-pointer shadow-xs"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Activity / Comments Feed */}
          <div className={`flex flex-col gap-3 pt-4 border-t ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Activity & Comments
              </span>
            </div>

            {/* Existing comments */}
            <div className="flex flex-col gap-2.5">
              {task.comments?.map((c) => (
                <div key={c.id} className={`p-3.5 rounded-2xl border flex flex-col gap-1 ${isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold">{c.author}</span>
                    <span className={`font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.createdAt}</span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{c.text}</p>
                </div>
              ))}

              {(!task.comments || task.comments.length === 0) && (
                <span className="text-xs opacity-50 italic">No activity yet on this task</span>
              )}
            </div>

            {/* Post comment */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment or update..."
                className={`flex-1 text-xs p-2.5 rounded-xl border focus:border-teal-500 focus:outline-none ${isDark
                  ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500'
                  : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                  }`}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition-smooth cursor-pointer shadow-md"
              >
                Send
              </button>
            </form>
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
          }`}>
          <button
            onClick={closeTaskDrawer}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-smooth cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition-smooth cursor-pointer active:scale-95 shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

      </div>

    </div>
  )
}
