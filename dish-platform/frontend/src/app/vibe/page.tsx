'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Square, 
  RefreshCw, 
  Download, 
  Upload, 
  Settings, 
  Terminal,
  Code2,
  FileText,
  Folder,
  Search,
  GitBranch,
  Brain,
  Zap,
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
  MoreHorizontal,
  Copy,
  Save,
  Send,
  Cpu,
  Memory,
  HardDrive,
  Network,
  Database,
  Globe,
  Shield,
  Users,
  Bell,
  User,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Rocket,
  Star,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share,
  ExternalLink
} from 'lucide-react'

interface VibeProject {
  id: string
  name: string
  description: string
  type: 'web' | 'mobile' | 'desktop' | 'api'
  status: 'building' | 'ready' | 'error' | 'deploying'
  createdAt: Date
  lastModified: Date
  preview?: string
  framework: string
  language: string
}

interface VibeCommand {
  id: string
  command: string
  output: string
  status: 'success' | 'error' | 'running' | 'pending'
  timestamp: Date
  duration?: number
}

export default function VibePage() {
  const [projects, setProjects] = useState<VibeProject[]>([
    {
      id: '1',
      name: 'E-commerce Store',
      description: 'Modern e-commerce platform with AI-powered recommendations',
      type: 'web',
      status: 'ready',
      createdAt: new Date(Date.now() - 86400000),
      lastModified: new Date(Date.now() - 3600000),
      framework: 'Next.js',
      language: 'TypeScript'
    },
    {
      id: '2',
      name: 'Fitness Tracker',
      description: 'Mobile app for tracking workouts and nutrition',
      type: 'mobile',
      status: 'building',
      createdAt: new Date(Date.now() - 172800000),
      lastModified: new Date(Date.now() - 1800000),
      framework: 'React Native',
      language: 'JavaScript'
    },
    {
      id: '3',
      name: 'Task Manager API',
      description: 'RESTful API for task management system',
      type: 'api',
      status: 'deploying',
      createdAt: new Date(Date.now() - 259200000),
      lastModified: new Date(Date.now() - 900000),
      framework: 'Express',
      language: 'Node.js'
    }
  ])
  
  const [commands, setCommands] = useState<VibeCommand[]>([
    {
      id: '1',
      command: 'vibe create --type web --name "E-commerce Store"',
      output: '🚀 Creating new web application...\n✅ Project structure created\n✅ Dependencies installed\n✅ AI models loaded\n🎉 Ready to build!',
      status: 'success',
      timestamp: new Date(Date.now() - 300000),
      duration: 2500
    },
    {
      id: '2',
      command: 'vibe generate --component ProductCard',
      output: '🎨 Generating ProductCard component...\n✅ Component created: src/components/ProductCard.tsx\n✅ Styles added: src/styles/ProductCard.css\n✅ Tests created: src/tests/ProductCard.test.tsx\n📱 Mobile responsive design included',
      status: 'success',
      timestamp: new Date(Date.now() - 180000),
      duration: 1200
    },
    {
      id: '3',
      command: 'vibe deploy --env production',
      output: '🚀 Deploying to production...\n✅ Build completed successfully\n✅ Tests passed (47/47)\n✅ Security scan clean\n🌐 Deployed to: https://ecommerce-store.vercel.app',
      status: 'success',
      timestamp: new Date(Date.now() - 60000),
      duration: 4500
    }
  ])
  
  const [currentCommand, setCurrentCommand] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('projects')
  const [selectedProject, setSelectedProject] = useState<VibeProject | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  const vibeCommands = [
    { command: 'vibe create --type <type> --name "<name>"', description: 'Create new project' },
    { command: 'vibe generate --component <name>', description: 'Generate React component' },
    { command: 'vibe generate --page <name>', description: 'Generate page component' },
    { command: 'vibe generate --api <endpoint>', description: 'Generate API endpoint' },
    { command: 'vibe style --theme <theme>', description: 'Apply design theme' },
    { command: 'vibe test --coverage', description: 'Run tests with coverage' },
    { command: 'vibe deploy --env <environment>', description: 'Deploy to environment' },
    { command: 'vibe optimize --performance', description: 'Optimize app performance' },
    { command: 'vibe analyze --security', description: 'Run security analysis' },
    { command: 'vibe backup --name <backup>', description: 'Create project backup' }
  ]

  const projectTypes = [
    { type: 'web', label: 'Web App', icon: Globe, color: 'text-blue-500' },
    { type: 'mobile', label: 'Mobile App', icon: Smartphone, color: 'text-green-500' },
    { type: 'desktop', label: 'Desktop App', icon: Laptop, color: 'text-purple-500' },
    { type: 'api', label: 'API Service', icon: Server, color: 'text-orange-500' }
  ]

  const frameworks = [
    { name: 'Next.js', language: 'TypeScript', color: 'bg-black text-white' },
    { name: 'React', language: 'JavaScript', color: 'bg-blue-500 text-white' },
    { name: 'Vue.js', language: 'JavaScript', color: 'bg-green-500 text-white' },
    { name: 'Angular', language: 'TypeScript', color: 'bg-red-500 text-white' },
    { name: 'React Native', language: 'JavaScript', color: 'bg-blue-600 text-white' },
    { name: 'Flutter', language: 'Dart', color: 'bg-blue-400 text-white' },
    { name: 'Express', language: 'Node.js', color: 'bg-gray-600 text-white' },
    { name: 'FastAPI', language: 'Python', color: 'bg-green-600 text-white' }
  ]

  useEffect(() => {
    terminalRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [commands])

  const handleCommandSubmit = async () => {
    if (!currentCommand.trim()) return

    const commandId = Date.now().toString()
    const newCommand: VibeCommand = {
      id: commandId,
      command: currentCommand,
      output: '',
      status: 'running',
      timestamp: new Date()
    }

    setCommands(prev => [...prev, newCommand])
    setIsRunning(true)

    try {
      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      const result = await executeVibeCommand(currentCommand)
      
      setCommands(prev => 
        prev.map(cmd => 
          cmd.id === commandId 
            ? { ...cmd, output: result.output, status: result.status, duration: result.duration }
            : cmd
        )
      )
      
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

  const executeVibeCommand = async (command: string): Promise<{output: string, status: 'success' | 'error', duration: number}> => {
    const startTime = Date.now()
    
    if (command.includes('create')) {
      return {
        output: `🚀 Creating new project...\n\n✅ Project structure created\n✅ Dependencies installed\n✅ AI models loaded\n✅ Development server started\n\n🎉 Project ready!\n📁 Location: ./projects/${command.split('--name "')[1]?.split('"')[0] || 'new-project'}\n🌐 Preview: http://localhost:3000\n\n💡 Next steps:\n  - Run: vibe generate --component Header\n  - Run: vibe style --theme modern\n  - Run: vibe deploy --env development`,
        status: 'success',
        duration: Date.now() - startTime
      }
    }
    
    if (command.includes('generate --component')) {
      return {
        output: `🎨 Generating component...\n\n✅ Component created: src/components/${command.split('--component ')[1]}.tsx\n✅ Styles added: src/styles/${command.split('--component ')[1]}.css\n✅ Tests created: src/tests/${command.split('--component ')[1]}.test.tsx\n✅ Storybook story: src/stories/${command.split('--component ')[1]}.stories.tsx\n\n📱 Features included:\n  - Responsive design\n  - Accessibility support\n  - TypeScript types\n  - Unit tests\n  - Storybook integration`,
        status: 'success',
        duration: Date.now() - startTime
      }
    }
    
    if (command.includes('deploy')) {
      return {
        output: `🚀 Deploying application...\n\n✅ Build completed successfully\n✅ Tests passed (47/47)\n✅ Security scan clean\n✅ Performance optimized\n✅ CDN configured\n\n🌐 Deployed to: https://${command.split('--env ')[1] || 'production'}.yourdomain.com\n📊 Performance score: 95/100\n🔒 Security score: 98/100\n\n🎉 Deployment successful!`,
        status: 'success',
        duration: Date.now() - startTime
      }
    }
    
    // Default response
    return {
      output: `✅ Command executed successfully\n\nCommand: ${command}\nStatus: Completed\nDuration: ${Date.now() - startTime}ms\n\n📋 Output:\nThis is a simulated response from Vibe CLI.\nThe command has been processed and completed successfully.\n\n💡 Tip: Use 'vibe --help' to see all available commands.`,
      status: 'success',
      duration: Date.now() - startTime
    }
  }

  const handleGenerateProject = async (type: string, name: string) => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsGenerating(false)
          
          // Add new project
          const newProject: VibeProject = {
            id: Date.now().toString(),
            name,
            description: `AI-generated ${type} application`,
            type: type as any,
            status: 'ready',
            createdAt: new Date(),
            lastModified: new Date(),
            framework: frameworks[Math.floor(Math.random() * frameworks.length)].name,
            language: frameworks[Math.floor(Math.random() * frameworks.length)].language
          }
          
          setProjects(prev => [newProject, ...prev])
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 200)
  }

  const getStatusIcon = (status: VibeProject['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'building':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'deploying':
        return <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: VibeProject['status']) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500'
      case 'building':
        return 'bg-blue-500'
      case 'deploying':
        return 'bg-orange-500'
      case 'error':
        return 'bg-red-500'
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              VibeCode
            </h1>
            <p className="text-sm text-gray-300">AI-Powered App Builder</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl border-b border-white/10">
              <TabsTrigger value="projects" className="text-white data-[state=active]:bg-white/10">
                <Folder className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="terminal" className="text-white data-[state=active]:bg-white/10">
                <Terminal className="h-4 w-4 mr-2" />
                Terminal
              </TabsTrigger>
              <TabsTrigger value="generator" className="text-white data-[state=active]:bg-white/10">
                <Brain className="h-4 w-4 mr-2" />
                AI Generator
              </TabsTrigger>
              <TabsTrigger value="deploy" className="text-white data-[state=active]:bg-white/10">
                <Rocket className="h-4 w-4 mr-2" />
                Deploy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="flex-1 m-0 p-6">
              <div className="space-y-6">
                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {projectTypes.find(t => t.type === project.type)?.icon && (
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                {React.createElement(projectTypes.find(t => t.type === project.type)!.icon, { 
                                  className: `h-5 w-5 ${projectTypes.find(t => t.type === project.type)!.color}` 
                                })}
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                              <p className="text-gray-400 text-sm">{project.framework}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(project.status)}
                            <Badge variant="outline" className="text-xs border-white/20 text-white">
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300 text-sm">{project.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Created {project.createdAt.toLocaleDateString()}</span>
                          <span>Modified {project.lastModified.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                            <Play className="h-3 w-3 mr-1" />
                            Run
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="terminal" className="flex-1 m-0">
              <div className="h-full flex flex-col">
                {/* Terminal Output */}
                <div className="flex-1 overflow-y-auto p-6 bg-black/40 backdrop-blur-xl">
                  <div className="space-y-4 font-mono text-sm">
                    {commands.map((cmd) => (
                      <div key={cmd.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-400">$</span>
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
                        <span className="text-green-400">$</span>
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
                </div>

                {/* Terminal Input */}
                <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={currentCommand}
                        onChange={(e) => setCurrentCommand(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCommandSubmit()}
                        placeholder="Enter vibe command..."
                        className="w-full px-4 py-3 pr-20 border border-white/20 rounded-xl bg-black/40 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={isRunning}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-white/10">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-white/10">
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleCommandSubmit}
                      disabled={!currentCommand.trim() || isRunning}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
                    >
                      {isRunning ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="generator" className="flex-1 m-0 p-6">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    AI Project Generator
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Describe your app idea and watch AI build it for you
                  </p>
                </div>

                {/* Generation Form */}
                <Card className="bg-black/20 backdrop-blur-xl border-white/10">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white font-medium mb-3">Project Name</label>
                        <input
                          type="text"
                          placeholder="My Awesome App"
                          className="w-full px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-3">App Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {projectTypes.map((type) => (
                            <Button
                              key={type.type}
                              variant="outline"
                              className="h-20 flex flex-col gap-2 border-white/20 text-white hover:bg-white/10"
                            >
                              <type.icon className="h-6 w-6" />
                              <span className="text-sm">{type.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-3">Description</label>
                        <textarea
                          placeholder="Describe your app idea in detail..."
                          rows={4}
                          className="w-full px-4 py-3 border border-white/20 rounded-xl bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-3">Framework</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {frameworks.map((framework) => (
                            <Button
                              key={framework.name}
                              variant="outline"
                              className={`h-16 flex flex-col gap-1 border-white/20 text-white hover:bg-white/10 ${framework.color}`}
                            >
                              <span className="text-sm font-medium">{framework.name}</span>
                              <span className="text-xs opacity-75">{framework.language}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 text-lg font-medium"
                        onClick={() => handleGenerateProject('web', 'My Awesome App')}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Generating... {Math.round(generationProgress)}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5" />
                            <span>Generate with AI</span>
                          </div>
                        )}
                      </Button>
                      
                      {isGenerating && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${generationProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="deploy" className="flex-1 m-0 p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    Deploy Your Apps
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Deploy to multiple platforms with one click
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                        <Cloud className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">Vercel</h3>
                      <p className="text-gray-400 text-sm mb-4">Deploy web apps instantly</p>
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        Deploy Now
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">App Store</h3>
                      <p className="text-gray-400 text-sm mb-4">Publish mobile apps</p>
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                        Publish
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                        <Server className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">AWS</h3>
                      <p className="text-gray-400 text-sm mb-4">Scale with cloud infrastructure</p>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                        Deploy
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Commands</h3>
              <div className="space-y-2">
                {vibeCommands.map((cmd, index) => (
                  <div key={index} className="p-3 bg-black/40 rounded-lg border border-white/10">
                    <div className="text-purple-400 font-mono text-sm mb-1">{cmd.command}</div>
                    <div className="text-gray-400 text-xs">{cmd.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Project deployed</div>
                    <div className="text-gray-400 text-xs">2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Component generated</div>
                    <div className="text-gray-400 text-xs">5 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">New project created</div>
                    <div className="text-gray-400 text-xs">10 minutes ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}