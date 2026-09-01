import React, { useState } from 'react'
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Layers, 
  ShieldCheck,
  Flame,
  CheckCircle2,
  Code2,
  Sun,
  Moon
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { supabaseService } from '../services/supabaseService'
import { isSupabaseConfigured } from '../lib/supabase'

export const LandingPage = () => {
  const { loginAsDemo, initializeStore, theme, toggleTheme } = useStore()
  const isDark = theme === 'dark'
  const isCloud = isSupabaseConfigured()

  const [authMode, setAuthMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const handleInstantDemo = () => {
    loginAsDemo()
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    if (!email.trim()) return

    if (!isCloud) {
      // Local Demo Mode
      loginAsDemo()
      return
    }

    // Live Supabase Auth
    if (!password.trim()) {
      setAuthError('Password is required')
      return
    }

    try {
      setLoading(true)
      if (authMode === 'signup') {
        const res = await supabaseService.signUp(email.trim(), password, name.trim())
        if (res?.user) {
          await initializeStore()
        }
      } else {
        const res = await supabaseService.signIn(email.trim(), password)
        if (res?.user) {
          await initializeStore()
        }
      }
    } catch (err) {
      console.error('Supabase Auth error:', err)
      if (err.message?.toLowerCase().includes('rate limit')) {
        setAuthError('Supabase Email Rate Limit exceeded. Tip: In Supabase Dashboard, go to Authentication ➔ Providers ➔ Email and turn OFF "Confirm email" to enable instant signups, or use Sign In / Guest Demo below.')
      } else {
        setAuthError(err.message || 'Authentication failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16 transition-colors duration-200 ${
      isDark ? 'bg-[#090D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'
    }`}>
      
      {/* Top Navbar */}
      <header className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-xs">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-extrabold text-2xl tracking-tight">SprintCraft</span>
            <span className="font-semibold text-sm text-teal-400">AI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-smooth cursor-pointer ${
              isDark 
                ? 'bg-[#111827] hover:bg-[#172033] border-[#1F293D] text-amber-300' 
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={handleInstantDemo}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition-smooth cursor-pointer shadow-xs ${
              isDark 
                ? 'bg-[#111827] hover:bg-[#172033] text-white border-[#1F293D] hover:border-teal-500/50' 
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            Instant Demo →
          </button>
        </div>
      </header>

      {/* Main Split Hero Section */}
      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-8">
        
        {/* Left Col: Minimal Hero Pitch & Auth Box (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left">
          
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold w-fit shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isCloud ? 'Connected to Supabase PostgreSQL' : 'Gemini-Powered Agile Copilot'}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              Sprint Faster<span className="text-teal-400">.</span>
            </h1>

            <p className={`text-base sm:text-lg max-w-md font-normal leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              AI-powered Agile Kanban & Meeting Notes with Real-time cloud sync and smart decomposition.
            </p>
          </div>

          {/* Auth Box */}
          <div className={`rounded-3xl p-6 sm:p-7 flex flex-col gap-4 max-w-md shadow-2xl border ${
            isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
          }`}>
            
            {isCloud ? (
              /* Cloud Auth Mode: Sign In vs Sign Up Tabs */
              <div className="flex flex-col gap-4">
                <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-100 border-slate-200'}`}>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); setAuthError('') }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      authMode === 'signin'
                        ? (isDark ? 'bg-[#1F293D] text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs')
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setAuthError('') }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      authMode === 'signup'
                        ? (isDark ? 'bg-[#1F293D] text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs')
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
                  {authMode === 'signup' && (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      required
                      className={`w-full text-sm px-4 py-3 rounded-xl border focus:border-teal-500 focus:outline-none transition-smooth ${
                        isDark 
                          ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500' 
                          : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                      }`}
                    />
                  )}

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@work.com"
                    required
                    className={`w-full text-sm px-4 py-3 rounded-xl border focus:border-teal-500 focus:outline-none transition-smooth ${
                      isDark 
                        ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500' 
                        : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                    }`}
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full text-sm px-4 py-3 rounded-xl border focus:border-teal-500 focus:outline-none transition-smooth ${
                      isDark 
                        ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500' 
                        : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-smooth cursor-pointer shadow-md active:scale-[0.99] mt-1"
                  >
                    {loading ? 'Processing...' : (authMode === 'signup' ? 'Create Supabase Account' : 'Sign In to Workspace')}
                  </button>
                </form>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-500">Just testing around?</span>
                  <button
                    onClick={handleInstantDemo}
                    className="text-teal-400 font-bold hover:underline"
                  >
                    Skip to Guest Demo →
                  </button>
                </div>
              </div>
            ) : (
              /* Local Demo Mode */
              <div className="flex flex-col gap-3">
                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for demo login"
                    required
                    className={`w-full text-sm px-4 py-3 rounded-xl border focus:border-teal-500 focus:outline-none transition-smooth ${
                      isDark 
                        ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500' 
                        : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                    }`}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl border border-orange-400/30 transition-smooth cursor-pointer shadow-md active:scale-[0.99]"
                  >
                    Sign In to Workspace
                  </button>
                </form>
                
                <button
                  type="button"
                  onClick={handleInstantDemo}
                  className={`w-full py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    isDark ? 'border-[#1F293D] hover:bg-[#1F293D] text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  ⚡ Instant Demo (No email needed)
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Right Col: Sleek Live App Preview Mockup (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className={`w-full rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col gap-4 border ${
            isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
          }`}>
            
            {/* Top Mockup Header */}
            <div className={`flex items-center justify-between border-b pb-3.5 ${
              isDark ? 'border-[#1F293D]' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs opacity-70 font-mono ml-2">E-Commerce Sprint 3</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-teal-400 font-mono bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Live Board</span>
              </div>
            </div>

            {/* Mock Columns Mini Preview */}
            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Mini Column 1 */}
              <div className={`rounded-2xl p-3.5 border flex flex-col gap-2.5 ${
                isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
                  <span>In Progress</span>
                  <span className="text-teal-400 font-mono">2</span>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col gap-1.5 shadow-xs ${
                  isDark ? 'bg-[#111827] border-teal-500/40' : 'bg-white border-teal-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/30">
                      Backend
                    </span>
                    <span className="text-[10px] font-mono text-teal-400 font-bold">5 pts</span>
                  </div>
                  <span className="text-xs font-bold">
                    Setup Stripe & Midtrans Webhook
                  </span>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#090D16]' : 'bg-slate-100'}`}>
                    <div className="bg-teal-500 h-full w-2/3" />
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                  isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      Frontend
                    </span>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">3 pts</span>
                  </div>
                  <span className="text-xs font-bold">
                    Filter & Search UI
                  </span>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#090D16]' : 'bg-slate-100'}`}>
                    <div className="bg-blue-400 h-full w-1/2" />
                  </div>
                </div>
              </div>

              {/* Mini Column 2 */}
              <div className={`rounded-2xl p-3.5 border flex flex-col gap-2.5 ${
                isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
                  <span>Completed</span>
                  <span className="text-emerald-400 font-mono">4</span>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                  isDark ? 'bg-[#111827] border-emerald-500/30' : 'bg-white border-emerald-500/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Database
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">5 pts</span>
                  </div>
                  <span className="text-xs font-bold opacity-90">
                    Prisma Multi-Tenant Schema
                  </span>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#090D16]' : 'bg-slate-100'}`}>
                    <div className="bg-emerald-400 h-full w-full" />
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                  isDark ? 'bg-[#111827] border-amber-500/30' : 'bg-white border-amber-500/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Security
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">3 pts</span>
                  </div>
                  <span className="text-xs font-bold opacity-90">
                    OAuth 2.0 RBAC Guards
                  </span>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#090D16]' : 'bg-slate-100'}`}>
                    <div className="bg-amber-400 h-full w-full" />
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom floating prompt chip */}
            <div className={`border rounded-2xl p-3 flex items-center justify-between gap-3 text-left shadow-inner ${
              isDark ? 'bg-[#090D16] border-teal-500/40' : 'bg-slate-50 border-teal-500/40'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-xs opacity-90 truncate">
                  "Breakdown checkout with Stripe & stock locks"
                </span>
              </div>
              <span className="text-[11px] font-bold text-teal-400 font-mono shrink-0">
                → 4 tickets
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className={`max-w-7xl mx-auto w-full flex items-center justify-between text-xs pt-4 border-t ${
        isDark ? 'border-[#1F293D] text-slate-500' : 'border-slate-200 text-slate-500'
      }`}>
        <span>© 2026 SprintCraft AI. Built for modern high-velocity product teams.</span>
        <div className="flex items-center gap-4">
          <span>React + Vite</span>
          <span>•</span>
          <span>Gemini 1.5 Flash</span>
          <span>•</span>
          <span>Tailwind CSS</span>
        </div>
      </footer>

    </div>
  )
}
