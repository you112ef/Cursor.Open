'use client'

import React, { createContext, useContext, useState } from 'react'

type Provider = {
  id: string
  name: string
  type: string
  apiKey?: string
  enabled: boolean
}

type ProviderContextType = {
  providers: Provider[]
  setProviders: (providers: Provider[]) => void
  addProvider: (provider: Provider) => void
  updateProvider: (id: string, updates: Partial<Provider>) => void
  removeProvider: (id: string) => void
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined)

export function ProviderContextProvider({ children }: { children: React.ReactNode }) {
  const [providers, setProviders] = useState<Provider[]>([
    { id: 'openai', name: 'OpenAI', type: 'chat', enabled: true },
    { id: 'anthropic', name: 'Anthropic', type: 'chat', enabled: true },
    { id: 'google', name: 'Google', type: 'chat', enabled: false },
    { id: 'mistral', name: 'Mistral', type: 'chat', enabled: false },
  ])

  const addProvider = (provider: Provider) => {
    setProviders(prev => [...prev, provider])
  }

  const updateProvider = (id: string, updates: Partial<Provider>) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const removeProvider = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id))
  }

  return (
    <ProviderContext.Provider value={{
      providers,
      setProviders,
      addProvider,
      updateProvider,
      removeProvider
    }}>
      {children}
    </ProviderContext.Provider>
  )
}

export const useProviders = () => {
  const context = useContext(ProviderContext)
  if (context === undefined) {
    throw new Error('useProviders must be used within a ProviderContextProvider')
  }
  return context
}