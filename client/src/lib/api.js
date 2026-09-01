import { supabase, isSupabaseConfigured } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Robust API fetch wrapper that automatically:
 * 1. Attaches the active Supabase JWT Bearer token to Authorization headers
 * 2. Uses environment-based API base URL
 * 3. Handles structured errors cleanly
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  // Get active session token if Supabase is configured
  let token = 'demo_token'
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.access_token) {
        token = data.session.access_token
      }
    } catch (e) {
      console.warn('Failed to retrieve active session token for API call', e)
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error = new Error(errorData.error || `HTTP Request failed with status ${response.status}`)
    error.status = response.status
    error.details = errorData.details
    throw error
  }

  return response.json()
}
