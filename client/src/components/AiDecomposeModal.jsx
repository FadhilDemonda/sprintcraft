import React, { useState } from 'react'
import {
  Sparkles,
  X,
  Check,
  Loader2,
  Layers,
  ArrowRight,
  CheckSquare,
  FileText,
  Sliders,
  Send
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { apiFetch } from '../lib/api'
import confetti from 'canvas-confetti'

const TEMPLATES = [
  {
    name: 'E-Commerce Checkout',
    prompt: 'Implement a modern e-commerce checkout flow with Stripe & Midtrans payment gateway, shopping cart validation, address selector with postal code lookup, discount voucher calculation, and email receipt webhook.'
  },
  {
    name: 'User Auth & RBAC',
    prompt: 'Build user authentication with Google OAuth, JWT access and refresh token rotation, password reset with secure email tokens, and role-based access control (Admin, Member, Viewer).'
  },
  {
    name: 'Real-Time Chat & Presence',
    prompt: 'Create real-time 1-on-1 and channel chat with WebSocket, typing indicators, user online/offline presence status, media attachments upload to S3, and unread message counter.'
  },
  {
    name: 'AI Document Summarizer',
    prompt: 'Build an AI document summarization tool with PDF/DOCX file upload, chunking & vector embeddings search with pgvector, Gemini 1.5 Flash query pipeline, and streaming response frontend.'
  }
]

export const AiDecomposeModal = () => {
  const { isAiModalOpen, closeAiModal, addMultipleTasks, theme } = useStore()
  const isDark = theme === 'dark'

  const [prdText, setPrdText] = useState(TEMPLATES[0].prompt)
  const [detailLevel, setDetailLevel] = useState('Standard') // Concise, Standard, Enterprise
  const [focusArea, setFocusArea] = useState('Fullstack')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedTasks, setGeneratedTasks] = useState([])
  const [selectedIndices, setSelectedIndices] = useState(new Set())

  if (!isAiModalOpen) return null

  const handleGenerate = async () => {
    if (!prdText.trim()) return

    setIsLoading(true)
    setGeneratedTasks([])
    setSelectedIndices(new Set())

    try {
      const data = await apiFetch('/api/ai/decompose', {
        method: 'POST',
        body: JSON.stringify({
          prdText,
          detailLevel,
          focusArea
        })
      });
      
      if (data.tasks && data.tasks.length > 0) {
        setGeneratedTasks(data.tasks);
        setSelectedIndices(new Set(data.tasks.map((_, i) => i)));
      } else if (data.stories) {
        // Handle the structured format defined in the PRD and backend
        const extractedTasks = [];
        data.stories.forEach(story => {
          if (story.tasks) {
            story.tasks.forEach(task => extractedTasks.push(task));
          }
        });
        setGeneratedTasks(extractedTasks);
        setSelectedIndices(new Set(extractedTasks.map((_, i) => i)));
      }
    } catch (err) {
      console.error('Generation error:', err);
      alert(`Failed to generate tasks from backend: ${err.message}`);
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

  const handleImportToBoard = () => {
    const tasksToImport = generatedTasks.filter((_, i) => selectedIndices.has(i))
    if (tasksToImport.length > 0) {
      addMultipleTasks(tasksToImport)
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      })
      closeAiModal()
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
        <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-[#1F293D]' : 'border-[#E2E8F0]'
          }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-xs">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                AI Sprint Decomposer
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Transform your requirements into structured, story-pointed backlog tickets
              </p>
            </div>
          </div>

          <button
            onClick={closeAiModal}
            className={`p-2 rounded-xl transition-smooth cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 flex-1">

          {/* Quick Prompt Templates */}
          <div className="flex flex-col gap-2">
            <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Quick PRD Templates:</span>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrdText(tmpl.prompt)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-smooth cursor-pointer ${prdText === tmpl.prompt
                      ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                      : isDark ? 'bg-[#090D16] border-[#1F293D] text-slate-300 hover:border-teal-500/50' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* PRD Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold flex items-center justify-between">
              <span>Product Requirements Document (PRD) / Feature Scope:</span>
              <span className={`text-[11px] font-normal font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {prdText.length} characters
              </span>
            </label>
            <textarea
              rows={4}
              value={prdText}
              onChange={(e) => setPrdText(e.target.value)}
              placeholder="Describe the feature, user stories, acceptance requirements, or technical constraints..."
              className={`w-full text-sm p-4 rounded-2xl border focus:border-teal-500 focus:outline-none resize-none leading-relaxed shadow-xs ${isDark
                  ? 'bg-[#090D16] text-white border-[#1F293D] placeholder-slate-500'
                  : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
                }`}
            />
          </div>

          {/* Controls Row: Detail Level & Focus Area */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border ${isDark ? 'bg-[#090D16] border-[#1F293D]' : 'bg-slate-50 border-slate-200'
            }`}>

            {/* Detail Level Toggle */}
            <div className="flex flex-col gap-1.5">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Breakdown Granularity:</span>
              <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-slate-300'
                }`}>
                {['Concise', 'Standard', 'Enterprise'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDetailLevel(lvl)}
                    className={`flex-1 text-xs py-1.5 px-2 rounded-lg font-semibold transition-smooth cursor-pointer ${detailLevel === lvl
                        ? 'bg-teal-600 text-white shadow-xs'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Area Select */}
            <div className="flex flex-col gap-1.5">
              <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Architecture Focus:</span>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className={`text-xs py-2.5 px-3.5 rounded-xl border focus:border-teal-500 focus:outline-none cursor-pointer ${isDark ? 'bg-[#111827] text-white border-[#1F293D]' : 'bg-white text-slate-800 border-slate-300'
                  }`}
              >
                <option value="Fullstack">Fullstack (Balanced)</option>
                <option value="Backend-Heavy">Backend & APIs</option>
                <option value="Frontend-Heavy">Frontend & UI/UX</option>
                <option value="AI / LLM">AI & Data Engineering</option>
                <option value="Security">Security & Compliance</option>
              </select>
            </div>

          </div>

          {/* Trigger Generate Button */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prdText.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl border border-orange-400/30 transition-smooth cursor-pointer shadow-lg active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Gemini AI is decomposing your PRD...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate Agile Backlog with Gemini</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Tasks Preview Grid */}
          {generatedTasks.length > 0 && (
            <div className={`flex flex-col gap-3 pt-4 border-t ${isDark ? 'border-[#1F293D]' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold">
                    Preview: {generatedTasks.length} Tasks Generated
                  </h3>
                </div>
                <span className="text-xs text-teal-400 font-mono font-semibold">
                  {selectedIndices.size} of {generatedTasks.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
                {generatedTasks.map((task, idx) => {
                  const isSelected = selectedIndices.has(idx)
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleSelectTask(idx)}
                      className={`p-3.5 rounded-2xl border text-left transition-smooth cursor-pointer flex flex-col gap-2 ${isSelected
                          ? isDark ? 'bg-[#090D16] border-teal-500 shadow-md' : 'bg-slate-50 border-teal-500 shadow-xs'
                          : isDark ? 'bg-[#090D16]/50 border-[#1F293D] opacity-60' : 'bg-slate-50/50 border-slate-200 opacity-60'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-0 cursor-pointer accent-teal-600"
                          />
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${isDark ? 'bg-[#111827] text-teal-400 border-[#1F293D]' : 'bg-white text-teal-700 border-slate-200'
                            }`}>
                            {task.category}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-teal-400 font-bold">
                          {task.storyPoints} pts
                        </span>
                      </div>

                      <h4 className="text-xs font-bold line-clamp-1">
                        {task.title}
                      </h4>

                      <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {task.description}
                      </p>

                      {task.acceptanceCriteria?.length > 0 && (
                        <div className="text-[10px] text-teal-400 font-mono font-semibold">
                          ✓ {task.acceptanceCriteria.length} Acceptance Criteria
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        {generatedTasks.length > 0 && (
          <div className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${isDark ? 'bg-[#111827] border-[#1F293D]' : 'bg-white border-[#E2E8F0]'
            }`}>
            <button
              type="button"
              onClick={closeAiModal}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-smooth cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-[#172033]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              Discard
            </button>

            <button
              type="button"
              onClick={handleImportToBoard}
              disabled={selectedIndices.size === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-smooth cursor-pointer active:scale-95 shadow-md"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Add {selectedIndices.size} Selected Tasks to Board</span>
            </button>
          </div>
        )}

      </div>

    </div>
  )
}

// Client-side intelligent decomposition engine
function generateSmartBreakdown(prompt, detailLevel, focusArea) {
  const isSecurity = prompt.toLowerCase().includes('auth') || prompt.toLowerCase().includes('rbac') || prompt.toLowerCase().includes('token')
  const isPayment = prompt.toLowerCase().includes('stripe') || prompt.toLowerCase().includes('payment') || prompt.toLowerCase().includes('checkout')
  const isAi = prompt.toLowerCase().includes('ai') || prompt.toLowerCase().includes('pdf') || prompt.toLowerCase().includes('summar')

  if (isPayment) {
    return [
      {
        title: 'Payment Gateway Integration & Webhook Handler',
        description: 'Set up Stripe and Midtrans server-side API clients with idempotent webhook listeners for charge capture and dispute events.',
        category: 'Backend',
        priority: 'High',
        storyPoints: 8,
        acceptanceCriteria: [
          'Verify webhook HMAC signature on incoming payloads',
          'Store transaction records in database with unique idempotency keys',
          'Handle auto-retry with exponential backoff on network failures'
        ]
      },
      {
        title: 'Checkout Page UI & Multi-Step Step Wizard',
        description: 'Build interactive React checkout step wizard: Cart review, Shipping address auto-complete, Payment method selector.',
        category: 'Frontend',
        priority: 'High',
        storyPoints: 5,
        acceptanceCriteria: [
          'Live calculation of taxes, shipping fees, and discount coupons',
          'Real-time form validation with accessible error announcements',
          'Responsive design tested on 375px mobile and 1440px desktop'
        ]
      },
      {
        title: 'Inventory Reservation & Pessimistic Locking',
        description: 'Implement database transaction lock to prevent overselling items during concurrent high-traffic checkout sessions.',
        category: 'Database',
        priority: 'High',
        storyPoints: 5,
        acceptanceCriteria: [
          '15-minute checkout timer holds cart inventory',
          'Release held stock automatically when session expires',
          'Benchmarked for 2,000 concurrent checkout requests'
        ]
      },
      {
        title: 'Automated Invoice & Email Dispatcher',
        description: 'Queue background job with BullMQ / Node mailer to dispatch PDF invoices upon successful transaction capture.',
        category: 'Backend',
        priority: 'Medium',
        storyPoints: 3,
        acceptanceCriteria: [
          'Generate branded HTML and PDF receipt template',
          'Track delivery and bounce status in audit log'
        ]
      }
    ]
  }

  if (isSecurity) {
    return [
      {
        title: 'OAuth 2.0 Google Sign-In & Token Exchange',
        description: 'Configure Firebase / Google Auth provider and backend authorization code verification endpoint.',
        category: 'Security',
        priority: 'High',
        storyPoints: 5,
        acceptanceCriteria: [
          'Exchange Google ID token for secure app session JWT',
          'Store user profile in PostgreSQL / Firestore with unique UID',
          'Cookie set with HttpOnly, Secure, and SameSite=Strict'
        ]
      },
      {
        title: 'Role-Based Access Control (RBAC) Middleware',
        description: 'Create authorization guards to enforce Admin, Member, and Viewer permissions across API routes.',
        category: 'Backend',
        priority: 'High',
        storyPoints: 5,
        acceptanceCriteria: [
          'Middleware intercepts requests and validates role permissions',
          'Return 403 Forbidden with detailed error code for unauthorized attempts',
          'Unit tests covering 100% of RBAC guard conditions'
        ]
      },
      {
        title: 'User Management & Role Assignment Dashboard',
        description: 'Build admin table for inviting team members, changing roles, and revoking active sessions.',
        category: 'Frontend',
        priority: 'Medium',
        storyPoints: 3,
        acceptanceCriteria: [
          'Filter and search members by email and role',
          'Instant role update with optimistic UI update',
          'Confirmation modal for member deactivation'
        ]
      },
      {
        title: 'Audit Logging for Security Events',
        description: 'Log all authentication attempts, password resets, and permission changes to immutable security log collection.',
        category: 'Database',
        priority: 'Medium',
        storyPoints: 3,
        acceptanceCriteria: [
          'Capture IP address, User Agent, and action timestamp',
          'Automated alerting on 5+ consecutive failed login attempts'
        ]
      }
    ]
  }

  // General agile sprint breakdown
  return [
    {
      title: 'Architect API Endpoints & Request Validation',
      description: `Implement RESTful backend routes for ${prompt.slice(0, 45)}... with Zod request body validation and error handling.`,
      category: 'Backend',
      priority: 'High',
      storyPoints: 5,
      acceptanceCriteria: [
        'Zod schemas validate all incoming parameters',
        'Structured JSON response format: { success, data, error }',
        'Swagger / OpenAPI documentation generated'
      ]
    },
    {
      title: 'Build Interactive User Interface & State Store',
      description: 'Implement responsive React views with Zustand store, loading skeletons, and error boundary wrappers.',
      category: 'Frontend',
      priority: 'High',
      storyPoints: 5,
      acceptanceCriteria: [
        'Responsive layout complying with WCAG 2.2 AA standards',
        'Optimistic state updates for instant user feedback',
        'Dark mode colors matching design token system'
      ]
    },
    {
      title: 'Database Schema & Query Optimization',
      description: 'Design tables, foreign key relations, and create compound indexes for high performance queries.',
      category: 'Database',
      priority: 'Medium',
      storyPoints: 3,
      acceptanceCriteria: [
        'Migration files created and tested',
        'Indexes added on frequently searched columns',
        'Query execution plan tested with EXPLAIN ANALYZE'
      ]
    },
    {
      title: 'End-to-End Integration & Unit Testing',
      description: 'Write automated test suites verifying happy path and edge cases.',
      category: 'DevOps',
      priority: 'Medium',
      storyPoints: 3,
      acceptanceCriteria: [
        'Backend route unit tests coverage > 80%',
        'Critical user journey verified with Playwright / Cypress',
        'CI/CD pipeline test passing'
      ]
    }
  ]
}
