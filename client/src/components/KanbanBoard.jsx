import React, { useEffect } from 'react'
import { KanbanColumn } from './KanbanColumn'
import { useStore } from '../store/useStore'
import confetti from 'canvas-confetti'
import { CheckCircle2, ListTodo, Flame, ArrowLeft, Plus, Sparkles, LayoutGrid, List } from 'lucide-react'
import { ProjectListView } from './ProjectListView'

export const KanbanBoard = () => {
  const {
    columns,
    tasks,
    currentProjectId,
    getCurrentProject,
    setViewMode,
    projectLayout,
    setProjectLayout,
    openAiModal,
    searchQuery,
    filterCategory,
    filterPriority,
    theme,
    getActiveSprint
  } = useStore()

  const isDark = theme === 'dark'
  const project = getCurrentProject()
  const activeSprint = getActiveSprint()

  // Filter tasks belonging only to the currently active project and sprint
  const projectTasks = tasks.filter((t) => t.projectId === currentProjectId && (!activeSprint || t.sprintId === activeSprint.id))

  // Apply search and category/priority filters
  const filteredTasks = projectTasks.filter((task) => {
    const matchSearch =
      !searchQuery.trim() ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchCategory =
      filterCategory === 'All' || task.category?.toLowerCase() === filterCategory.toLowerCase()

    const matchPriority =
      filterPriority === 'All' || task.priority?.toLowerCase() === filterPriority.toLowerCase()

    return matchSearch && matchCategory && matchPriority
  })

  // Sprint Stats for Active Project
  const totalTasks = projectTasks.length
  const doneTasks = projectTasks.filter((t) => t.columnId === 'done').length
  const inProgressTasks = projectTasks.filter((t) => t.columnId === 'in_progress').length
  const totalPoints = projectTasks.reduce((sum, t) => sum + (Number(t.storyPoints) || 0), 0)
  const donePoints = projectTasks
    .filter((t) => t.columnId === 'done')
    .reduce((sum, t) => sum + (Number(t.storyPoints) || 0), 0)
  const progressPercent = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0

  // Trigger celebration when all project tasks are completed
  useEffect(() => {
    if (totalTasks > 0 && doneTasks === totalTasks) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [doneTasks, totalTasks])

  if (!project || !activeSprint) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors duration-200 ${isDark ? 'bg-[#090D16] text-white' : 'bg-[#F8FAFC] text-slate-900'
        }`}>
        <h2 className="text-xl font-bold mb-2">{!project ? 'No Project Selected' : 'No Active Sprint'}</h2>
        <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {!project ? 'Please return to the dashboard to select or create a project.' : 'Start a sprint from the Backlog to see your board.'}
        </p>
        <button
          onClick={() => setViewMode(!project ? 'dashboard' : 'backlog')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-smooth cursor-pointer shadow-md"
        >
          {!project ? 'Go to Projects Dashboard' : 'Go to Backlog'}
        </button>
      </div>
    )
  }

  return (
    <div className={`flex-1 flex flex-col p-4 lg:p-6 overflow-hidden transition-colors duration-200 ${isDark ? 'bg-[#090D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}>

      {/* Breadcrumb & Project Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border transition-smooth cursor-pointer ${isDark
              ? 'bg-[#111827] text-slate-300 hover:text-white border-[#1F293D]'
              : 'bg-white text-slate-700 hover:text-slate-900 border-[#E2E8F0] shadow-xs'
              }`}
            title="Back to All Projects"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
            <span>Projects</span>
          </button>

          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight">{project.title}</h2>
            <span className="text-xs font-mono font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 rounded-lg">
              {activeSprint.name}
            </span>
          </div>
        </div>

        {/* Quick Project Team Avatars & Layout Toggle */}
        <div className="flex items-center gap-4">
          {/* Layout Toggle */}
          <div className={`flex rounded-lg p-0.5 border ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setProjectLayout('kanban')}
              className={`p-1.5 rounded-md transition-all ${projectLayout === 'kanban' ? (isDark ? 'bg-[#1F293D] text-teal-400 shadow-sm' : 'bg-white text-teal-600 shadow-sm') : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
              title="Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setProjectLayout('list')}
              className={`p-1.5 rounded-md transition-all ${projectLayout === 'list' ? (isDark ? 'bg-[#1F293D] text-teal-400 shadow-sm' : 'bg-white text-teal-600 shadow-sm') : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 hidden sm:flex">
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{project.duration}</span>
            <div className="flex items-center -space-x-2">
              {project.team?.map((member, i) => (
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
        </div>
      </div>

      {/* Sprint Health & Progress Bar */}
      <div className={`border rounded-2xl p-4 mb-5 flex flex-wrap items-center justify-between gap-4 shadow-xs transition-colors duration-200 ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
        }`}>

        {/* Left: Progress indicator */}
        <div className="flex items-center gap-4 min-w-[240px]">
          <div className="flex flex-col">
            <span className={`text-[11px] uppercase font-semibold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sprint Velocity & Progress
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold">{progressPercent}%</span>
              <span className="text-xs text-teal-400 font-mono font-semibold">
                {donePoints} of {totalPoints} Story Points Done
              </span>
            </div>
          </div>

          <div className={`flex-1 min-w-[120px] max-w-[200px] h-2.5 rounded-full overflow-hidden border ${isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-100 border-slate-200'
            }`}>
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Quick Counters */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-blue-400" />
            <span className="text-xs">
              <strong className="font-bold">{totalTasks}</strong> Tasks
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-xs">
              <strong className="font-bold">{inProgressTasks}</strong> Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs">
              <strong className="font-bold">{doneTasks}</strong> Done
            </span>
          </div>
        </div>

      </div>

      {/* Conditional Rendering: Kanban Board vs List View */}
      {projectLayout === 'kanban' ? (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-stretch">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.columnId === column.id)
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
              />
            )
          })}
        </div>
      ) : (
        <ProjectListView columns={columns} tasks={filteredTasks} />
      )}

    </div>
  )
}
