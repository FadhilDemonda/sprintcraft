import React, { useState } from 'react'
import { Sparkles, X, Check, Loader2, Pencil, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { apiFetch } from '../lib/api'
import confetti from 'canvas-confetti'

export const MeetingAiModal = () => {
  const {
    isMeetingAiModalOpen,
    closeMeetingAiModal,
    notes,
    activeNoteId,
    addMultipleTasks,
    theme,
    projects
  } = useStore()

  const isDark = theme === 'dark'

  const [isLoading, setIsLoading] = useState(false)
  const [generatedTasks, setGeneratedTasks] = useState([])
  const [selectedIndices, setSelectedIndices] = useState(new Set())
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '')

  // Editing state
  const [editingTaskIndex, setEditingTaskIndex] = useState(null)
  const [editForm, setEditForm] = useState(null)

  const activeNote = (notes || []).find(n => n.id === activeNoteId)

  if (!isMeetingAiModalOpen) return null

  const handleExtract = async () => {
    if (!activeNote || !activeNote.content.trim()) return

    setIsLoading(true)
    setGeneratedTasks([])
    setSelectedIndices(new Set())

    try {
      const data = await apiFetch('/api/ai/extract-tasks', {
        method: 'POST',
        body: JSON.stringify({
          noteText: activeNote.content
        })
      });

      if (data.tasks && data.tasks.length > 0) {
        setGeneratedTasks(data.tasks);
        setSelectedIndices(new Set(data.tasks.map((_, i) => i)));
      }
    } catch (err) {
      console.error('Extraction error:', err);
      alert(`Failed to extract tasks: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleSelectTask = (index) => {
    const next = new Set(selectedIndices)
    if (next.has(index)) {
      next.delete(index)
    } else {
      next.add(index)
    }
    setSelectedIndices(next)
  }

  const handleSaveEdit = () => {
    if (editingTaskIndex !== null && editForm) {
      const updated = [...generatedTasks]
      updated[editingTaskIndex] = editForm
      setGeneratedTasks(updated)
      setEditingTaskIndex(null)
      setEditForm(null)
    }
  }

  const handleImportToBacklog = () => {
    if (!selectedProjectId) {
      alert("Please select a target project for these tasks.")
      return
    }

    const tasksToImport = generatedTasks
      .filter((_, i) => selectedIndices.has(i))
      .map(t => ({ ...t, projectId: selectedProjectId })) // Override project ID

    if (tasksToImport.length > 0) {
      // Temporarily switch current project so the store adds it correctly
      // (addMultipleTasks uses currentProjectId fallback)
      useStore.setState({ currentProjectId: selectedProjectId })

      addMultipleTasks(tasksToImport)
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      })
      closeMeetingAiModal()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">

      {/* Modal Card */}
      <div
        className={`rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${isDark ? 'bg-[#111827] border-[#1F293D] text-white' : 'bg-white border-[#E2E8F0] text-slate-900'
          }`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b shrink-0 ${isDark ? 'border-[#1F293D]' : 'border-[#E2E8F0]'
          }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-xs">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                AI Task Extractor
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Automatically turn meeting notes into actionable backlog items
              </p>
            </div>
          </div>
          <button
            onClick={closeMeetingAiModal}
            className={`p-2 rounded-xl transition-smooth cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {generatedTasks.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Ready to Extract Tasks?</h3>
              <p className={`text-sm mb-6 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Gemini AI will read "{activeNote?.title || 'this note'}" and identify all action items, technical requirements, and to-dos.
              </p>
              <button
                onClick={handleExtract}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                Start Extraction
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
              <p className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Gemini is reading your notes and extracting action items...
              </p>
            </div>
          )}

          {generatedTasks.length > 0 && !isLoading && (
            <div className="flex flex-col gap-4">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold">
                    Extracted {generatedTasks.length} Tasks
                  </h3>
                </div>
                <span className="text-xs text-teal-400 font-mono font-semibold">
                  {selectedIndices.size} selected
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {generatedTasks.map((task, idx) => {
                  const isSelected = selectedIndices.has(idx)
                  const isEditing = editingTaskIndex === idx

                  if (isEditing) {
                    return (
                      <div key={idx} className={`p-4 rounded-2xl border ${isDark ? 'bg-[#090D16] border-teal-500/50' : 'bg-white border-teal-300'}`}>
                        <div className="flex flex-col gap-3">
                          <input
                            className={`w-full text-sm font-bold bg-transparent border-b pb-1 focus:outline-none ${isDark ? 'border-[#1F293D] focus:border-teal-500' : 'border-slate-200 focus:border-teal-400'}`}
                            value={editForm.title}
                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                            placeholder="Task Title"
                          />
                          <textarea
                            className={`w-full text-xs bg-transparent border rounded-lg p-2 focus:outline-none resize-none ${isDark ? 'border-[#1F293D] focus:border-teal-500' : 'border-slate-200 focus:border-teal-400'}`}
                            rows={3}
                            value={editForm.description}
                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Description"
                          />
                          <div className="flex items-center gap-2">
                            <select
                              className={`text-xs p-1.5 rounded-lg border focus:outline-none ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}
                              value={editForm.priority}
                              onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                              <option value="Urgent">Urgent</option>
                            </select>
                            <input
                              type="number"
                              className={`w-16 text-xs p-1.5 rounded-lg border focus:outline-none ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'}`}
                              value={editForm.storyPoints}
                              onChange={e => setEditForm({ ...editForm, storyPoints: e.target.value })}
                              placeholder="Pts"
                            />
                            <div className="flex-1" />
                            <button onClick={() => setEditingTaskIndex(null)} className="text-xs px-3 py-1.5 font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                            <button onClick={handleSaveEdit} className="text-xs px-3 py-1.5 font-bold bg-teal-500 text-white rounded-lg hover:bg-teal-600">Save</button>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={idx}
                      className={`group p-4 rounded-2xl border text-left transition-smooth flex flex-col gap-2 relative ${isSelected
                          ? isDark ? 'bg-[#090D16] border-teal-500 shadow-md' : 'bg-slate-50 border-teal-500 shadow-xs'
                          : isDark ? 'bg-[#090D16]/50 border-[#1F293D] opacity-70' : 'bg-slate-50/50 border-slate-200 opacity-70'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectTask(idx)}
                          className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-0 cursor-pointer accent-teal-600 shrink-0"
                        />
                        <div className="flex-1 min-w-0" onClick={() => toggleSelectTask(idx)}>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5 pr-8">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isDark ? 'bg-[#111827] text-teal-400 border-[#1F293D]' : 'bg-white text-teal-700 border-slate-200'
                              }`}>
                              {task.category || task.type || 'Task'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${task.priority === 'High' || task.priority === 'Urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                  'bg-slate-500/10 text-slate-500 border-slate-500/20'
                              }`}>
                              {task.priority || 'Medium'} Priority
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${isDark ? 'bg-[#111827] text-teal-300 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                              {task.storyPoints} pts
                            </span>
                          </div>

                          <h4 className="text-sm font-bold cursor-pointer pr-8">
                            {task.title}
                          </h4>

                          <p className={`text-xs mt-1 leading-relaxed pr-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {task.description}
                          </p>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditForm({ ...task })
                          setEditingTaskIndex(idx)
                        }}
                        className={`absolute right-4 top-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'hover:bg-[#1F293D] text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        title="Edit Task"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        {generatedTasks.length > 0 && !isLoading && (
          <div className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-4 shrink-0 ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-slate-50 border-[#E2E8F0]'
            }`}>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Add to Project:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className={`text-xs font-bold py-1.5 px-2 rounded-lg border focus:outline-none ${isDark ? 'bg-[#1F293D] text-white border-[#374151]' : 'bg-white text-slate-800 border-slate-300'
                  }`}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeMeetingAiModal}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-smooth cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleImportToBacklog}
                disabled={selectedIndices.size === 0}
                className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-smooth cursor-pointer active:scale-95 shadow-md"
              >
                <Check className="w-4 h-4 text-white" />
                <span>Add {selectedIndices.size} Tasks to Backlog</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
