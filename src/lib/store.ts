import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


export type ComplexityLevel = 'ELI5' | 'ELI15' | 'normal'


export interface HistoryItem {
  id: string
  originalText: string
  simplifiedText: string
  complexity: ComplexityLevel
  timestamp: number
  wordCount: number
  usedWiki: boolean
  wikiTitle?: string
}


export interface UserPreferences {
  defaultComplexity: ComplexityLevel
  enableWikipedia: boolean
}


interface AppState {
  
  preferences: UserPreferences
  setPreferences: (preferences: Partial<UserPreferences>) => void
  
  
  history: HistoryItem[]
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  removeFromHistory: (id: string) => void
  
  
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void

  
  draftText: string
  setDraftText: (text: string) => void
}


export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      
      preferences: {
        defaultComplexity: 'ELI5',
        enableWikipedia: true,
      },
      
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      
      
      history: [],
      
      addToHistory: (item) =>
        set((state) => {
          const newItem: HistoryItem = {
            ...item,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          }
          
          
          const newHistory = [newItem, ...state.history].slice(0, 50)
          
          return { history: newHistory }
        }),
      
      clearHistory: () => set({ history: [] }),
      
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      
      
      isProcessing: false,
      setIsProcessing: (isProcessing) => set({ isProcessing }),

      
      draftText: '',
      setDraftText: (text: string) => set({ draftText: text }),
    }),
    {
      name: 'eli5-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        history: state.history,
        draftText: state.draftText,
      }),
      // Prevent Zustand from reading localStorage during SSR.
      // Without this, SSR renders default values but client immediately
      // hydrates from localStorage, causing a React hydration mismatch.
      // Components must call useAppStore.persist.rehydrate() in useEffect.
      skipHydration: true,
    }
  )
)
