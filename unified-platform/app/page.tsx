'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    // Redirect to dashboard for better UX
    redirect('/dashboard')
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Unified Platform</h1>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}