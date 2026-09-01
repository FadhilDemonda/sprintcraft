import { create } from 'zustand'
import { supabaseService } from '../services/supabaseService'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const INITIAL_COLUMNS = [
  { id: 'backlog', title: 'BACKLOG', color: '#A7C8FF' }, // Soft Blue
  { id: 'todo', title: 'TO DO', color: '#FF8DA1' }, // Flamingo Pink
  { id: 'in_progress', title: 'IN PROGRESS', color: '#FDD05B' }, // Sunny Yellow
  { id: 'in_review', title: 'IN REVIEW', color: '#8AE2B9' }, // Mint Green
  { id: 'done', title: 'DONE', color: '#BCAAFE' }, // Lavender
]

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    title: 'E-Commerce Redesign',
    description: 'Revamping customer checkout flow, multi-currency pricing, and real-time inventory management system.',
    sprint: 'Sprint 3 (Current)',
    duration: 'Aug 24 - Sep 07, 2026',
    team: [
      { name: 'Fadhil M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', role: 'Fullstack Lead', online: true },
      { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', role: 'Frontend Dev', online: true },
      { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', role: 'DB Architect', online: false },
      { name: 'Budi Santoso', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', role: 'Backend Dev', online: true },
    ],
    createdAt: '2026-08-20T08:00:00.000Z'
  },
  {
    id: 'proj-2',
    title: 'AI Customer Support Agent',
    description: 'Autonomous multi-channel chatbot with RAG embeddings, Zendesk webhook sync, and sentiment analysis dashboard.',
    sprint: 'Sprint 1 (Planning)',
    duration: 'Sep 01 - Sep 15, 2026',
    team: [
      { name: 'Fadhil M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', role: 'Fullstack Lead', online: true },
      { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', role: 'Frontend Dev', online: true },
    ],
    createdAt: '2026-08-22T10:00:00.000Z'
  }
]

export const INITIAL_SPRINTS = [
  {
    id: 'sprint-1',
    projectId: 'proj-1',
    name: 'Sprint 3 (Current)',
    startDate: '2026-08-24',
    endDate: '2026-09-07',
    status: 'active'
  },
  {
    id: 'sprint-2',
    projectId: 'proj-1',
    name: 'Sprint 4 (Planned)',
    startDate: '2026-09-08',
    endDate: '2026-09-22',
    status: 'planned'
  }
]

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    sprintId: 'sprint-1',
    columnId: 'backlog',
    title: 'Setup Stripe & Midtrans Payment Gateway Integration',
    description: 'Implement multi-provider payment processing backend service with webhook listeners for charge capture, refund, and idempotency checks.',
    category: 'Backend',
    priority: 'High',
    storyPoints: 8,
    assignee: {
      name: 'Fadhil M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Backend Lead'
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'Stripe webhook listener verifies HMAC signature', completed: true },
      { id: 'ac-2', text: 'Idempotency key prevents duplicate transactions', completed: true },
      { id: 'ac-3', text: 'Auto-retry mechanism for failed webhooks (3 attempts)', completed: false },
      { id: 'ac-4', text: 'Unit tests cover 85%+ payment controller paths', completed: false },
    ],
    comments: [
      { id: 'c-1', author: 'Budi Santoso', text: 'Pastikan sandbox key sudah di-setup di environment staging.', createdAt: '10 mins ago' }
    ],
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    sprintId: 'sprint-1',
    columnId: 'backlog',
    title: 'Design Database Schema for Multi-Tenant Inventory',
    description: 'Create PostgreSQL tables with row-level security (RLS) for tenant isolation, SKU indexes, and inventory locks during checkout.',
    category: 'Database',
    priority: 'High',
    storyPoints: 5,
    assignee: {
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      role: 'DB Architect'
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'Schema migrations written using Prisma / Knex', completed: false },
      { id: 'ac-2', text: 'Pessimistic locking applied to stock deduction queries', completed: false },
      { id: 'ac-3', text: 'Benchmarked for 5000 concurrent cart updates', completed: false },
    ],
    comments: [],
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    sprintId: 'sprint-1',
    columnId: 'todo',
    title: 'Implement Product Filter & Search with Debounce',
    description: 'Client-side product catalogue filtering by category, price slider, in-stock switch, and rating with URL parameter synchronization.',
    category: 'Frontend',
    priority: 'High',
    storyPoints: 5,
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      role: 'Frontend Dev'
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'Search input debounced with 300ms delay', completed: true },
      { id: 'ac-2', text: 'URL query params keep filter state across reloads', completed: true },
      { id: 'ac-3', text: 'Empty state illustration when 0 results found', completed: false },
      { id: 'ac-4', text: 'Accessible keyboard navigation for dropdown filters', completed: false },
    ],
    comments: [],
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    columnId: 'todo',
    title: 'OAuth 2.0 & Firebase Auth RBAC Middleware',
    description: 'Setup Google Sign-In and Email auth with token verification middleware and role-based permissions (Admin, Member, Viewer).',
    category: 'Security',
    priority: 'Medium',
    storyPoints: 3,
    assignee: {
      name: 'Fadhil M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Fullstack Dev'
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'JWT validated on all protected backend routes', completed: true },
      { id: 'ac-2', text: 'Refresh token rotation implemented', completed: false },
      { id: 'ac-3', text: 'Role authorization decorator for controllers', completed: false },
    ],
    comments: [],
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    projectId: 'proj-1',
    sprintId: 'sprint-1',
    columnId: 'in_progress',
    title: 'Real-Time WebSocket Sync for Live Board Drag & Drop',
    description: 'Listen to board updates in real time using Firestore snapshots / WebSocket events so team cards move instantly on all screens.',
    category: 'Backend',
    priority: 'High',
    storyPoints: 5,
    assignee: {
      name: 'Fadhil M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'Fullstack Lead'
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'Firestore onSnapshot triggers optimistic UI updates', completed: true },
      { id: 'ac-2', text: 'Broadcast presence status for active team members', completed: true },
      { id: 'ac-3', text: 'Conflict resolution when 2 users drag same card', completed: false },
    ],
    comments: [],
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    projectId: 'proj-1',
    sprintId: 'sprint-2',
    columnId: 'in_review',
    title: 'Gemini 1.5 Flash Prompt Engineering for PRD Decomposer',
    description: 'System prompt with strict JSON schema output format returning structured epics, tasks, acceptance criteria and story point estimates.',
    category: 'AI / LLM',
    priority: 'High',
    storyPoints: 5,
    assignee: {
      name: 'Fadhil M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'AI Engineer'
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'JSON mode response schema validated with Zod', completed: true },
      { id: 'ac-2', text: 'Fallback parsing for non-JSON LLM responses', completed: true },
      { id: 'ac-3', text: 'Response time under 2.5s using gemini-1.5-flash', completed: true },
    ],
    comments: [],
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-7',
    projectId: 'proj-1',
    columnId: 'done',
    title: 'Setup Vite + React + Tailwind CSS Design System',
    description: 'Initialize project scaffold, configure dark mode tokens, typography (Inter), and SVG icons.',
    category: 'Frontend',
    priority: 'Medium',
    storyPoints: 2,
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      role: 'Frontend Dev'
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'Tailwind CSS v4 initialized', completed: true },
      { id: 'ac-2', text: 'Inter font imported from Google Fonts', completed: true },
      { id: 'ac-3', text: 'Responsive grid breakpoints verified', completed: true },
    ],
    comments: [],
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
  },

  // Tasks for Project 2 (AI Customer Support Agent)
  {
    id: 'task-201',
    projectId: 'proj-2',
    columnId: 'backlog',
    title: 'Setup Vector Database & Knowledge Base Chunking Pipeline',
    description: 'Ingest PDF documentation and Zendesk help articles, chunk with 500 token overlap, and store embeddings in pgvector.',
    category: 'AI / LLM',
    priority: 'High',
    storyPoints: 8,
    assignee: {
      name: 'Fadhil M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'AI Engineer'
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'Vector index similarity search latency < 80ms', completed: false },
      { id: 'ac-2', text: 'Automated document re-indexing cron job', completed: false }
    ],
    comments: [],
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-202',
    projectId: 'proj-2',
    columnId: 'todo',
    title: 'Chatbot UI Widget with Streaming Response & Markdown',
    description: 'Embeddable React chat widget with live token streaming, code syntax highlighting, and quick reply action buttons.',
    category: 'Frontend',
    priority: 'High',
    storyPoints: 5,
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      role: 'Frontend Dev'
    },
    acceptanceCriteria: [
      { id: 'ac-1', text: 'Readable typewriter stream effect with SSE', completed: true },
      { id: 'ac-2', text: 'Mobile responsive bottom sheet view', completed: false }
    ],
    comments: [],
    isAiGenerated: true,
    createdAt: new Date().toISOString(),
  }
]

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Q3 Roadmap Planning Sync',
    content: 'Attendees: Fadhil, Alex, Sarah.\n\nDiscussion:\n- We need to integrate Stripe payment gateway for the new checkout flow.\n- There is a bug in the mobile view of the cart that needs fixing urgently.\n- Sarah will look into optimizing the Postgres queries for the product catalog.\n\nAction Items:\n- Setup Stripe webhooks.\n- Fix mobile cart overflow bug.\n- Add database indexes to product table.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'note-2',
    title: 'Design System Review',
    content: 'Reviewing the new Vibrant Pastel theme.\n- We should update all buttons to use the new rounded-xl style.\n- Add a dark mode toggle in the settings menu.\n- The sidebar needs to have a solid background in dark mode, no glassmorphism as per user feedback.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }
]

