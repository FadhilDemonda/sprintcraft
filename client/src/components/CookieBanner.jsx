import React, { useState, useEffect } from 'react'
import { Cookie, Check, X } from 'lucide-react'

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside aria-label="Cookie consent banner" className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-[#111827]/95 backdrop-blur-md border border-[#1F293D] rounded-2xl p-4 shadow-2xl animate-fade-in text-slate-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xs font-bold text-white mb-1">Cookie & Privacy Notice</h2>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            We use necessary cookies and local storage to preserve your agile board state and authenticate with Supabase.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleAccept}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept</span>
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium rounded-lg transition-all cursor-pointer"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
