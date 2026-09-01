import React from 'react'
import { X, ShieldCheck, FileText, Lock } from 'lucide-react'

export const LegalModal = ({ isOpen, onClose, type = 'privacy' }) => {
  if (!isOpen) return null

  const isPrivacy = type === 'privacy'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111827] border border-[#1F293D] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F293D] bg-[#0E1524]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              {isPrivacy ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <p className="text-xs text-slate-400">Effective Date: September 1, 2026</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          {isPrivacy ? (
            <>
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-teal-400" />
                  1. Information We Collect
                </h3>
                <p>
                  SprintCraft AI collects your email address, profile name, and sprint backlog data strictly to provide collaborative agile project management services. We do not sell your personal data to third parties.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. AI Data Usage & Privacy</h3>
                <p>
                  Text submitted for PRD decomposition or meeting note analysis is processed securely via Google Gemini API enterprise endpoints. Your proprietary prompts are not used to train foundation models.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Data Security & Storage</h3>
                <p>
                  All project data is stored in PostgreSQL databases protected by Row-Level Security (RLS) policies and encrypted in transit using TLS/HTTPS.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">4. User Rights & Account Deletion</h3>
                <p>
                  You have the right to export, modify, or permanently delete your projects, tasks, and account data at any time via the profile settings.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">1. Acceptance of Terms</h3>
                <p>
                  By accessing or using SprintCraft AI, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. Responsible AI Usage</h3>
                <p>
                  Users agree not to utilize AI decomposition tools to generate harmful, illegal, or malicious software specifications.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Service Availability</h3>
                <p>
                  SprintCraft AI strives for 99.9% uptime. Automated backups and database redundancy are maintained to protect user projects.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1F293D] bg-[#0E1524] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  )
}
