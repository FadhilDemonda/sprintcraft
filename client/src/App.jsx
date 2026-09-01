import React, { useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { KanbanBoard } from './components/KanbanBoard'
import { ProjectsDashboard } from './components/ProjectsDashboard'
import { MyTasksDashboard } from './components/MyTasksDashboard'
import { AiDecomposeModal } from './components/AiDecomposeModal'
import { MeetingAiModal } from './components/MeetingAiModal'
import { TaskDetailDrawer } from './components/TaskDetailDrawer'
import { ExportModal } from './components/ExportModal'
import { CreateProjectModal } from './components/CreateProjectModal'
import { ProfileModal } from './components/ProfileModal'
import { LandingPage } from './components/LandingPage'
import { Sidebar } from './components/Sidebar'
import { BacklogView } from './components/BacklogView'
import { MeetingNotesView } from './components/MeetingNotesView'
import { CookieBanner } from './components/CookieBanner'
import { useStore } from './store/useStore'

export default function App() {
  const { 
    isAuthenticated, 
    viewMode, 
    theme, 
    initializeStore, 
    isProfileModalOpen, 
    closeProfileModal 
  } = useStore()

  // Initialize data from cloud or local state
  useEffect(() => {
    initializeStore()
  }, [])

  // Sync theme class with HTML root
  useEffect(() => {
    const activeTheme = theme || 'dark'
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  if (!isAuthenticated) {
    return <LandingPage />
  }

  return (
    <div className={`h-screen flex overflow-hidden transition-colors duration-200 ${theme === 'dark' ? 'bg-[#090D16] text-[#F8FAFC]' : 'bg-[#FCFBF9] text-[#0F172A]'}`}>

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {viewMode === 'dashboard' ? (
            <ProjectsDashboard />
          ) : viewMode === 'my_tasks' ? (
            <MyTasksDashboard />
          ) : viewMode === 'backlog' ? (
            <BacklogView />
          ) : viewMode === 'notes' ? (
            <MeetingNotesView />
          ) : (
            <KanbanBoard />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <AiDecomposeModal />
      <MeetingAiModal />
      <TaskDetailDrawer />
      <ExportModal />
      <CreateProjectModal />
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
      <CookieBanner />
    </div>
  )
}
