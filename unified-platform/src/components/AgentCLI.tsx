'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Terminal, 
  Bot, 
  Zap, 
  Code2, 
  FileText, 
  Database,
  Globe,
  Settings,
  Play,
  Square,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Copy,
  Save,
  Send,
  Brain,
  Cpu,
  Memory,
  HardDrive,
  Network,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Cloud,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react'

interface AgentCommand {
  id: string
  command: string
  output: string
  status: 'success' | 'error' | 'running' | 'pending'
  timestamp: Date
  duration?: number
  type: 'system' | 'ai' | 'user' | 'agent'
}

interface AgentCLIProps {
  onCommandExecute?: (command: string) => Promise<string>
  onAgentAction?: (action: string, params: any) => void
}

export default function AgentCLI({ onCommandExecute, onAgentAction }: AgentCLIProps) {
  const [commands, setCommands] = useState<AgentCommand[]>([
    {
      id: '1',
      command: 'agent --version',
      output: 'Agent CLI v2.1.0\nBuilt with AI-powered automation\nReady for intelligent task execution',
      status: 'success',
      timestamp: new Date(Date.now() - 300000),
      duration: 150,
      type: 'system'
    },
    {
      id: '2',
      command: 'agent status',
      output: '🟢 Agent Status: ONLINE\n🤖 AI Models: 4 providers connected\n💾 Memory: 2.1GB / 8GB used\n🌐 Network: Connected to cloud services\n🔒 Security: All systems secure',
      status: 'success',
      timestamp: new Date(Date.now() - 240000),
      duration: 200,
      type: 'system'
    },
    {
      id: '3',
      command: 'agent analyze --project ./src',
      output: '📊 Project Analysis Complete\n\n📁 Files analyzed: 47\n📝 Lines of code: 3,247\n🐛 Issues found: 3\n💡 Suggestions: 12\n⚡ Performance score: 87/100\n\n🔧 Recommended actions:\n  - Optimize imports in components/\n  - Add error boundaries\n  - Implement lazy loading',
      status: 'success',
      timestamp: new Date(Date.now() - 180000),
      duration: 2500,
      type: 'ai'
    }
  ])
  
  const [currentCommand, setCurrentCommand] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [agentStatus, setAgentStatus] = useState({
    online: true,
    aiModels: 4,
    memory: 2.1,
    maxMemory: 8,
    network: true,
    security: true
  })
  
  const [activeTab, setActiveTab] = useState('terminal')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)

  const agentCommands = [
    { command: 'agent --help', description: 'Show help information' },
    { command: 'agent status', description: 'Check agent status' },
    { command: 'agent analyze <path>', description: 'Analyze project structure' },
    { command: 'agent generate <type>', description: 'Generate code/components' },
    { command: 'agent optimize <file>', description: 'Optimize code performance' },
    { command: 'agent test <path>', description: 'Generate and run tests' },
    { command: 'agent deploy <env>', description: 'Deploy to environment' },
    { command: 'agent monitor', description: 'Start monitoring mode' },
    { command: 'agent backup', description: 'Create project backup' },
    { command: 'agent restore <backup>', description: 'Restore from backup' }
  ]

  const quickActions = [
    { icon: Code2, label: 'Generate Component', command: 'agent generate component --name MyComponent' },
    { icon: Database, label: 'Setup Database', command: 'agent setup database --type postgresql' },
    { icon: Globe, label: 'Deploy App', command: 'agent deploy production' },
    { icon: Zap, label: 'Optimize Performance', command: 'agent optimize --all' },
    { icon: FileText, label: 'Generate Tests', command: 'agent test --coverage' },
    { icon: Settings, label: 'Configure Project', command: 'agent config --interactive' }
  ]

  useEffect(() => {
    terminalRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [commands])

  const handleCommandSubmit = async () => {
    if (!currentCommand.trim()) return

    const commandId = Date.now().toString()
    const newCommand: AgentCommand = {
      id: commandId,
      command: currentCommand,
      output: '',
      status: 'running',
      timestamp: new Date(),
      type: 'user'
    }

    setCommands(prev => [...prev, newCommand])
    setCommandHistory(prev => [...prev, currentCommand])
    setHistoryIndex(commandHistory.length)
    setIsRunning(true)

    try {
      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      const result = await executeAgentCommand(currentCommand)
      
      setCommands(prev => 
        prev.map(cmd => 
          cmd.id === commandId 
            ? { ...cmd, output: result.output, status: result.status, duration: result.duration }
            : cmd
        )
      )
      
      if (onCommandExecute) {
        await onCommandExecute(currentCommand)
      }
      
    } catch (error) {
      setCommands(prev => 
        prev.map(cmd => 
          cmd.id === commandId 
            ? { ...cmd, output: `Error: ${error}`, status: 'error' }
            : cmd
        )
      )
    } finally {
      setIsRunning(false)
      setCurrentCommand('')
    }
  }

  const executeAgentCommand = async (command: string): Promise<{output: string, status: 'success' | 'error', duration: number}> => {
    const startTime = Date.now()
    
    // Simulate different command responses
    if (command.includes('--help')) {
      return {
        output: `🤖 Agent CLI Help\n\nAvailable Commands:\n${agentCommands.map(cmd => `  ${cmd.command.padEnd(25)} ${cmd.description}`).join('\n')}\n\nExamples:\n  agent analyze ./src\n  agent generate component Button\n  agent deploy staging\n\nFor more information, visit: https://docs.agent-cli.dev`,
        status: 'success',
        duration: Date.now() - startTime
      }
    }
    
    if (command.includes('status')) {
      return {
        output: `🟢 Agent Status: ${agentStatus.online ? 'ONLINE' : 'OFFLINE'}\n🤖 AI Models: ${agentStatus.aiModels} providers connected\n💾 Memory: ${agentStatus.memory}GB / ${agentStatus.maxMemory}GB used\n🌐 Network: ${agentStatus.network ? 'Connected' : 'Disconnected'}\n🔒 Security: ${agentStatus.security ? 'All systems secure' : 'Issues detected'}\n\n📊 Performance Metrics:\n  - Response time: 45ms\n  - Success rate: 98.7%\n  - Active tasks: 3\n  - Queue length: 0`,
        status: 'success',
        duration: Date.now() - startTime
      }
    }
    
    if (command.includes('analyze')) {
      return {
        output: `📊 Project Analysis Complete\n\n📁 Directory: ${command.split(' ')[2] || './'}\n📝 Files analyzed: ${Math.floor(Math.random() * 100) + 20}\n🐛 Issues found: ${Math.floor(Math.random() * 10)}\n💡 Suggestions: ${Math.floor(Math.random() * 20) + 5}\n⚡ Performance score: ${Math.floor(Math.random() * 30) + 70}/100\n\n🔧 Top Recommendations:\n  - Optimize bundle size (-15% potential)\n  - Add error boundaries\n  - Implement code splitting\n  - Update dependencies\n\n📈 Metrics:\n  - Bundle size: 2.3MB\n  - Load time: 1.2s\n  - Accessibility score: 92/100`,
        status: 'success',
        duration: Date.now() - startTime
      }
    }
    
    if (command.includes('generate')) {
      return {
        output: `🎨 Code Generation Complete\n\n✅ Generated: ${command.split(' ')[2] || 'component'}\n📁 Location: ./src/components/\n📝 Lines: ${Math.floor(Math.random() * 200) + 50}\n⏱️ Time: ${Math.floor(Math.random() * 5) + 1}s\n\n🔧 Features included:\n  - TypeScript types\n  - Responsive design\n  - Accessibility support\n  - Error handling\n  - Unit tests\n\n📋 Next steps:\n  - Review generated code\n  - Customize as needed\n  - Run tests: npm test`,
        status: 'success',
        duration: Date.now() - startTime
      }
    }
    
    if (command.includes('deploy')) {
      return {
        output: `🚀 Deployment Initiated\n\n🌍 Environment: ${command.split(' ')[2] || 'production'}\n📦 Build: v${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}\n⏱️ Estimated time: ${Math.floor(Math.random() * 10) + 5} minutes\n\n📊 Pre-deployment checks:\n  ✅ Tests passing\n  ✅ Build successful\n  ✅ Security scan clean\n  ✅ Performance optimized\n\n🔗 Deployment URL: https://${command.split(' ')[2] || 'production'}.yourdomain.com\n📱 Status: Deploying...`,
        status: 'success',
        duration: Date.now() - startTime
      }
    }
    
    if (command.includes('optimize')) {
      return {
        output: `⚡ Optimization Complete\n\n📈 Performance Improvements:\n  - Bundle size: -23% (2.1MB → 1.6MB)\n  - Load time: -18% (1.2s → 0.98s)\n  - Memory usage: -15% (45MB → 38MB)\n  - CPU usage: -12% (78% → 69%)\n\n🔧 Optimizations applied:\n  - Tree shaking enabled\n  - Code splitting implemented\n  - Image optimization\n  - Lazy loading added\n  - Caching improved\n\n📊 Before vs After:\n  Performance Score: 67 → 89 (+22)\n  Lighthouse Score: 78 → 94 (+16)`,
        status: 'success',
        duration: Date.now() - startTime
      }
    }
    
    // Default response
    return {
      output: `✅ Command executed successfully\n\nCommand: ${command}\nStatus: Completed\nDuration: ${Date.now() - startTime}ms\n\n📋 Output:\nThis is a simulated response from the Agent CLI.\nThe command has been processed and completed successfully.\n\n💡 Tip: Use 'agent --help' to see all available commands.`,
      status: 'success',
      duration: Date.now() - startTime
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommandSubmit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1)
        setCurrentCommand(commandHistory[historyIndex - 1])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(historyIndex + 1)
        setCurrentCommand(commandHistory[historyIndex + 1])
      } else {
        setHistoryIndex(commandHistory.length)
        setCurrentCommand('')
      }
    }
  }

  const handleQuickAction = (command: string) => {
    setCurrentCommand(command)
  }

  const getStatusIcon = (status: AgentCommand['status']) => {
    switch (status) {
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      case 'running':
        return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      case 'pending':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
    }
  }

  const getCommandTypeIcon = (type: AgentCommand['type']) => {
    switch (type) {
      case 'system':
        return <Settings className="h-3 w-3 text-blue-500" />
      case 'ai':
        return <Brain className="h-3 w-3 text-purple-500" />
      case 'user':
        return <Terminal className="h-3 w-3 text-green-500" />
      case 'agent':
        return <Bot className="h-3 w-3 text-orange-500" />
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Agent CLI Terminal
            </h2>
            <p className="text-sm text-muted-foreground">AI-powered command line interface</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${agentStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">{agentStatus.online ? 'Online' : 'Offline'}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            v2.1.0
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Terminal */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur border-b">
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="monitor">Monitor</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="terminal" className="flex-1 m-0">
              {/* Command Output */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black text-green-400 font-mono text-sm">
                {commands.map((cmd) => (
                  <div key={cmd.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(cmd.status)}
                      {getCommandTypeIcon(cmd.type)}
                      <span className="text-blue-400">$</span>
                      <span className="text-white">{cmd.command}</span>
                      {cmd.duration && (
                        <span className="text-gray-500 text-xs">({cmd.duration}ms)</span>
                      )}
                    </div>
                    {cmd.output && (
                      <div className="ml-6 text-gray-300 whitespace-pre-wrap">
                        {cmd.output}
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      {cmd.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                
                {isRunning && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-400">$</span>
                    <span className="text-white">{currentCommand}</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
                
                <div ref={terminalRef} />
              </div>

              {/* Command Input */}
              <div className="p-4 border-t bg-card/30">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Enter agent command..."
                      className="w-full px-4 py-2 pr-20 border rounded-lg bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isRunning}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Save className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCommandSubmit}
                    disabled={!currentCommand.trim() || isRunning}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    {isRunning ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monitor" className="flex-1 m-0 p-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Cpu className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">45%</div>
                      <div className="text-sm text-muted-foreground">CPU Usage</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Memory className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">2.1GB</div>
                      <div className="text-sm text-muted-foreground">Memory</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <HardDrive className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">156GB</div>
                      <div className="text-sm text-muted-foreground">Storage</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Network className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-sm text-muted-foreground">Network</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Active Processes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Agent Core</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Running</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">AI Engine</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Database</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Connected</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 m-0 p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm mb-3">Command History</h3>
                {commandHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No commands executed yet</p>
                  </div>
                ) : (
                  commandHistory.map((cmd, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Terminal className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-mono">{cmd}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Executed {index + 1} commands ago
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-card/30 backdrop-blur">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3 hover:bg-primary/10"
                  onClick={() => handleQuickAction(action.command)}
                >
                  <action.icon className="h-4 w-4 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {action.command.slice(0, 30)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="p-4">
            <h4 className="font-medium text-sm mb-3">Available Commands</h4>
            <div className="space-y-2">
              {agentCommands.map((cmd, index) => (
                <div key={index} className="p-2 bg-muted/50 rounded text-xs">
                  <div className="font-mono text-primary">{cmd.command}</div>
                  <div className="text-muted-foreground mt-1">{cmd.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}