export const useStore = create((set, get) => ({
  // Cloud & Sync State
  isCloudConnected: isSupabaseConfigured(),
  isLoadingData: false,
  isDemoAccount: false,

  // User Auth State
  user: null,
  isAuthenticated: false,

  // Profile Modal State
  isProfileModalOpen: false,
  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),
  updateUserProfile: (profileData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...profileData } : profileData
    }))
  },

  login: (userData) => set({ user: userData, isAuthenticated: true, isDemoAccount: false }),
  loginAsDemo: () => {
    set({
      user: {
        id: 'demo-user',
        name: 'Demo Architect',
        email: 'guest@sprintcraft.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        role: 'Lead Architect'
      },
      isAuthenticated: true,
      isDemoAccount: true,
      projects: INITIAL_PROJECTS,
      currentProjectId: INITIAL_PROJECTS[0].id,
      sprints: INITIAL_SPRINTS,
      tasks: INITIAL_TASKS,
      notes: INITIAL_NOTES,
      activeNoteId: INITIAL_NOTES[0].id
    })
  },
  logout: () => {
    if (isSupabaseConfigured()) {
      supabaseService.signOut().catch(console.error)
    }
    set({ 
      user: null, 
      isAuthenticated: false, 
      isDemoAccount: false, 
      currentProjectId: null, 
      viewMode: 'dashboard',
      projects: [],
      sprints: [],
      tasks: [],
      notes: []
    })
  },

  // Initialize Store from Supabase Cloud (or fallback to local state)
  initializeStore: async () => {
    if (!isSupabaseConfigured()) {
      console.log('⚡ Running in local mock mode (Supabase not configured)')
      set({
        user: {
          id: 'demo-user',
          name: 'Demo Architect',
          email: 'guest@sprintcraft.ai',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          role: 'Lead Architect'
        },
        isAuthenticated: true,
        isDemoAccount: true,
        projects: INITIAL_PROJECTS,
        sprints: INITIAL_SPRINTS,
        tasks: INITIAL_TASKS,
        notes: INITIAL_NOTES,
      })
      return
    }

    try {
      set({ isLoadingData: true })

      // 1. Check Supabase Auth Session
      const session = await supabaseService.getCurrentSession()
      if (session?.user) {
        // Fetch custom profile details from public.profiles
        const profile = await supabaseService.getProfile(session.user.id).catch(() => null)

        set({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || session.user.user_metadata?.name || session.user.email.split('@')[0],
            avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
            role: profile?.role || 'Product Engineer'
          },
          isAuthenticated: true,
          isDemoAccount: false
        })

        // 2. Fetch Projects (Isolated per user/cloud)
        const cloudProjects = await supabaseService.getProjects()
        const projectIds = (cloudProjects || []).map(p => p.id)
        set({
          projects: cloudProjects || [],
          currentProjectId: (cloudProjects && cloudProjects.length > 0) ? cloudProjects[0].id : null
        })

        // 3. Fetch Sprints (for user's projects)
        const cloudSprints = await supabaseService.getSprints(projectIds)
        set({ sprints: cloudSprints || [] })

        // 4. Fetch Tasks (for user's projects)
        const cloudTasks = await supabaseService.getTasks(projectIds)
        set({ tasks: cloudTasks || [] })

        // 5. Fetch Notes
        const cloudNotes = await supabaseService.getNotes()
        set({
          notes: cloudNotes || [],
          activeNoteId: (cloudNotes && cloudNotes.length > 0) ? cloudNotes[0].id : null
        })

        // 6. Subscribe to Realtime Postgres Changes (singleton)
        if (!get().isRealtimeSubscribed) {
          set({ isRealtimeSubscribed: true })
          supabaseService.subscribeToAll(async () => {
            const p = await supabaseService.getProjects().catch(() => null)
            const pIds = (p || []).map(item => item.id)
            const [s, t, n] = await Promise.all([
              supabaseService.getSprints(pIds).catch(() => null),
              supabaseService.getTasks(pIds).catch(() => null),
              supabaseService.getNotes().catch(() => null),
            ])
            if (p) set({ projects: p })
            if (s) set({ sprints: s })
            if (t) set({ tasks: t })
            if (n) set({ notes: n })
          })
        }
      } else {
        // No active session in Supabase
        set({
          user: null,
          isAuthenticated: false,
          isDemoAccount: false
        })
      }
    } catch (err) {
      console.warn('Could not fetch from Supabase:', err)
    } finally {
      set({ isLoadingData: false })
    }
  },

  // Theme State: 'dark' (Modern Obsidian) or 'light' (Clean Porcelain)
  theme: typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'dark') : 'dark',
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark'
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextTheme)
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
    }
    set({ theme: nextTheme })
  },
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
    }
    set({ theme })
  },

  // View Navigation: 'dashboard' (Projects overview) or 'board' (Single project Kanban)
  viewMode: 'dashboard',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Sidebar State
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  // Project Layout: 'kanban' or 'list'
  projectLayout: 'kanban',
  setProjectLayout: (layout) => set({ projectLayout: layout }),

  // Projects list
  projects: [],
  currentProjectId: null, // Default active project or null
  setCurrentProject: (projectId) => set({ currentProjectId: projectId }),
  setCurrentProjectId: (projectId) => set({ currentProjectId: projectId }),

  // Active Project Getter
  getCurrentProject: () => {
    const { projects, currentProjectId } = get()
    return projects.find((p) => p.id === currentProjectId) || projects[0] || null
  },

  // Sprints
  sprints: [],
  getActiveSprint: () => {
    const { sprints, currentProjectId } = get()
    return sprints.find(s => s.projectId === currentProjectId && s.status === 'active') || null
  },
  getProjectSprints: () => {
    const { sprints, currentProjectId } = get()
    return sprints.filter(s => s.projectId === currentProjectId)
  },

  // Notes State
  notes: [],
  activeNoteId: null,
  setActiveNoteId: (noteId) => set({ activeNoteId: noteId }),
  
  addNote: (noteData) => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: noteData?.title || 'Untitled Note',
      content: noteData?.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ 
      notes: [newNote, ...state.notes],
      activeNoteId: newNote.id 
    }))
    if (isSupabaseConfigured()) {
      supabaseService.createNote(newNote).catch(console.error)
    }
  },

  updateNote: (noteId, updates) => {
    set((state) => ({
      notes: state.notes.map(n => 
        n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    }))
    if (isSupabaseConfigured()) {
      supabaseService.updateNote(noteId, updates).catch(console.error)
    }
  },

  deleteNote: (noteId) => {
    set((state) => {
      const remaining = state.notes.filter(n => n.id !== noteId)
      return {
        notes: remaining,
        activeNoteId: state.activeNoteId === noteId 
          ? (remaining.length > 0 ? remaining[0].id : null) 
          : state.activeNoteId
      }
    })
    if (isSupabaseConfigured()) {
      supabaseService.deleteNote(noteId).catch(console.error)
    }
  },

  // Project Actions
  setCurrentProject: (projectId) => set({ currentProjectId: projectId, viewMode: 'board' }),

  addSprint: (sprintData) => {
    const id = `sprint-${Date.now()}`
    const newSprint = {
      id,
      projectId: sprintData.projectId || get().currentProjectId,
      name: sprintData.name || 'New Sprint',
      startDate: sprintData.startDate || new Date().toISOString().split('T')[0],
      endDate: sprintData.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: sprintData.status || 'planned'
    }
    set((state) => ({ sprints: [...state.sprints, newSprint] }))
    if (isSupabaseConfigured()) {
      supabaseService.createSprint(newSprint).catch(console.error)
    }
  },

  updateSprint: (sprintId, updates) => {
    set((state) => ({
      sprints: state.sprints.map(s => 
        s.id === sprintId ? { ...s, ...updates } : s
      )
    }))
    if (isSupabaseConfigured()) {
      supabaseService.updateSprint(sprintId, updates).catch(console.error)
    }
  },

  deleteSprint: (sprintId) => {
    set((state) => ({
      sprints: state.sprints.filter(s => s.id !== sprintId),
      // Move tasks from deleted sprint back to backlog
      tasks: state.tasks.map(t => t.sprintId === sprintId ? { ...t, sprintId: null } : t)
    }))
    if (isSupabaseConfigured()) {
      supabaseService.deleteSprint(sprintId).catch(console.error)
    }
  },

  createProject: (newProj) => {
    const id = `proj-${Date.now()}`
    const project = {
      id,
      title: newProj.title || 'Untitled Project',
      description: newProj.description || 'No description provided.',
      sprint: newProj.sprint || 'Sprint 1 (New)',
      duration: newProj.duration || '2 Weeks',
      team: [
        {
          name: get().user?.name || 'Fadhil M.',
          avatar: get().user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          role: 'Project Lead',
          online: true
        }
      ],
      createdAt: new Date().toISOString()
    }

    set((state) => ({
      projects: [project, ...state.projects],
      currentProjectId: id,
      viewMode: 'board',
      isCreateProjectModalOpen: false
    }))

    if (isSupabaseConfigured()) {
      supabaseService.createProject(project).catch(console.error)
    }

    return project
  },

  deleteProject: (projectId) => {
    set((state) => {
      const remaining = state.projects.filter((p) => p.id !== projectId)
      const nextCurrentId = remaining.length > 0 ? remaining[0].id : null
      return {
        projects: remaining,
        currentProjectId: nextCurrentId,
        tasks: state.tasks.filter((t) => t.projectId !== projectId),
        viewMode: remaining.length > 0 ? state.viewMode : 'dashboard'
      }
    })
    if (isSupabaseConfigured()) {
      supabaseService.deleteProject(projectId).catch(console.error)
    }
  },

  // Kanban Columns & Tasks
  columns: INITIAL_COLUMNS,
  tasks: [],

  // Get tasks for active project
  getProjectTasks: () => {
    const { tasks, currentProjectId } = get()
    return tasks.filter((t) => t.projectId === currentProjectId)
  },

  // Filters & Search
  searchQuery: '',
  filterCategory: 'All',
  filterPriority: 'All',

  // Modals & Drawers
  isAiModalOpen: false,
  isMeetingAiModalOpen: false,
  isTaskDrawerOpen: false,
  isExportModalOpen: false,
  isCreateProjectModalOpen: false,
  selectedTaskId: null,

  // UI Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  openAiModal: () => set({ isAiModalOpen: true }),
  closeAiModal: () => set({ isAiModalOpen: false }),
  openMeetingAiModal: () => set({ isMeetingAiModalOpen: true }),
  closeMeetingAiModal: () => set({ isMeetingAiModalOpen: false }),
  openExportModal: () => set({ isExportModalOpen: true }),
  closeExportModal: () => set({ isExportModalOpen: false }),
  openCreateProjectModal: () => set({ isCreateProjectModalOpen: true }),
  closeCreateProjectModal: () => set({ isCreateProjectModalOpen: false }),
  openTaskDrawer: (taskId) => set({ isTaskDrawerOpen: true, selectedTaskId: taskId }),
  closeTaskDrawer: () => set({ isTaskDrawerOpen: false, selectedTaskId: null }),

  // Task Mutations (Scoped to currentProjectId)
  moveTask: (taskId, targetColumnId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, columnId: targetColumnId, status: targetColumnId } : task
      )
    }))
    if (isSupabaseConfigured()) {
      supabaseService.updateTask(taskId, { status: targetColumnId }).catch(console.error)
    }
  },
  
  moveTaskToSprint: (taskId, sprintId) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId ? { ...task, sprintId, columnId: 'backlog', status: 'backlog' } : task
      )
    }))
    if (isSupabaseConfigured()) {
      supabaseService.updateTask(taskId, { sprintId, status: 'backlog' }).catch(console.error)
    }
  },

  addTask: (newTask) => {
    const currentProjectId = get().currentProjectId || (get().projects[0] ? get().projects[0].id : 'proj-1')
    const task = {
      id: `task-${Date.now()}`,
      projectId: currentProjectId,
      columnId: newTask.columnId || 'backlog',
      status: newTask.columnId || 'backlog',
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      category: newTask.category || 'Frontend',
      priority: newTask.priority || 'Medium',
      storyPoints: Number(newTask.storyPoints) || 3,
      assignee: newTask.assignee || get().user,
      acceptanceCriteria: newTask.acceptanceCriteria || [],
      comments: [],
      isAiGenerated: !!newTask.isAiGenerated,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ tasks: [task, ...state.tasks] }))
    if (isSupabaseConfigured()) {
      supabaseService.createTask(task).catch(console.error)
    }
    return task
  },

  addMultipleTasks: (newTasks) => {
    const currentProjectId = get().currentProjectId || (get().projects[0] ? get().projects[0].id : 'proj-1')
    const formatted = newTasks.map((t, idx) => ({
      id: `task-ai-${Date.now()}-${idx}`,
      projectId: t.projectId || currentProjectId,
      columnId: t.columnId || 'backlog',
      status: t.columnId || 'backlog',
      title: t.title,
      description: t.description || '',
      category: t.category || t.type || 'Backend',
      priority: t.priority || 'Medium',
      storyPoints: Number(t.storyPoints) || 3,
      assignee: t.assignee || get().user,
      acceptanceCriteria: (t.acceptanceCriteria || []).map((ac, acIdx) => ({
        id: `ac-${Date.now()}-${idx}-${acIdx}`,
        text: typeof ac === 'string' ? ac : ac.text,
        completed: false
      })),
      comments: [],
      isAiGenerated: true,
      createdAt: new Date().toISOString(),
    }))
    set((state) => ({ tasks: [...formatted, ...state.tasks] }))
    if (isSupabaseConfigured()) {
      supabaseService.createMultipleTasks(formatted).catch(console.error)
    }
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    }))
    if (isSupabaseConfigured()) {
      supabaseService.updateTask(taskId, updates).catch(console.error)
    }
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      isTaskDrawerOpen: state.selectedTaskId === taskId ? false : state.isTaskDrawerOpen,
      selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId,
    }))
    if (isSupabaseConfigured()) {
      supabaseService.deleteTask(taskId).catch(console.error)
    }
  },

  toggleAcceptanceCriterion: (taskId, acId) => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          acceptanceCriteria: task.acceptanceCriteria.map((ac) =>
            ac.id === acId ? { ...ac, completed: !ac.completed } : ac
          )
        }
      })
    }))
  },

  addAcceptanceCriterion: (taskId, text) => {
    if (!text.trim()) return
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          acceptanceCriteria: [
            ...task.acceptanceCriteria,
            { id: `ac-${Date.now()}`, text: text.trim(), completed: false }
          ]
        }
      })
    }))
  },

  addComment: (taskId, commentText) => {
    if (!commentText.trim()) return
    const user = get().user
    const newComment = {
      id: `c-${Date.now()}`,
      author: user?.name || 'Anonymous',
      text: commentText.trim(),
      createdAt: 'Just now'
    }
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, newComment] }
          : task
      )
    }))
    if (isSupabaseConfigured()) {
      supabaseService.addTaskComment(taskId, user?.name || 'Anonymous', commentText.trim()).catch(console.error)
    }
  }
}))
