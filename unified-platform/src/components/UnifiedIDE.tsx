'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Code2, 
  Brain, 
  Users, 
  Terminal, 
  Zap, 
  Shield, 
  GitBranch, 
  Cloud,
  ArrowRight,
  Star,
  Github,
  ExternalLink,
  Sparkles,
  Rocket,
  Globe,
  Heart,
  Monitor,
  Cpu,
  Layers,
  Settings,
  FileText,
  Play,
  Database,
  Network,
  Lock,
  Activity,
  File,
  Folder,
  Search,
  Plus,
  Minus,
  Save,
  Download,
  Upload,
  RefreshCw,
  Maximize2,
  Minimize2,
  X,
  Check,
  AlertCircle,
  Info,
  HelpCircle
} from 'lucide-react'

export default function UnifiedIDE() {
  const [activeTab, setActiveTab] = useState('editor')
  const [files, setFiles] = useState([
    { id: 1, name: 'app.tsx', type: 'tsx', content: '// React component', isActive: true },
    { id: 2, name: 'styles.css', type: 'css', content: '/* CSS styles */', isActive: false },
    { id: 3, name: 'package.json', type: 'json', content: '{"name": "project"}', isActive: false },
  ])
  const [terminalOutput, setTerminalOutput] = useState([
    '$ npm install',
    'Installing dependencies...',
    '✅ Dependencies installed successfully',
    '$ npm run dev',
    '🚀 Development server started on http://localhost:3000'
  ])

  const features = [
    {
      icon: Brain,
      title: 'AI Code Assistant',
      description: 'Get intelligent code suggestions and completions',
      color: 'text-blue-500'
    },
    {
      icon: Terminal,
      title: 'Integrated Terminal',
      description: 'Run commands directly in the IDE',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time',
      color: 'text-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure Sandbox',
      description: 'Execute code safely in isolated environment',
      color: 'text-red-500'
    }
  ]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Unified IDE</span>
              <p className="text-xs text-muted-foreground">AI-Powered Development Environment</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Collaborate
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
              <Rocket className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          {/* File Explorer */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Explorer</h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                    file.isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                >
                  <File className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm mb-3">AI Assistant</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Brain className="h-4 w-4 mr-2" />
                Generate Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Explain Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Optimize
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Save className="h-4 w-4 mr-2" />
                Save All
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="border-b bg-muted/30">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-10">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="terminal" className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Terminal
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="collaboration" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Collaboration
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Code Editor */}
              <TabsContent value="editor" className="h-full m-0">
                <div className="h-full flex">
                  {/* Code Editor */}
                  <div className="flex-1 p-4">
                    <div className="h-full border rounded-lg bg-card">
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <File className="h-4 w-4" />
                            <span className="font-medium">app.tsx</span>
                            <Badge variant="secondary">TypeScript</Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 h-full overflow-auto">
                        <pre className="text-sm font-mono">
{`import React from 'react'
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Welcome to Unified Platform</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Build applications with AI assistance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Real-time Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Work together with your team</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Secure Sandbox</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Execute code safely</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* AI Panel */}
                  <div className="w-80 border-l bg-muted/30 p-4">
                    <h3 className="font-semibold mb-4">AI Assistant</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-card rounded-lg border">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Code Suggestions</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          AI suggests: Add error handling for the Button component
                        </p>
                      </div>
                      
                      <div className="p-3 bg-card rounded-lg border">
                        <div className="flex items-center space-x-2 mb-2">
                          <Search className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Code Analysis</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Code quality: Excellent. No issues found.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-card rounded-lg border">
                        <div className="flex items-center space-x-2 mb-2">
                          <RefreshCw className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Optimization</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Performance: Optimized. Bundle size: 2.3MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Terminal */}
              <TabsContent value="terminal" className="h-full m-0">
                <div className="h-full p-4">
                  <div className="h-full bg-black text-green-400 font-mono text-sm rounded-lg p-4 overflow-auto">
                    {terminalOutput.map((line, index) => (
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
              </TabsContent>

              {/* AI Assistant */}
              <TabsContent value="ai" className="h-full m-0">
                <div className="h-full p-4">
                  <div className="h-full flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
                      <p className="text-sm text-muted-foreground">
                        Get help with your code, generate new features, or optimize existing code.
                      </p>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${feature.color.replace('text-', 'from-').replace('-500', '-500/20')} to-${feature.color.replace('text-', '').replace('-500', '-500/10')} flex items-center justify-center`}>
                                <feature.icon className={`h-5 w-5 ${feature.color}`} />
                              </div>
                              <div>
                                <CardTitle className="text-base">{feature.title}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                            <Button size="sm" className="mt-3 w-full">
                              Try Now
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Collaboration */}
              <TabsContent value="collaboration" className="h-full m-0">
                <div className="h-full p-4">
                  <div className="h-full flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Real-time Collaboration</h3>
                      <p className="text-sm text-muted-foreground">
                        Work together with your team in real-time.
                      </p>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Team Members</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                                A
                              </div>
                              <div>
                                <p className="text-sm font-medium">Alice Johnson</p>
                                <p className="text-xs text-muted-foreground">Online</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                                B
                              </div>
                              <div>
                                <p className="text-sm font-medium">Bob Smith</p>
                                <p className="text-xs text-muted-foreground">Online</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5" />
                            <span>Chat</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-sm">Hey, I'm working on the authentication module</p>
                              <p className="text-xs text-muted-foreground">Alice - 2 minutes ago</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <p className="text-sm">Great! I'll help with the UI components</p>
                              <p className="text-xs text-muted-foreground">Bob - 1 minute ago</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}