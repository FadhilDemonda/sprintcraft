import React, { useState } from 'react'
import { 
  CheckSquare, 
  ListTodo, 
  Layers, 
  ArrowRight, 
  Filter, 
  Folder, 
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { TaskCard } from './TaskCard'

export const MyTasksDashboard = () => {
  const { 
    tasks, 
    user, 
    projects, 
    setCurrentProject, 
    setViewMode, 
    openTaskDrawer, 
    theme 
  } = useStore()
  
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState('assigned_to_me') // 'assigned_to_me' | 'all_workspace' | 'unassigned'
  const [selectedProjectId, setSelectedProjectId] = useState('all')

  // Helper to match if task is assigned to currently logged in user
  const isAssignedToUser = (task) => {
    if (!task) return false
    if (!user) return true // In guest or non-auth state, show all

    const userName = (user.name || '').trim().toLowerCase()
    const userEmail = (user.email || '').trim().toLowerCase()
    const userId = user.id

    if (task.assignee) {
      if (typeof task.assignee === 'string') {
        const assigneeStr = task.assignee.trim().toLowerCase()
        return assigneeStr === userName || assigneeStr === userEmail
      }
      if (typeof task.assignee === 'object') {
        const aName = (task.assignee.name || '').trim().toLowerCase()
        const aEmail = (task.assignee.email || '').trim().toLowerCase()
        const aId = task.assignee.id
        return (userId && aId === userId) || (userName && aName === userName) || (userEmail && aEmail === userEmail)
      }
    }
    return false
  }

  // Filter tasks based on activeTab and selectedProjectId
  const filteredTasks = tasks.filter(t => {
    // Project filter
    if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) {
      return false
    }

    // Tab filter
    if (activeTab === 'assigned_to_me') {
      return isAssignedToUser(t)
    }
    if (activeTab === 'unassigned') {
      return !t.assignee || t.assignee.name === 'Unassigned' || t.assignee === 'Unassigned'
    }
    // 'all_workspace'
    return true
  })

  // Group tasks by status/columnId for Kanban-style overview
  const todoTasks = filteredTasks.filter(t => ['backlog', 'todo'].includes(t.columnId || t.status))
  const inProgressTasks = filteredTasks.filter(t => (t.columnId || t.status) === 'in_progress')
  const reviewTasks = filteredTasks.filter(t => (t.columnId || t.status) === 'review')
  const doneTasks = filteredTasks.filter(t => (t.columnId || t.status) === 'done')

  const getProjectName = (projectId) => {
    return projects.find(p => p.id === projectId)?.title || 'Workspace Project'
  }

  const handleGoToProject = (projectId) => {
    setCurrentProject(projectId)
    setViewMode('board')
  }

  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-200 ${
      isDark ? 'bg-[#090D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header with Title & Stats */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-xs">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Tasks</h1>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cross-workspace task tracking and synchronized agile progress for <span className="font-semibold text-teal-400">{user?.name || 'You'}</span>.
              </p>
            </div>
          </div>
          
          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400"></div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-slate-500">To Do</span>
                <span className="text-base font-extrabold">{todoTasks.length}</span>
              </div>
            </div>
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-slate-500">In Progress</span>
                <span className="text-base font-extrabold text-amber-400">{inProgressTasks.length}</span>
              </div>
            </div>
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Done</span>
                <span className="text-base font-extrabold text-emerald-400">{doneTasks.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls: Tabs & Project Dropdown */}
        <div className={`flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl border ${
          isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('assigned_to_me')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'assigned_to_me'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Assigned to Me
            </button>
            <button
              onClick={() => setActiveTab('all_workspace')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'all_workspace'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Workspace Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('unassigned')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'unassigned'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Unassigned
            </button>
          </div>

          {/* Project Filter Select */}
          <div className="flex items-center gap-2">
            <Folder className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              aria-label="Filter by project"
              className={`text-xs font-medium px-3 py-1.5 rounded-xl border focus:outline-none focus:border-teal-500 cursor-pointer ${
                isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Lists Grouped by Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Active Work (In Progress + Review) */}
          <div className="flex flex-col gap-4">
            <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2 text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                In Progress & Review
              </h2>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${isDark ? 'bg-[#172033] border-[#1F293D] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                {inProgressTasks.length + reviewTasks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {[...inProgressTasks, ...reviewTasks].length === 0 ? (
                <div className={`p-8 rounded-2xl border border-dashed text-center ${isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                  <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium">No active tasks in progress.</p>
                </div>
              ) : (
                [...inProgressTasks, ...reviewTasks].map(task => (
                  <div key={task.id} className="relative group">
                    <TaskCard task={task} />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleGoToProject(task.projectId) }}
                      className={`absolute -top-3 -right-3 p-1.5 rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-smooth translate-y-2 group-hover:translate-y-0 cursor-pointer ${isDark ? 'bg-[#172033] border-teal-500/30 text-teal-400 hover:bg-teal-500/20' : 'bg-white border-teal-200 text-teal-600 hover:bg-teal-50'}`}
                      title="Open in Project Board"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className={`mt-1.5 text-[10px] font-medium px-2 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <div className="flex items-center gap-1 truncate max-w-[200px]">
                        <Layers className="w-3 h-3 shrink-0" />
                        <span className="truncate">{getProjectName(task.projectId)}</span>
                      </div>
                      <span className="uppercase font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {task.columnId?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Up Next (Todo / Backlog) */}
          <div className="flex flex-col gap-4">
            <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2 text-teal-400">
                <ListTodo className="w-4 h-4" />
                Up Next (To Do)
              </h2>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${isDark ? 'bg-[#172033] border-[#1F293D] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                {todoTasks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {todoTasks.length === 0 ? (
                <div className={`p-8 rounded-2xl border border-dashed text-center ${isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 opacity-50 text-teal-400" />
                  <p className="text-xs font-medium">No tasks waiting in queue.</p>
                </div>
              ) : (
                todoTasks.map(task => (
                  <div key={task.id} className="relative group">
                    <TaskCard task={task} />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleGoToProject(task.projectId) }}
                      className={`absolute -top-3 -right-3 p-1.5 rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-smooth translate-y-2 group-hover:translate-y-0 cursor-pointer ${isDark ? 'bg-[#172033] border-teal-500/30 text-teal-400 hover:bg-teal-500/20' : 'bg-white border-teal-200 text-teal-600 hover:bg-teal-50'}`}
                      title="Open in Project Board"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className={`mt-1.5 text-[10px] font-medium px-2 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <div className="flex items-center gap-1 truncate max-w-[200px]">
                        <Layers className="w-3 h-3 shrink-0" />
                        <span className="truncate">{getProjectName(task.projectId)}</span>
                      </div>
                      <span className="uppercase font-mono text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        {task.columnId?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed (Done) */}
          <div className="flex flex-col gap-4">
            <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2 text-emerald-500">
                <CheckSquare className="w-4 h-4" />
                Completed Work
              </h2>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${isDark ? 'bg-[#172033] border-[#1F293D] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                {doneTasks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {doneTasks.length === 0 ? (
                <div className={`p-8 rounded-2xl border border-dashed text-center ${isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50 text-slate-500" />
                  <p className="text-xs font-medium">No completed tasks yet.</p>
                </div>
              ) : (
                doneTasks.map(task => (
                  <div key={task.id} className="relative group opacity-85 hover:opacity-100 transition-opacity">
                    <TaskCard task={task} />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleGoToProject(task.projectId) }}
                      className={`absolute -top-3 -right-3 p-1.5 rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-smooth translate-y-2 group-hover:translate-y-0 cursor-pointer ${isDark ? 'bg-[#172033] border-teal-500/30 text-teal-400 hover:bg-teal-500/20' : 'bg-white border-teal-200 text-teal-600 hover:bg-teal-50'}`}
                      title="Open in Project Board"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className={`mt-1.5 text-[10px] font-medium px-2 flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <div className="flex items-center gap-1 truncate max-w-[200px]">
                        <Layers className="w-3 h-3 shrink-0" />
                        <span className="truncate">{getProjectName(task.projectId)}</span>
                      </div>
                      <span className="uppercase font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Done
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
