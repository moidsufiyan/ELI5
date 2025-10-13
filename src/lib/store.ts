import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Complexity levels
export type ComplexityLevel = 'ELI5' | 'ELI15' | 'normal'

// Simplification history item
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

// User preferences
export interface UserPreferences {
  defaultComplexity: ComplexityLevel
  enableWikipedia: boolean
}

// Application state
interface AppState {
  // Preferences
  preferences: UserPreferences
  setPreferences: (preferences: Partial<UserPreferences>) => void
  
  // History (local only, max 50 items)
  history: HistoryItem[]
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  removeFromHistory: (id: string) => void
  
  // Current processing state
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void

  // Shared draft text across pages/components
  draftText: string
  setDraftText: (text: string) => void
}

// Create store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Default preferences
      preferences: {
        defaultComplexity: 'ELI5',
        enableWikipedia: true,
      },
      
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      
      // History management
      history: [],
      
      addToHistory: (item) =>
        set((state) => {
          const newItem: HistoryItem = {
            ...item,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          }
          
          // Keep only last 50 items
          const newHistory = [newItem, ...state.history].slice(0, 50)
          
          return { history: newHistory }
        }),
      
      clearHistory: () => set({ history: [] }),
      
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      
      // Processing state (not persisted)
      isProcessing: false,
      setIsProcessing: (isProcessing) => set({ isProcessing }),

      // Draft text shared state
      draftText: '',
      setDraftText: (text: string) => set({ draftText: text }),
    }),
    {
      name: 'eli5-storage', // localStorage key
      partialize: (state) => ({
        preferences: state.preferences,
        history: state.history,
        draftText: state.draftText,
      }),
    }
  )
)
