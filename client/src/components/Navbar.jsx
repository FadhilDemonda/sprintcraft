import React, { useState, useRef, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  LogOut, 
  LayoutGrid, 
  Sun,
  Moon,
  Sparkles,
  Database,
  Cloud,
  User,
  Settings,
  CheckCircle2,
  FileText,
  Layers,
  ChevronDown,
  Shield,
  Briefcase
} from 'lucide-react'
import { useStore } from '../store/useStore'

export const Navbar = () => {
  const { 
    projects,
    currentProjectId,
    setCurrentProject,
    getCurrentProject,
    viewMode,
    setViewMode,
    user, 
    logout, 
    openAiModal, 
    openExportModal,
    openCreateProjectModal,
    openProfileModal,
    searchQuery, 
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    theme,
    toggleTheme,
    isCloudConnected,
    isDemoAccount,
    isLoadingData
  } = useStore()

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const currentProject = getCurrentProject()

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Security', 'AI / LLM', 'Planning', 'DevOps']
  const priorities = ['All', 'High', 'Medium', 'Low']

  const isDark = theme === 'dark'

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={`sticky top-0 z-30 px-4 lg:px-6 py-3 select-none transition-colors duration-200 border-b ${
      isDark 
        ? 'bg-[#111827] border-[#1F293D] text-[#F8FAFC]' 
        : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A] shadow-xs'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Left section has been moved to Sidebar */}

        {/* Center: Search & Filter Toolbar (Visible in Board View) */}
        {viewMode === 'board' ? (
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, criteria..."
                className={`w-full text-xs pl-9 pr-3 py-1.5 rounded-xl border focus:border-teal-500 focus:outline-none transition-smooth ${
                  isDark 
                    ? 'bg-[#172033] text-white placeholder-slate-500 border-[#1F293D]' 
                    : 'bg-[#F1F5F9] text-slate-900 placeholder-slate-400 border-[#E2E8F0]'
                }`}
              />
            </div>

            {/* Category Filter */}
            <div className="hidden sm:block">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`text-xs py-1.5 px-2.5 rounded-xl border focus:border-teal-500 focus:outline-none cursor-pointer transition-smooth ${
                  isDark 
                    ? 'bg-[#172033] text-slate-200 border-[#1F293D]' 
                    : 'bg-[#F1F5F9] text-slate-800 border-[#E2E8F0]'
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? '🏷️ All Tags' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="hidden sm:block">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`text-xs py-1.5 px-2.5 rounded-xl border focus:border-teal-500 focus:outline-none cursor-pointer transition-smooth ${
                  isDark 
                    ? 'bg-[#172033] text-slate-200 border-[#1F293D]' 
                    : 'bg-[#F1F5F9] text-slate-800 border-[#E2E8F0]'
                }`}
              >
                {priorities.map((pri) => (
                  <option key={pri} value={pri}>
                    {pri === 'All' ? '⚡ Priority' : `${pri} Pri`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* Workspace Info in Dashboard */
          <div className="flex-1 max-w-sm hidden md:block">
            <span className="text-xs opacity-60 font-mono">
              SprintCraft AI Workspace • {projects.length} Active Projects
            </span>
          </div>
        )}

        {/* Right: Theme Toggle, Actions, AI Trigger & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Database / Cloud Status Badge */}
          <div 
            className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-xl text-[11px] font-mono font-bold border transition-smooth ${
              isCloudConnected && !isDemoAccount
                ? (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
                : (isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200')
            }`}
            title={isCloudConnected && !isDemoAccount ? 'Connected to Supabase PostgreSQL with Realtime Sync' : 'Running in Local Demo Mode'}
          >
            <span className={`w-2 h-2 rounded-full ${isCloudConnected && !isDemoAccount ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isCloudConnected && !isDemoAccount ? 'Supabase Live' : 'Demo Mode'}</span>
          </div>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-smooth cursor-pointer shadow-xs ${
              isDark 
                ? 'bg-[#172033] hover:bg-[#1E293B] border-[#1F293D] text-amber-300' 
                : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] border-[#E2E8F0] text-slate-700'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Quick Dashboard Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'dashboard' || viewMode === 'my_tasks' ? 'board' : 'dashboard')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-smooth cursor-pointer focus-ring shadow-xs ${
              isDark 
                ? 'bg-[#172033] hover:bg-[#1E293B] border-[#1F293D] text-slate-200' 
                : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] border-[#E2E8F0] text-slate-700'
            }`}
            title={viewMode === 'dashboard' || viewMode === 'my_tasks' ? 'Switch to Active Kanban Board' : 'Back to Projects Dashboard'}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-teal-400" />
            <span>{viewMode === 'dashboard' || viewMode === 'my_tasks' ? 'Open Board' : 'Dashboard'}</span>
          </button>

          {/* Export Sprint Button (in Board view) */}
          {viewMode === 'board' && (
            <button
              onClick={openExportModal}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-smooth cursor-pointer focus-ring shadow-xs ${
                isDark 
                  ? 'bg-[#172033] hover:bg-[#1E293B] border-[#1F293D] text-slate-200' 
                  : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] border-[#E2E8F0] text-slate-700'
              }`}
              title="Export Sprint Backlog"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export</span>
            </button>
          )}

          {/* Primary AI Decompose CTA */}
          <button
            onClick={openAiModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-xl text-xs font-semibold tracking-wide border border-orange-400/30 transition-smooth cursor-pointer focus-ring active:scale-95 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>AI Decompose</span>
          </button>

          {/* User Profile Avatar Trigger */}
          <div className="relative pl-2 border-l border-slate-500/20" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="relative p-0.5 rounded-full border-2 border-transparent hover:border-teal-400/60 transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none"
              title={`Profile: ${user?.name || 'User'} (Click for profile menu)`}
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-teal-500/40 shadow-xs"
              />
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${
                isDark ? 'border-[#111827]' : 'border-white'
              } ${
                isCloudConnected && !isDemoAccount ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div 
                className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl overflow-hidden py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isDark 
                    ? 'bg-[#111827] border-[#1F293D] text-[#F8FAFC]' 
                    : 'bg-white border-slate-200 text-slate-900 shadow-lg'
                }`}
              >
                {/* User Card Header */}
                <div className={`px-4 py-3 border-b ${isDark ? 'border-[#1F293D] bg-[#172033]/50' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
                      alt={user?.name}
                      className="w-10 h-10 rounded-xl object-cover border border-teal-500/30 shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold truncate">{user?.name || 'User Profile'}</h4>
                      <p className="text-[11px] opacity-60 truncate">{user?.email || 'No email'}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold ${
                          isCloudConnected && !isDemoAccount 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          <Shield className="w-2.5 h-2.5" />
                          {isCloudConnected && !isDemoAccount ? 'Supabase Live' : 'Demo Mode'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1 space-y-0.5 text-xs font-medium">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      openProfileModal()
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-[#1F293D] text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-teal-400" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      setViewMode('my_tasks')
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-[#1F293D] text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>My Assigned Tasks</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      setViewMode('backlog')
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-[#1F293D] text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Sprint Backlog</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      setViewMode('notes')
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-[#1F293D] text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Meeting Notes</span>
                  </button>
                </div>

                {/* Divider */}
                <div className={`my-1 border-t ${isDark ? 'border-[#1F293D]' : 'border-slate-100'}`} />

                {/* Sign Out */}
                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  )
}
