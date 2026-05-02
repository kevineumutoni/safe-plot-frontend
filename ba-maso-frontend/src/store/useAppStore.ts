import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RiskResponse, Language, ChatMessage, HistoryItem } from '../types'

const genToken = () => `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

interface AppState {
  language: Language
  theme: 'dark' | 'light'
  sessionToken: string
  currentResult: RiskResponse | null
  chatMessages: ChatMessage[]
  history: HistoryItem[]
  setLanguage: (l: Language) => void
  setTheme: (t: 'dark' | 'light') => void
  toggleTheme: () => void
  setCurrentResult: (r: RiskResponse) => void
  addChatMessage: (m: ChatMessage) => void
  clearChat: () => void
  saveToHistory: (r: RiskResponse) => void
  clearHistory: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'rw',
      theme: 'dark',
      sessionToken: genToken(),
      currentResult: null,
      chatMessages: [],
      history: [],
      setLanguage: (l) => set({ language: l }),
      setTheme: (t) => set({ theme: t }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setCurrentResult: (r) => set({ currentResult: r }),
      addChatMessage: (m) => set((s) => ({ chatMessages: [...s.chatMessages, m] })),
      clearChat: () => set({ chatMessages: [] }),
      saveToHistory: (r) =>
        set((s) => ({
          history: [{ ...r, saved_at: new Date().toISOString() }, ...s.history].slice(0, 30),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'ba-maso-v3',
      partialize: (s) => ({
        language: s.language,
        theme: s.theme,
        history: s.history,
        sessionToken: s.sessionToken,
      }),
    }
  )
)