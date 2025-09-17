'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Terminal, 
  Brain, 
  Zap, 
  Monitor, 
  Cpu, 
  Database, 
  Network, 
  HardDrive,
  Activity,
  Play,
  Square,
  RefreshCw,
  Settings,
  HelpCircle,
  Command,
  ChevronRight
} from 'lucide-react'

export default function UnifiedAgentCLI() {
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState([
    '🚀 Unified Platform Agent CLI v1.0.0',
    'Type "help" for available commands',
    '',
    '$ '
  ])
  const [isRunning, setIsRunning] = useState(false)

  const systemMetrics = {
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 12
  }

  const aiCommands = [
    { command: 'analyze', description: 'Analyze project structure and dependencies', icon: Brain },
    { command: 'generate', description: 'Generate code with AI assistance', icon: Zap },
    { command: 'optimize', description: 'Optimize code performance and structure', icon: RefreshCw },
    { command: 'deploy', description: 'Deploy application to production', icon: Play },
    { command: 'test', description: 'Run automated tests', icon: Activity },
    { command: 'monitor', description: 'Monitor system performance', icon: Monitor }
  ]

  const handleCommand = (cmd: string) => {
    setCommand(cmd)
    setOutput(prev => [...prev, cmd])
    
    if (cmd === 'help') {
      setOutput(prev => [...prev, 'Available commands:', ...aiCommands.map(c => `  ${c.command} - ${c.description}`), '$ '])
    } else if (cmd === 'analyze') {
      setOutput(prev => [...prev, '🔍 Analyzing project...', '✅ Found 15 files', '✅ Dependencies: Next.js, React, TypeScript', '✅ No issues detected', '$ '])
    } else if (cmd === 'generate') {
      setOutput(prev => [...prev, '🤖 Generating code with AI...', '✅ Generated React component', '✅ Added TypeScript types', '✅ Created test file', '$ '])
    } else if (cmd === 'deploy') {
      setOutput(prev => [...prev, '🚀 Deploying to Vercel...', '✅ Build successful', '✅ Deployment complete', '🌐 https://unified-platform.vercel.app', '$ '])
    } else {
      setOutput(prev => [...prev, `Command not found: ${cmd}`, 'Type "help" for available commands', '$ '])
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Terminal className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Agent CLI</span>
              <p className="text-xs text-muted-foreground">AI-Powered Terminal</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              System Online
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-muted/30 p-4">
          {/* System Metrics */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>System Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">CPU</span>
                </div>
                <span className="text-sm font-medium">{systemMetrics.cpu}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Memory</span>
                </div>
                <span className="text-sm font-medium">{systemMetrics.memory}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Disk</span>
                </div>
                <span className="text-sm font-medium">{systemMetrics.disk}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Network className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Network</span>
                </div>
                <span className="text-sm font-medium">{systemMetrics.network}%</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Commands */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Commands</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiCommands.map((cmd, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleCommand(cmd.command)}
                  >
                    <cmd.icon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{cmd.command}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terminal */}
        <div className="flex-1 flex flex-col">
          {/* Terminal Header */}
          <div className="border-b bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-medium">Terminal</span>
                <Badge variant="secondary">bash</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="flex-1 p-4">
            <div className="h-full bg-black text-green-400 font-mono text-sm rounded-lg p-4 overflow-auto">
              {output.map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-green-400">$ </span>
                <span className="animate-pulse">|</span>
              </div>
            </div>
          </div>

          {/* Command Input */}
          <div className="border-t bg-muted/30 p-4">
            <div className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCommand(command)
                    setCommand('')
                  }
                }}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              <Button size="sm" onClick={() => handleCommand(command)}>
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}