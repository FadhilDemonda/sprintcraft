import React, { useState } from 'react'
import { X, User, Mail, Briefcase, Camera, Check, Shield, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'
import { supabaseService } from '../services/supabaseService'
import { isSupabaseConfigured } from '../lib/supabase'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces'
]

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, theme, isCloudConnected } = useStore()
  const isDark = theme === 'dark'

  const [name, setName] = useState(user?.name || '')
  const [role, setRole] = useState(user?.role || 'Product Engineer')
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0])
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  if (!isOpen) return null

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const updatedData = {
        name: name.trim() || user?.email?.split('@')[0] || 'User',
        role: role.trim() || 'Product Engineer',
        avatar: avatar
      }

      // Update local state
      updateUserProfile(updatedData)

      // Sync to Supabase cloud if connected
      if (isSupabaseConfigured() && user?.id) {
        await supabaseService.updateProfile(user.id, {
          name: updatedData.name,
          role: updatedData.role,
          avatarUrl: updatedData.avatar
        })
      }

      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        onClose()
      }, 700)
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark 
            ? 'bg-[#111827] border-[#1F293D] text-[#F8FAFC]' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-[#1F293D]' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">User Profile</h2>
              <p className="text-[11px] opacity-60">Manage your account information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-[#1F293D] text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-3">
              Avatar Icon
            </label>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={avatar}
                alt="Selected Avatar"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
              />
              <div className="text-xs">
                <span className="font-semibold block">{name || 'Your Name'}</span>
                <span className="opacity-60 text-[11px] block">{user?.email}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 font-mono mt-1">
                  <Shield className="w-3 h-3" /> {isCloudConnected ? 'Cloud Synced' : 'Local Demo'}
                </span>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
              {AVATAR_PRESETS.map((presetUrl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(presetUrl)}
                  className={`relative w-9 h-9 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    avatar === presetUrl 
                      ? 'border-teal-400 scale-105 shadow-xs' 
                      : 'border-transparent opacity-60 hover:opacity-100 hover:scale-100'
                  }`}
                >
                  <img src={presetUrl} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  {avatar === presetUrl && (
                    <div className="absolute inset-0 bg-teal-500/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-teal-300 drop-shadow-xs" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border opacity-60 cursor-not-allowed ${
                  isDark ? 'bg-[#172033] border-[#1F293D]' : 'bg-slate-100 border-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fadhil M."
                required
                className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border focus:border-teal-500 focus:outline-none transition-smooth ${
                  isDark 
                    ? 'bg-[#172033] text-white border-[#1F293D] placeholder-slate-500' 
                    : 'bg-white text-slate-900 border-slate-200 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Job Role / Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
              Role / Title
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Fullstack Engineer, Tech Lead"
                className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border focus:border-teal-500 focus:outline-none transition-smooth ${
                  isDark 
                    ? 'bg-[#172033] text-white border-[#1F293D] placeholder-slate-500' 
                    : 'bg-white text-slate-900 border-slate-200 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-500/10">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isDark ? 'hover:bg-[#1F293D] text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-md ${
                saveSuccess 
                  ? 'bg-emerald-600 hover:bg-emerald-500' 
                  : 'bg-teal-600 hover:bg-teal-500 hover:shadow-teal-500/20'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : isSaving ? (
                <span>Saving...</span>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
