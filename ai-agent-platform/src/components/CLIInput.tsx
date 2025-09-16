'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { parseCommand, getCommandWorkflow, AGENTS } from '@/lib/agents'
import { Send } from 'lucide-react'

export function CLIInput() {
  const [input, setInput] = useState('')
  const { addAgentActivity, updateAgentActivity, setTerminalOpen, setCurrentAgent, addService } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const { agent, command } = parseCommand(input)
    const agentInfo = AGENTS.find(a => a.id === agent)
    
    if (!agentInfo) return

    setCurrentAgent(agent)
    setTerminalOpen(true)

    // Create initial activity
    const activityId = Math.random().toString(36).substr(2, 9)
    addAgentActivity({
      agent: agent,
      command: input,
      output: [],
      status: 'running'
    })

    // Get workflow for this command
    const workflow = getCommandWorkflow(command)
    
    // Execute workflow
    for (const step of workflow) {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update activity with step output
      updateAgentActivity(activityId, {
        command: step.command,
        output: step.output,
        status: 'running'
      })

      // Simulate step duration
      await new Promise(resolve => setTimeout(resolve, step.duration))
    }

    // Mark as completed
    updateAgentActivity(activityId, {
      status: 'completed'
    })

    // Check if this command should add a service
    const lowerCommand = command.toLowerCase()
    if (lowerCommand.includes('supabase') || lowerCommand.includes('database')) {
      // Simulate adding Supabase
      setTimeout(() => {
        addService('supabase')
      }, 1000)
    } else if (lowerCommand.includes('clerk') || lowerCommand.includes('auth')) {
      // Simulate adding Clerk
      setTimeout(() => {
        addService('clerk')
      }, 1000)
    } else if (lowerCommand.includes('upstash') || lowerCommand.includes('redis')) {
      // Simulate adding Upstash
      setTimeout(() => {
        addService('upstash')
      }, 1000)
    } else if (lowerCommand.includes('sentry') || lowerCommand.includes('monitor')) {
      // Simulate adding Sentry
      setTimeout(() => {
        addService('sentry')
      }, 1000)
    }

    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell Sam what you want"
          className="flex-1"
        />
        <Button type="submit" size="lg">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2 text-sm text-gray-500 text-center">
        Try: &quot;Set up a database&quot;, &quot;Add authentication&quot;, or &quot;/claude help&quot;
      </div>
    </form>
  )
}