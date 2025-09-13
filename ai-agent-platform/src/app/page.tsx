'use client'

import { useStore } from '@/store/useStore'
import { ServiceCard } from '@/components/ServiceCard'
import { CLIInput } from '@/components/CLIInput'
import { Terminal } from '@/components/Terminal'
import { Toaster } from '@/components/ui/toaster'

export default function Home() {
  const { services } = useStore()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Agent Integration Platform</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover and integrate third-party services with AI-powered automation
          </p>
          
          {/* CLI Input */}
          <div className="mb-12">
            <CLIInput />
          </div>
        </div>

        {/* Services */}
        <div className="space-y-8">
          {services.map((service, index) => (
            <div key={service.id}>
              <ServiceCard service={service} />
              {index < services.length - 1 && (
                <hr className="my-8 border-gray-200" />
              )}
            </div>
          ))}
        </div>

        {/* Agent Info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Available AI Agents</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {['Claude', 'Cursor', 'Aider', 'GPT Engineer', 'Smithery', 'Cline', 'MCP Server', 'Gemini CLI'].map((agent) => (
              <div key={agent} className="p-3 bg-gray-50 rounded-lg text-sm">
                {agent}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal */}
      <Terminal />
      
      {/* Toast Notifications */}
      <Toaster />
    </main>
  )
}