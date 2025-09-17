'use client'

import AgentCLI from '@/components/AgentCLI'

export default function AgentPage() {
  return (
    <div className="h-screen">
      <AgentCLI 
        onCommandExecute={async (command) => {
          console.log('Agent command executed:', command)
          // Here you would integrate with real AI services
          return 'Command executed successfully'
        }}
        onAgentAction={(action, params) => {
          console.log('Agent action:', action, params)
        }}
      />
    </div>
  )
}