'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/store/useStore'
import { AGENTS } from '@/lib/agents'

export function Terminal() {
  const { agentActivities, isTerminalOpen } = useStore()
  const [displayedOutput, setDisplayedOutput] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (agentActivities.length > 0) {
      const latestActivity = agentActivities[0]
      if (latestActivity.status === 'running') {
        setDisplayedOutput(latestActivity.output)
      }
    }
  }, [agentActivities])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [displayedOutput])

  if (!isTerminalOpen) return null

  const currentActivity = agentActivities[0]
  const currentAgent = currentActivity ? AGENTS.find(a => a.id === currentActivity.agent) : null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-green-400 font-mono text-sm border-t border-gray-800 z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-gray-400">
            {currentAgent ? `${currentAgent.name} - ` : ''}Terminal
          </span>
        </div>
        <div className="text-gray-400">
          {currentActivity?.status === 'running' && '● Running'}
          {currentActivity?.status === 'completed' && '✓ Completed'}
          {currentActivity?.status === 'error' && '✗ Error'}
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="h-64 overflow-y-auto p-4 space-y-1"
      >
        {currentActivity && (
          <>
            <div className="text-blue-400">
              $ {currentActivity.command}
            </div>
            {displayedOutput.map((line, index) => (
              <div key={index} className="text-green-400">
                {line}
              </div>
            ))}
            {currentActivity.status === 'running' && (
              <div className="text-yellow-400 animate-pulse">
                █
              </div>
            )}
          </>
        )}
        
        {agentActivities.length === 0 && (
          <div className="text-gray-500">
            No active agent sessions. Type a command to get started.
          </div>
        )}
      </div>
    </div>
  )
}