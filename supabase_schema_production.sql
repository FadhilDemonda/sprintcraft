-- ==============================================================================
-- SprintCraft AI - Production Hardened Row-Level Security (RLS) Policies
-- Run this in your Supabase SQL Editor when graduating to Production.
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing permissive policies
DROP POLICY IF EXISTS "Allow public read-write for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read-write for projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read-write for sprints" ON public.sprints;
DROP POLICY IF EXISTS "Allow public read-write for tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow public read-write for task_comments" ON public.task_comments;
DROP POLICY IF EXISTS "Allow public read-write for notes" ON public.notes;

-- ==============================================================================
-- 3. PROFILES POLICIES
-- ==============================================================================
-- Allow authenticated users to read member profiles (for avatar/name collaboration)
CREATE POLICY "Profiles are viewable by authenticated users" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow users to update ONLY their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- ==============================================================================
-- 4. PROJECTS POLICIES
-- ==============================================================================
-- Users can view projects they own or where owner_id is null (public templates)
CREATE POLICY "Users can view accessible projects" 
  ON public.projects FOR SELECT 
  TO authenticated 
  USING (owner_id = auth.uid() OR owner_id IS NULL);

-- Users can create projects with themselves as owner
CREATE POLICY "Users can create projects" 
  ON public.projects FOR INSERT 
  TO authenticated 
  WITH CHECK (owner_id = auth.uid() OR owner_id IS NULL);

-- Users can update only their own projects
CREATE POLICY "Users can update own projects" 
  ON public.projects FOR UPDATE 
  TO authenticated 
  USING (owner_id = auth.uid()) 
  WITH CHECK (owner_id = auth.uid());

-- Users can delete only their own projects
CREATE POLICY "Users can delete own projects" 
  ON public.projects FOR DELETE 
  TO authenticated 
  USING (owner_id = auth.uid());

-- ==============================================================================
-- 5. SPRINTS POLICIES
-- ==============================================================================
CREATE POLICY "Users can view sprints for accessible projects" 
  ON public.sprints FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = sprints.project_id 
      AND (projects.owner_id = auth.uid() OR projects.owner_id IS NULL)
    )
  );

CREATE POLICY "Users can manage sprints for own projects" 
  ON public.sprints FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = sprints.project_id 
      AND (projects.owner_id = auth.uid() OR projects.owner_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = sprints.project_id 
      AND (projects.owner_id = auth.uid() OR projects.owner_id IS NULL)
    )
  );

-- ==============================================================================
-- 6. TASKS POLICIES
-- ==============================================================================
CREATE POLICY "Users can view tasks for accessible projects" 
  ON public.tasks FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND (projects.owner_id = auth.uid() OR projects.owner_id IS NULL)
    )
  );

CREATE POLICY "Users can manage tasks for own projects" 
  ON public.tasks FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND (projects.owner_id = auth.uid() OR projects.owner_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND (projects.owner_id = auth.uid() OR projects.owner_id IS NULL)
    )
  );

-- ==============================================================================
-- 7. MEETING NOTES POLICIES (Strict Private Isolation)
-- ==============================================================================
CREATE POLICY "Users can view only own notes" 
  ON public.notes FOR SELECT 
  TO authenticated 
  USING (owner_id = auth.uid() OR owner_id IS NULL);

CREATE POLICY "Users can insert own notes" 
  ON public.notes FOR INSERT 
  TO authenticated 
  WITH CHECK (owner_id = auth.uid() OR owner_id IS NULL);

CREATE POLICY "Users can update own notes" 
  ON public.notes FOR UPDATE 
  TO authenticated 
  USING (owner_id = auth.uid() OR owner_id IS NULL)
  WITH CHECK (owner_id = auth.uid() OR owner_id IS NULL);

CREATE POLICY "Users can delete own notes" 
  ON public.notes FOR DELETE 
  TO authenticated 
  USING (owner_id = auth.uid() OR owner_id IS NULL);
