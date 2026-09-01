import React from 'react'
import { Zap, LayoutDashboard, CheckSquare, Plus, Hash, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useStore } from '../store/useStore'

export const Sidebar = () => {
  const {
    theme,
    viewMode,
    setViewMode,
    projects,
    currentProjectId,
    setCurrentProject,
    openCreateProjectModal,
    isSidebarCollapsed,
    toggleSidebar
  } = useStore()

  const isDark = theme === 'dark'

  return (
    <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} shrink-0 flex flex-col h-full border-r transition-all duration-300 ease-in-out relative ${isDark ? 'bg-[#0B1120] border-[#1F293D]' : 'bg-white border-slate-200'
      }`}>
      {/* Brand Logo & Toggle */}
      <div className={`flex items-center shrink-0 ${isSidebarCollapsed ? 'flex-col justify-center gap-4 py-4 h-auto' : 'h-16 justify-between px-4'}`}>
        <div
          onClick={() => setViewMode('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Go to Projects Dashboard"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-smooth shadow-xs shrink-0">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex items-baseline gap-1 overflow-hidden">
              <span className={`font-extrabold text-lg tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>SprintCraft</span>
              <span className="font-semibold text-sm text-teal-400">AI</span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#1F293D]' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto py-4 flex flex-col gap-6 ${isSidebarCollapsed ? 'px-3' : 'px-4'}`}>

        {/* Main Navigation */}
        <div>
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isSidebarCollapsed ? 'text-center' : 'px-2'} ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {isSidebarCollapsed ? 'Nav' : 'Main Menu'}
          </div>
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setViewMode('dashboard')}
              title="Overview"
              className={`flex items-center gap-3 py-2 rounded-xl text-sm font-semibold transition-colors w-full ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3 text-left'} ${viewMode === 'dashboard'
                ? (isDark ? 'bg-[#1F293D] text-teal-400 shadow-sm' : 'bg-teal-50 text-teal-700 shadow-sm')
                : (isDark ? 'text-slate-400 hover:text-white hover:bg-[#111827]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
                }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Overview</span>}
            </button>
            <button
              onClick={() => setViewMode('my_tasks')}
              title="My Tasks"
              className={`flex items-center gap-3 py-2 rounded-xl text-sm font-semibold transition-colors w-full ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3 text-left'} ${viewMode === 'my_tasks'
                ? (isDark ? 'bg-[#1F293D] text-teal-400 shadow-sm' : 'bg-teal-50 text-teal-700 shadow-sm')
                : (isDark ? 'text-slate-400 hover:text-white hover:bg-[#111827]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
                }`}
            >
              <CheckSquare className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>My Tasks</span>}
            </button>
            <button
              onClick={() => setViewMode('backlog')}
              title="Backlog"
              className={`flex items-center gap-3 py-2 rounded-xl text-sm font-semibold transition-colors w-full ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3 text-left'} ${viewMode === 'backlog'
                  ? (isDark ? 'bg-[#1F293D] text-teal-400 shadow-sm' : 'bg-teal-50 text-teal-700 shadow-sm')
                  : (isDark ? 'text-slate-400 hover:text-white hover:bg-[#111827]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h10" /></svg>
              {!isSidebarCollapsed && <span>Sprint Backlog</span>}
            </button>
            <button
              onClick={() => setViewMode('notes')}
              title="Meeting Notes"
              className={`flex items-center gap-3 py-2 rounded-xl text-sm font-semibold transition-colors w-full ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3 text-left'} ${viewMode === 'notes'
                ? (isDark ? 'bg-[#1F293D] text-teal-400 shadow-sm' : 'bg-teal-50 text-teal-700 shadow-sm')
                : (isDark ? 'text-slate-400 hover:text-white hover:bg-[#111827]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
                }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Meeting Notes</span>}
            </button>
          </nav>
        </div>

        {/* Projects List */}
        <div className="flex-1">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-2 ${isSidebarCollapsed ? 'px-0' : 'px-2'}`}>
            {!isSidebarCollapsed && (
              <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Projects
              </div>
            )}
            <button
              onClick={openCreateProjectModal}
              className={`p-1 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#1F293D]' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
              title="Create new project"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {projects.map(project => {
              const isActive = viewMode === 'board' && currentProjectId === project.id
              return (
                <button
                  key={project.id}
                  onClick={() => setCurrentProject(project.id)}
                  title={project.title}
                  className={`flex items-center gap-3 py-2 rounded-xl text-sm transition-colors w-full group ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3 text-left'} ${isActive
                    ? (isDark ? 'bg-teal-500/10 text-teal-400 font-semibold' : 'bg-teal-50 text-teal-700 font-semibold')
                    : (isDark ? 'text-slate-400 hover:text-white hover:bg-[#111827]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
                    }`}
                >
                  <Hash className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'opacity-40 group-hover:opacity-100'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{project.title}</span>}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
