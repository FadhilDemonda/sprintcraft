import React from 'react'
import { 
  FolderPlus, 
  Sparkles, 
  ArrowRight, 
  ListTodo, 
  CheckCircle2, 
  Flame, 
  Trash2, 
  Layers, 
  Clock, 
  Users,
  ChevronRight,
  Search,
  Plus
} from 'lucide-react'
import { useStore } from '../store/useStore'

export const ProjectsDashboard = () => {
  const { 
    projects, 
    tasks, 
    setCurrentProject, 
    openCreateProjectModal, 
    openAiModal,
    deleteProject,
    searchQuery,
    setSearchQuery,
    theme
  } = useStore()

  const isDark = theme === 'dark'

  // Workspace-wide stats
  const totalProjects = projects.length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.columnId === 'done').length
  const inProgressTasks = tasks.filter((t) => t.columnId === 'in_progress').length
  const totalStoryPoints = tasks.reduce((sum, t) => sum + (Number(t.storyPoints) || 0), 0)

  // Filter projects by search query
  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sprint?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleDeleteProject = (e, project) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete "${project.title}" and all its tasks?`)) {
      deleteProject(project.id)
    }
  }

  return (
    <div className={`flex-1 flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto transition-colors duration-200 ${
      isDark ? 'bg-[#090D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'
    }`}>
      
      {/* Workspace Header & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-500 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              Workspace Overview
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Projects Dashboard
          </h1>
          <p className={`text-sm mt-1 font-normal ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Manage your sprint backlogs, track velocity, and switch between team projects.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 text-xs rounded-xl border focus:border-teal-500 focus:outline-none transition-smooth shadow-xs w-44 sm:w-56 ${
                isDark 
                  ? 'bg-[#172033] text-white border-[#1F293D] placeholder-slate-500' 
                  : 'bg-white text-slate-900 border-[#E2E8F0] placeholder-slate-400'
              }`}
            />
          </div>

          {/* New Project Button */}
          <button
            onClick={openCreateProjectModal}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-smooth cursor-pointer focus-ring shadow-xs ${
              isDark 
                ? 'bg-[#111827] hover:bg-[#172033] text-white border-[#1F293D] hover:border-teal-500/50' 
                : 'bg-white hover:bg-slate-50 text-slate-800 border-[#CBD5E1] hover:border-slate-400'
            }`}
          >
            <FolderPlus className="w-4 h-4 text-teal-400" />
            <span>New Project</span>
          </button>

          {/* Create with AI */}
          <button
            onClick={openCreateProjectModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold rounded-xl border border-orange-400/30 transition-smooth cursor-pointer focus-ring shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Create with AI</span>
          </button>
        </div>
      </div>

      {/* Top Workspace Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className={`border rounded-2xl p-5 flex items-center justify-between shadow-xs transition-colors duration-200 ${
          isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div>
            <span className={`text-xs font-medium block ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Total Projects</span>
            <span className="text-2xl font-extrabold mt-1 block">{totalProjects}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className={`border rounded-2xl p-5 flex items-center justify-between shadow-xs transition-colors duration-200 ${
          isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div>
            <span className={`text-xs font-medium block ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Backlog Tickets</span>
            <span className="text-2xl font-extrabold mt-1 block">{totalTasks}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ListTodo className="w-5 h-5" />
          </div>
        </div>

        <div className={`border rounded-2xl p-5 flex items-center justify-between shadow-xs transition-colors duration-200 ${
          isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div>
            <span className={`text-xs font-medium block ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Active in Sprint</span>
            <span className="text-2xl font-extrabold text-amber-500 mt-1 block">{inProgressTasks}</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className={`border rounded-2xl p-5 flex items-center justify-between shadow-xs transition-colors duration-200 ${
          isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
        }`}>
          <div>
            <span className={`text-xs font-medium block ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Total Story Points</span>
            <span className="text-2xl font-extrabold text-teal-400 font-mono mt-1 block">
              {totalStoryPoints} pts
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Projects Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Active Workspaces & Projects</h2>
          <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
            isDark ? 'text-[#94A3B8] bg-[#111827] border-[#1F293D]' : 'text-slate-600 bg-white border-[#E2E8F0]'
          }`}>
            {filteredProjects.length} Projects Available
          </span>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredProjects.map((proj) => {
              const projTasks = tasks.filter((t) => t.projectId === proj.id)
              const projDoneTasks = projTasks.filter((t) => t.columnId === 'done').length
              const projTotalPoints = projTasks.reduce((sum, t) => sum + (Number(t.storyPoints) || 0), 0)
              const projDonePoints = projTasks
                .filter((t) => t.columnId === 'done')
                .reduce((sum, t) => sum + (Number(t.storyPoints) || 0), 0)
              const progressPct = projTotalPoints > 0 ? Math.round((projDonePoints / projTotalPoints) * 100) : 0

              return (
                <div
                  key={proj.id}
                  onClick={() => setCurrentProject(proj.id)}
                  className={`group rounded-2xl p-6 flex flex-col justify-between transition-smooth cursor-pointer border relative select-none shadow-sm hover:shadow-xl ${
                    isDark 
                      ? 'bg-[#111827] hover:bg-[#172033] border-[#1F293D] hover:border-teal-500/50' 
                      : 'bg-white hover:bg-slate-50/80 border-[#E2E8F0] hover:border-teal-500/40'
                  }`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-mono font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2.5 py-1 rounded-md">
                          {proj.sprint}
                        </span>
                        <h3 className="text-xl font-bold group-hover:text-teal-400 mt-2.5 transition-smooth">
                          {proj.title}
                        </h3>
                      </div>

                      {/* Delete Project Action */}
                      <button
                        onClick={(e) => handleDeleteProject(e, proj)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-smooth cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed mb-5 font-normal ${
                      isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
                    }`}>
                      {proj.description}
                    </p>
                  </div>

                  {/* Progress Bar & Velocity */}
                  <div className={`flex flex-col gap-3 pt-4 border-t ${isDark ? 'border-[#1F293D]' : 'border-[#E2E8F0]'}`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Sprint Completion</span>
                      <span className="font-mono text-teal-400 font-bold text-sm">{progressPct}%</span>
                    </div>

                    <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
                      isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Meta Row: Tasks, Story Points & Team Avatars */}
                    <div className="flex items-center justify-between pt-2">
                      <div className={`flex items-center gap-3 text-xs font-mono ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                        <span>{projTasks.length} tasks</span>
                        <span>•</span>
                        <span className="text-teal-400 font-semibold">{projDonePoints}/{projTotalPoints} pts</span>
                      </div>

                      {/* Team Avatars */}
                      <div className="flex items-center -space-x-2">
                        {proj.team?.map((member, i) => (
                          <img
                            key={i}
                            src={member.avatar}
                            alt={member.name}
                            title={`${member.name} (${member.role})`}
                            className={`w-7 h-7 rounded-full border-2 object-cover ${isDark ? 'border-[#111827]' : 'border-white'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Open Board Action Button */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-500 group-hover:text-teal-400">
                        <span>Open Kanban Board</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className={`border-2 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center my-6 shadow-sm ${
            isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-xs">
              <FolderPlus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">No Projects Found</h3>
            <p className={`text-xs sm:text-sm max-w-md mt-1.5 mb-6 leading-relaxed ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {searchQuery ? `No projects matching "${searchQuery}".` : 'Create your first project manually or let Gemini AI turn your PRD requirements into an instant agile sprint.'}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={openCreateProjectModal}
                className={`px-5 py-2.5 text-xs font-semibold rounded-xl border transition-smooth cursor-pointer shadow-xs ${
                  isDark 
                    ? 'bg-[#172033] hover:bg-[#1E293B] text-white border-[#1F293D]' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                + Create Blank Project
              </button>
              <button
                onClick={openCreateProjectModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold rounded-xl border border-orange-400/30 transition-smooth cursor-pointer shadow-md active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Generate Project with AI</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
