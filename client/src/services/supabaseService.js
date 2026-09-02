import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Format converter: Supabase snake_case <-> Application camelCase
const mapTaskFromDb = (t) => ({
  id: t.id,
  projectId: t.project_id,
  sprintId: t.sprint_id,
  columnId: t.status || 'backlog',
  title: t.title,
  description: t.description,
  status: t.status,
  priority: t.priority,
  category: t.category,
  storyPoints: t.story_points,
  assignee: typeof t.assignee === 'string' 
    ? { name: t.assignee, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', role: 'Engineer' }
    : t.assignee || { name: 'Unassigned', avatar: '', role: '' },
  orderIndex: t.order_index,
  createdAt: t.created_at,
  updatedAt: t.updated_at,
  comments: (t.task_comments || []).map((c) => ({
    id: c.id,
    author: c.author_name,
    text: c.text,
    createdAt: c.created_at,
  })),
})

const normalizeTaskStatus = (s) => {
  if (!s) return 'backlog'
  const clean = String(s).toLowerCase().trim().replace(/[\s-]+/g, '_')
  if (['backlog', 'todo', 'in_progress', 'review', 'done'].includes(clean)) return clean
  if (clean === 'in_progress' || clean === 'inprogress') return 'in_progress'
  if (clean === 'to_do') return 'todo'
  if (clean === 'completed') return 'done'
  return 'backlog'
}

const normalizeTaskPriority = (p) => {
  if (!p) return 'Medium'
  const str = String(p).trim()
  const cap = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  if (['Low', 'Medium', 'High', 'Urgent'].includes(cap)) return cap
  return 'Medium'
}

const mapTaskToDb = (t) => {
  const row = {
    title: t.title || 'Untitled Task',
    description: t.description || '',
    status: normalizeTaskStatus(t.columnId || t.status || 'backlog'),
    priority: normalizeTaskPriority(t.priority || 'Medium'),
    category: t.category || t.type || 'Feature',
    story_points: Number(t.storyPoints) || 3,
    assignee: typeof t.assignee === 'object' && t.assignee ? t.assignee.name : t.assignee || null,
  }
  if (t.id) row.id = t.id
  if (t.projectId) row.project_id = t.projectId
  if (t.sprintId !== undefined) row.sprint_id = t.sprintId
  if (t.orderIndex !== undefined) row.order_index = t.orderIndex
  return row
}

const mapSprintFromDb = (s) => ({
  id: s.id,
  projectId: s.project_id,
  name: s.name,
  startDate: s.start_date,
  endDate: s.end_date,
  status: s.status,
})

const mapSprintToDb = (s) => {
  const row = {
    name: s.name,
    start_date: s.startDate,
    end_date: s.endDate,
    status: s.status,
  }
  if (s.id) row.id = s.id
  if (s.projectId) row.project_id = s.projectId
  return row
}

const mapProjectFromDb = (p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  category: p.category,
  color: p.color,
  ownerId: p.owner_id,
  createdAt: p.created_at,
})

const mapProjectToDb = (p, ownerId) => {
  const row = {
    title: p.title,
    description: p.description,
    category: p.category,
    color: p.color || '#14b8a6',
  }
  if (p.id) row.id = p.id
  if (ownerId || p.ownerId || p.owner_id) row.owner_id = ownerId || p.ownerId || p.owner_id
  return row
}

const mapNoteFromDb = (n) => ({
  id: n.id,
  title: n.title,
  content: n.content,
  ownerId: n.owner_id,
  createdAt: n.created_at,
  updatedAt: n.updated_at,
})

const mapNoteToDb = (n, ownerId) => {
  const row = {
    title: n.title,
    content: n.content,
    updated_at: new Date().toISOString(),
  }
  if (n.id) row.id = n.id
  if (ownerId || n.ownerId || n.owner_id) row.owner_id = ownerId || n.ownerId || n.owner_id
  return row
}

