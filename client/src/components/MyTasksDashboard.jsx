import React from 'react'
import { CheckSquare, ListTodo, Layers, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { TaskCard } from './TaskCard'

export const MyTasksDashboard = () => {
  const { tasks, user, projects, setCurrentProject, setViewMode, theme } = useStore()
  const isDark = theme === 'dark'

  // Filter tasks assigned to current user
  const myTasks = tasks.filter(t => t.assignee?.name === user?.name)
  
  // Group tasks by status/columnId for better visualization
  const todoTasks = myTasks.filter(t => ['backlog', 'todo'].includes(t.columnId))
  const inProgressTasks = myTasks.filter(t => t.columnId === 'in_progress')
  const reviewTasks = myTasks.filter(t => t.columnId === 'review')
  const doneTasks = myTasks.filter(t => t.columnId === 'done')

  const getProjectName = (projectId) => {
    return projects.find(p => p.id === projectId)?.title || 'Unknown Project'
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
        
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-xs">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Tasks</h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Overview of all your assigned tasks across workspaces.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex flex-col items-center p-3 rounded-2xl border ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
              <span className="text-xs font-semibold text-slate-500 uppercase">To Do</span>
              <span className="text-xl font-bold text-teal-500">{todoTasks.length}</span>
            </div>
            <div className={`flex flex-col items-center p-3 rounded-2xl border ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}>
              <span className="text-xs font-semibold text-slate-500 uppercase">In Progress</span>
              <span className="text-xl font-bold text-amber-500">{inProgressTasks.length}</span>
            </div>
          </div>
        </div>

        {/* Task Lists Grouped by Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Active Work (In Progress + Review) */}
          <div className="flex flex-col gap-4">
            <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2 text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Active Work
              </h2>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${isDark ? 'bg-[#172033] border-[#1F293D] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                {inProgressTasks.length + reviewTasks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {[...inProgressTasks, ...reviewTasks].length === 0 ? (
                <div className={`p-8 rounded-2xl border border-dashed text-center ${isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                  <p className="text-sm">No active tasks right now.</p>
                </div>
              ) : (
                [...inProgressTasks, ...reviewTasks].map(task => (
                  <div key={task.id} className="relative group">
                    <TaskCard task={task} />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleGoToProject(task.projectId) }}
                      className={`absolute -top-3 -right-3 p-1.5 rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-smooth translate-y-2 group-hover:translate-y-0 ${isDark ? 'bg-[#172033] border-teal-500/30 text-teal-400 hover:bg-teal-500/20' : 'bg-white border-teal-200 text-teal-600 hover:bg-teal-50'}`}
                      title="Go to Project Board"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className={`mt-1.5 text-[10px] font-medium px-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Layers className="w-3 h-3" />
                      <span>{getProjectName(task.projectId)}</span>
                      <span className="opacity-50 mx-1">•</span>
                      <span className="uppercase">{task.columnId.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Up Next (Todo) */}
          <div className="flex flex-col gap-4">
            <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2 text-blue-400">
                <ListTodo className="w-4 h-4" />
                Up Next
              </h2>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${isDark ? 'bg-[#172033] border-[#1F293D] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                {todoTasks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {todoTasks.length === 0 ? (
                <div className={`p-8 rounded-2xl border border-dashed text-center ${isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                  <p className="text-sm">Your backlog is clear! ✨</p>
                </div>
              ) : (
                todoTasks.map(task => (
                  <div key={task.id} className="relative group">
                    <TaskCard task={task} />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleGoToProject(task.projectId) }}
                      className={`absolute -top-3 -right-3 p-1.5 rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-smooth translate-y-2 group-hover:translate-y-0 ${isDark ? 'bg-[#172033] border-teal-500/30 text-teal-400 hover:bg-teal-500/20' : 'bg-white border-teal-200 text-teal-600 hover:bg-teal-50'}`}
                      title="Go to Project Board"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className={`mt-1.5 text-[10px] font-medium px-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Layers className="w-3 h-3" />
                      <span>{getProjectName(task.projectId)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recently Done */}
          <div className="flex flex-col gap-4">
            <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2 text-emerald-500">
                <CheckSquare className="w-4 h-4" />
                Recently Done
              </h2>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${isDark ? 'bg-[#172033] border-[#1F293D] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                {doneTasks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {doneTasks.length === 0 ? (
                <div className={`p-8 rounded-2xl border border-dashed text-center ${isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                  <p className="text-sm">No completed tasks yet.</p>
                </div>
              ) : (
                doneTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="relative group opacity-80 hover:opacity-100 transition-opacity">
                    <TaskCard task={task} />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleGoToProject(task.projectId) }}
                      className={`absolute -top-3 -right-3 p-1.5 rounded-lg border shadow-lg opacity-0 group-hover:opacity-100 transition-smooth translate-y-2 group-hover:translate-y-0 ${isDark ? 'bg-[#172033] border-teal-500/30 text-teal-400 hover:bg-teal-500/20' : 'bg-white border-teal-200 text-teal-600 hover:bg-teal-50'}`}
                      title="Go to Project Board"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className={`mt-1.5 text-[10px] font-medium px-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Layers className="w-3 h-3" />
                      <span>{getProjectName(task.projectId)}</span>
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
