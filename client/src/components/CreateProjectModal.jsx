import React, { useState } from 'react'
import { X, FolderPlus, Sparkles, Check, Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore'

export const CreateProjectModal = () => {
  const { isCreateProjectModalOpen, closeCreateProjectModal, createProject, addMultipleTasks, theme } = useStore()
  const isDark = theme === 'dark'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sprint, setSprint] = useState('Sprint 1')
  const [duration, setDuration] = useState('2 Weeks (14 Days)')
  const [useAiStarter, setUseAiStarter] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isCreateProjectModalOpen) return null

  const handleCreate = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const newProject = createProject({
      title: title.trim(),
      description: description.trim() || 'Agile Sprint Backlog',
      sprint: sprint.trim() || 'Sprint 1',
      duration: duration.trim() || '2 Weeks'
    })

    // If user wanted AI Starter tasks generated automatically
    if (useAiStarter && aiPrompt.trim()) {
      setIsLoading(true)
      setTimeout(() => {
        const starterTasks = [
          {
            projectId: newProject.id,
            title: `Setup Architecture & Backend APIs for ${title}`,
            description: `Design RESTful routes, validation schemas, and database migrations for ${aiPrompt.slice(0, 50)}...`,
            category: 'Backend',
            priority: 'High',
            storyPoints: 5,
            acceptanceCriteria: [
              'API schema validated with Zod',
              'Database tables created with foreign key relations'
            ]
          },
          {
            projectId: newProject.id,
            title: `Build Responsive UI & State Store for ${title}`,
            description: 'Implement modern client interface, theme tokens, and error handling.',
            category: 'Frontend',
            priority: 'High',
            storyPoints: 5,
            acceptanceCriteria: [
              'Accessible components with WCAG 2.2 AA compliance',
              'Responsive mobile and desktop views'
            ]
          },
          {
            projectId: newProject.id,
            title: `Authentication & Security Middleware for ${title}`,
            description: 'Setup JWT / OAuth token verification and RBAC guards.',
            category: 'Security',
            priority: 'Medium',
            storyPoints: 3,
            acceptanceCriteria: [
              'Protected routes enforce role permissions',
              'Audit log for critical operations'
            ]
          }
        ]
        addMultipleTasks(starterTasks)
        setIsLoading(false)
        closeCreateProjectModal()
      }, 600)
    } else {
      closeCreateProjectModal()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div
        className={`rounded-3xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden border ${isDark ? 'bg-[#111827] border-[#1F293D] text-white' : 'bg-white border-[#E2E8F0] text-slate-900'
          }`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-[#1F293D]' : 'border-[#E2E8F0]'
          }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-xs">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Create New Project</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Initialize a new workspace sprint board</p>
            </div>
          </div>
          <button
            onClick={closeCreateProjectModal}
            className={`p-2 rounded-xl transition-smooth cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Customer Support Bot, Mobile Checkout Revamp..."
              className={`w-full text-sm p-3 rounded-xl border focus:border-teal-500 focus:outline-none shadow-xs ${isDark ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500' : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                }`}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project goals and business value..."
              className={`w-full text-xs p-3 rounded-xl border focus:border-teal-500 focus:outline-none resize-none shadow-xs ${isDark ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500' : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                }`}
            />
          </div>

          {/* Sprint Name & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Initial Sprint</label>
              <input
                type="text"
                value={sprint}
                onChange={(e) => setSprint(e.target.value)}
                placeholder="e.g. Sprint 1"
                className={`w-full text-xs p-3 rounded-xl border focus:border-teal-500 focus:outline-none ${isDark ? 'bg-[#090D16] text-white border-[#1F293D]' : 'bg-slate-50 text-slate-900 border-slate-300'
                  }`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Sprint Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2 Weeks"
                className={`w-full text-xs p-3 rounded-xl border focus:border-teal-500 focus:outline-none ${isDark ? 'bg-[#090D16] text-white border-[#1F293D]' : 'bg-slate-50 text-slate-900 border-slate-300'
                  }`}
              />
            </div>
          </div>

          {/* AI Starter Tasks Toggle */}
          <div className={`p-4 rounded-2xl border flex flex-col gap-2.5 ${isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-50 border-slate-200'
            }`}>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useAiStarter}
                onChange={(e) => setUseAiStarter(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-0 cursor-pointer accent-teal-600"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Auto-generate Initial Backlog Tickets with AI</span>
              </div>
            </label>

            {useAiStarter && (
              <textarea
                rows={2}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Tell AI what key features or tech stack this project involves..."
                className={`w-full text-xs p-3 rounded-xl border focus:border-teal-500 focus:outline-none resize-none mt-1 ${isDark ? 'bg-[#111827] text-white border-teal-500/50 placeholder-slate-500' : 'bg-white text-slate-900 border-teal-500/60 placeholder-slate-400'
                  }`}
              />
            )}
          </div>

          {/* Footer Actions */}
          <div className={`pt-3 border-t flex items-center justify-end gap-3 ${isDark ? 'border-[#1F293D]' : 'border-slate-200'
            }`}>
            <button
              type="button"
              onClick={closeCreateProjectModal}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-smooth cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl transition-smooth cursor-pointer active:scale-95 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating Backlog...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Create Project & Open Board</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
