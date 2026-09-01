import React from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, Sparkles, FileText } from 'lucide-react'

export const MeetingNotesView = () => {
  const { 
    theme, 
    notes, 
    activeNoteId, 
    setActiveNoteId, 
    addNote, 
    updateNote, 
    deleteNote, 
    openMeetingAiModal 
  } = useStore()
  
  const isDark = theme === 'dark'

  const safeNotes = notes || []
  const activeNote = safeNotes.find(n => n.id === activeNoteId)

  return (
    <div className={`flex flex-1 overflow-hidden transition-colors duration-200 ${isDark ? 'bg-[#090D16] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* Left Sidebar (Notes List) */}
      <div className={`w-72 shrink-0 border-r flex flex-col ${isDark ? 'border-[#1F293D] bg-[#0B1120]' : 'border-slate-200 bg-white'}`}>
        
        <div className={`p-4 border-b flex flex-col gap-3 ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-500" />
              Meeting Notes
            </h2>
          </div>
          
          <button 
            onClick={addNote}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
              isDark 
                ? 'bg-[#1F293D] hover:bg-teal-500/20 hover:border-teal-500/50 hover:text-teal-400 border-transparent text-slate-300' 
                : 'bg-slate-100 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-600 border-transparent text-slate-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {safeNotes.length === 0 ? (
            <div className={`text-center p-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No notes found. Create one!
            </div>
          ) : (
            safeNotes.map(note => {
              const isActive = note.id === activeNoteId
              const dateSnippet = new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              return (
                <div 
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`group relative flex flex-col gap-1 p-3 rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? (isDark ? 'bg-[#1F293D] border border-teal-500/30' : 'bg-teal-50 border border-teal-200')
                      : (isDark ? 'hover:bg-[#111827] border border-transparent' : 'hover:bg-slate-50 border border-transparent')
                  }`}
                >
                  <h3 className={`text-sm font-bold truncate pr-6 ${isActive ? 'text-teal-500' : ''}`}>
                    {note.title || 'Untitled Note'}
                  </h3>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {dateSnippet}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNote(note.id)
                    }}
                    className={`absolute right-2 top-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                      isDark ? 'hover:bg-red-500/20 text-slate-500 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Right Area (Editor) */}
      <div className="flex-1 flex flex-col relative">
        {activeNote ? (
          <>
            {/* Editor Header */}
            <div className={`flex items-center justify-between p-4 lg:p-6 border-b shrink-0 ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
              <div className="flex-1">
                <input 
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                  placeholder="Meeting Title..."
                  className="w-full bg-transparent text-2xl lg:text-3xl font-extrabold focus:outline-none placeholder-slate-400/50"
                />
              </div>
              <div className="shrink-0 ml-4">
                <button
                  onClick={openMeetingAiModal}
                  disabled={!activeNote.content.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Tasks with AI</span>
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 p-4 lg:p-6 overflow-hidden">
              <textarea
                value={activeNote.content}
                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                placeholder="Start typing your meeting notes here..."
                className={`w-full h-full bg-transparent resize-none focus:outline-none text-sm lg:text-base leading-relaxed ${
                  isDark ? 'placeholder-slate-700' : 'placeholder-slate-300'
                }`}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className={`text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a note or create a new one to start writing.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
