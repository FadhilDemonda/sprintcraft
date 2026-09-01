import React, { useState } from 'react'
import { X, Copy, Check, Download, FileText, Code2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { apiFetch } from '../lib/api'

export const ExportModal = () => {
  const { isExportModalOpen, closeExportModal, tasks, getCurrentProject, columns, theme } = useStore()
  const isDark = theme === 'dark'
  const project = getCurrentProject()
  const [format, setFormat] = useState('markdown') // 'markdown' | 'json'
  const [copied, setCopied] = useState(false)
  const [exportContent, setExportContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    if (!isExportModalOpen || !project) return;
    
    const fetchExport = async () => {
      setIsLoading(true);
      try {
        const projectTasks = tasks.filter((t) => t.projectId === project.id);
        const jsonRes = await apiFetch('/api/export', {
          method: 'POST',
          body: JSON.stringify({
            format,
            project,
            tasks: projectTasks
          })
        });
        
        setExportContent(jsonRes.data || JSON.stringify(jsonRes));
      } catch (err) {
        console.error(err);
        setExportContent(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExport();
  }, [isExportModalOpen, project, format, tasks]);

  if (!isExportModalOpen || !project) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(exportContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const filename = `sprint-backlog-${project.title.toLowerCase().replace(/\s+/g, '-')}.${format === 'markdown' ? 'md' : 'json'
      }`
    const blob = new Blob([exportContent], {
      type: format === 'markdown' ? 'text/markdown' : 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div
        className={`rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden border ${isDark ? 'bg-[#111827] border-[#1F293D] text-white' : 'bg-white border-[#E2E8F0] text-slate-900'
          }`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-[#1F293D]' : 'border-[#E2E8F0]'
          }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Export Sprint Backlog</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Export formatted tickets for GitHub, Jira, or Markdown docs</p>
            </div>
          </div>
          <button
            onClick={closeExportModal}
            className={`p-2 rounded-xl transition-smooth cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">

          {/* Format Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('markdown')}
              className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl font-bold border transition-smooth cursor-pointer ${format === 'markdown'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl font-bold border transition-smooth cursor-pointer ${format === 'json'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
            >
              <Code2 className="w-4 h-4" />
              <span>JSON (.json)</span>
            </button>
          </div>

          {/* Code Preview */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm rounded-2xl">
                <span className="text-xs font-bold bg-white/90 text-slate-900 px-3 py-1.5 rounded-full shadow-sm">Generating from backend...</span>
              </div>
            )}
            <pre className={`rounded-2xl p-4 text-xs font-mono max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed border shadow-inner ${isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
              {exportContent}
            </pre>
          </div>

        </div>

        {/* Footer Actions */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
          }`}>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Ready to import into GitHub Issues, Jira, or Notion
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border transition-smooth cursor-pointer ${isDark ? 'bg-[#172033] hover:bg-[#1E293B] text-white border-[#1F293D]' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-smooth cursor-pointer shadow-md active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
