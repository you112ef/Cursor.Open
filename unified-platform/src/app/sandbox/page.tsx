'use client'

import Sandbox from '@/components/Sandbox'

export default function SandboxPage() {
  return (
    <div className="h-screen">
      <Sandbox 
        onCodeExecute={async (code, language) => {
          console.log('Executing code:', { code, language })
          // Simulate API call
          return {
            id: Date.now().toString(),
            code,
            language,
            output: 'Code executed successfully!',
            status: 'success' as const,
            executionTime: 1000,
            timestamp: new Date()
          }
        }}
        onSaveCode={(code, language) => {
          console.log('Saving code:', { code, language })
        }}
      />
    </div>
  )
}