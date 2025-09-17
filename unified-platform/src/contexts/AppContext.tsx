'use client'

import React, { createContext, useContext, useState } from 'react'

type AppState = {
  currentProject: string | null
  isOnline: boolean
  user: {
    id: string
    name: string
    email: string
  } | null
}

type AppContextType = {
  state: AppState
  setCurrentProject: (project: string | null) => void
  setUser: (user: AppState['user']) => void
  setIsOnline: (online: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentProject: null,
    isOnline: true,
    user: null
  })

  const setCurrentProject = (project: string | null) => {
    setState(prev => ({ ...prev, currentProject: project }))
  }

  const setUser = (user: AppState['user']) => {
    setState(prev => ({ ...prev, user }))
  }

  const setIsOnline = (online: boolean) => {
    setState(prev => ({ ...prev, isOnline: online }))
  }

  return (
    <AppContext.Provider value={{
      state,
      setCurrentProject,
      setUser,
      setIsOnline
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}