export const supabaseService = {
  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------
  async getProjects() {
    if (!isSupabaseConfigured()) return null
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: {} }))
    const user = userData?.user
    
    let query = supabase.from('projects').select('*').order('created_at', { ascending: true })
    if (user) {
      query = query.eq('owner_id', user.id)
    }
    const { data, error } = await query
    if (error) throw error
    return (data || []).map(mapProjectFromDb)
  },

  async createProject(project) {
    if (!isSupabaseConfigured()) return null
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: {} }))
    const user = userData?.user
    const row = mapProjectToDb(project, user?.id)
    const { data, error } = await supabase.from('projects').insert([row]).select().single()
    if (error) throw error
    return mapProjectFromDb(data)
  },

  async deleteProject(id) {
    if (!isSupabaseConfigured()) return null
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    return true
  },

  // ---------------------------------------------------------------------------
  // Sprints
  // ---------------------------------------------------------------------------
  async getSprints(projectIds) {
    if (!isSupabaseConfigured()) return null
    let query = supabase.from('sprints').select('*').order('created_at', { ascending: true })
    if (projectIds && projectIds.length > 0) {
      query = query.in('project_id', projectIds)
    }
    const { data, error } = await query
    if (error) throw error
    return (data || []).map(mapSprintFromDb)
  },

  async createSprint(sprint) {
    if (!isSupabaseConfigured()) return null
    const row = mapSprintToDb(sprint)
    const { data, error } = await supabase.from('sprints').insert([row]).select().single()
    if (error) throw error
    return mapSprintFromDb(data)
  },

  async updateSprint(id, updates) {
    if (!isSupabaseConfigured()) return null
    const row = mapSprintToDb(updates)
    const { data, error } = await supabase.from('sprints').update(row).eq('id', id).select().single()
    if (error) throw error
    return mapSprintFromDb(data)
  },

  async deleteSprint(id) {
    if (!isSupabaseConfigured()) return null
    const { error } = await supabase.from('sprints').delete().eq('id', id)
    if (error) throw error
    return true
  },

  // ---------------------------------------------------------------------------
  // Tasks & Comments
  // ---------------------------------------------------------------------------
  async getTasks(projectIds) {
    if (!isSupabaseConfigured()) return null
    let query = supabase
      .from('tasks')
      .select(`*, task_comments (*)`)
      .order('order_index', { ascending: true })
    if (projectIds && projectIds.length > 0) {
      query = query.in('project_id', projectIds)
    }
    const { data, error } = await query
    if (error) throw error
    return (data || []).map(mapTaskFromDb)
  },

  async createTask(task) {
    if (!isSupabaseConfigured()) return null
    const row = mapTaskToDb(task)
    const { data, error } = await supabase.from('tasks').insert([row]).select().single()
    if (error) throw error
    return mapTaskFromDb({ ...data, task_comments: [] })
  },

  async createMultipleTasks(tasks) {
    if (!isSupabaseConfigured()) return null
    const rows = tasks.map(mapTaskToDb)
    const { data, error } = await supabase.from('tasks').insert(rows).select()
    if (error) throw error
    return (data || []).map((t) => mapTaskFromDb({ ...t, task_comments: [] }))
  },

  async updateTask(id, updates) {
    if (!isSupabaseConfigured()) return null
    const row = mapTaskToDb(updates)
    const { data, error } = await supabase.from('tasks').update(row).eq('id', id).select(`*, task_comments (*)`).single()
    if (error) throw error
    return mapTaskFromDb(data)
  },

  async deleteTask(id) {
    if (!isSupabaseConfigured()) return null
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
    return true
  },

  async addTaskComment(taskId, authorName, text) {
    if (!isSupabaseConfigured()) return null
    const { data, error } = await supabase
      .from('task_comments')
      .insert([{ task_id: taskId, author_name: authorName, text }])
      .select()
      .single()
    if (error) throw error
    return {
      id: data.id,
      author: data.author_name,
      text: data.text,
      createdAt: data.created_at,
    }
  },

  // ---------------------------------------------------------------------------
  // Notes
  // ---------------------------------------------------------------------------
  async getNotes() {
    if (!isSupabaseConfigured()) return null
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: {} }))
    const user = userData?.user
    
    let query = supabase.from('notes').select('*').order('created_at', { ascending: false })
    if (user) {
      query = query.eq('owner_id', user.id)
    }
    const { data, error } = await query
    if (error) throw error
    return (data || []).map(mapNoteFromDb)
  },

  async createNote(note) {
    if (!isSupabaseConfigured()) return null
    const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: {} }))
    const user = userData?.user
    const row = mapNoteToDb(note, user?.id)
    const { data, error } = await supabase.from('notes').insert([row]).select().single()
    if (error) throw error
    return mapNoteFromDb(data)
  },

  async updateNote(id, updates) {
    if (!isSupabaseConfigured()) return null
    const row = mapNoteToDb(updates)
    const { data, error } = await supabase.from('notes').update(row).eq('id', id).select().single()
    if (error) throw error
    return mapNoteFromDb(data)
  },

  async deleteNote(id) {
    if (!isSupabaseConfigured()) return null
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) throw error
    return true
  },

  async getProfile(userId) {
    if (!isSupabaseConfigured() || !userId) return null
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error && error.code !== 'PGRST116') console.warn('Could not load profile:', error)
    return data
  },

  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured() || !userId) return null
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name: updates.name,
        role: updates.role,
        avatar_url: updates.avatarUrl || updates.avatar_url,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ---------------------------------------------------------------------------
  // Auth Helpers
  // ---------------------------------------------------------------------------
  async signUp(email, password, name) {
    if (!isSupabaseConfigured()) return null
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured()) return null
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    if (!isSupabaseConfigured()) return null
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  },

  async getCurrentSession() {
    if (!isSupabaseConfigured()) return null
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  // ---------------------------------------------------------------------------
  // Realtime Subscriptions
  // ---------------------------------------------------------------------------
  activeChannel: null,

  subscribeToAll(onRefresh) {
    if (!isSupabaseConfigured() || !supabase) return () => {}

    try {
      // Remove previous active channel if any
      if (this.activeChannel) {
        supabase.removeChannel(this.activeChannel)
        this.activeChannel = null
      }

      const channelName = `sprintcraft_realtime_${Date.now()}`
      const channel = supabase.channel(channelName)

      channel
        .on(
          'postgres_changes',
          { event: '*', schema: 'public' },
          (payload) => {
            if (onRefresh) onRefresh(payload)
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            // Connected to Postgres Realtime
          }
        })

      this.activeChannel = channel

      return () => {
        if (this.activeChannel) {
          supabase.removeChannel(this.activeChannel)
          this.activeChannel = null
        }
      }
    } catch (err) {
      console.warn('Realtime subscription warning:', err)
      return () => {}
    }
  },
}
