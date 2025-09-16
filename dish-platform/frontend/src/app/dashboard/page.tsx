'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Plus,
  Settings,
  Bell,
  Search,
  FileText,
  Play,
  Download,
  Upload
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('projects')

  const recentProjects = [
    {
      id: '1',
      name: 'React Todo App',
      language: 'TypeScript',
      framework: 'React',
      lastModified: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Node.js API',
      language: 'JavaScript',
      framework: 'Express',
      lastModified: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Python ML Model',
      language: 'Python',
      framework: 'FastAPI',
      lastModified: '3 days ago',
      status: 'archived'
    }
  ]

  const aiProviders = [
    { name: 'OpenAI', status: 'connected', models: 5 },
    { name: 'Anthropic', status: 'connected', models: 3 },
    { name: 'Google', status: 'connected', models: 4 },
    { name: 'Mistral', status: 'disconnected', models: 0 }
  ]

  const quickActions = [
    { icon: Plus, label: 'New Project', action: 'create-project' },
    { icon: FileText, label: 'Import Code', action: 'import-code' },
    { icon: Play, label: 'Run Sandbox', action: 'run-sandbox' },
    { icon: Brain, label: 'AI Assistant', action: 'ai-chat' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">Dish Platform</h1>
                <p className="text-sm text-muted-foreground">Development Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Ready to build something amazing?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <action.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">{action.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-semibold">Recent Projects</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid gap-4">
              {recentProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{project.name}</h4>
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                          <span>{project.language}</span>
                          <span>•</span>
                          <span>{project.framework}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Last modified: {project.lastModified}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Providers
                  </CardTitle>
                  <CardDescription>
                    Manage your AI provider connections and API keys
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiProviders.map((provider) => (
                    <div key={provider.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${
                          provider.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {provider.models} models available
                          </p>
                        </div>
                      </div>
                      <Badge variant={provider.status === 'connected' ? 'default' : 'secondary'}>
                        {provider.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Chat</CardTitle>
                  <CardDescription>
                    Start a conversation with your AI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
                    <div className="text-center">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">AI Chat interface coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Terminal Tab */}
          <TabsContent value="terminal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Integrated Terminal
                </CardTitle>
                <CardDescription>
                  Execute commands and run scripts directly in your browser
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-black text-green-400 font-mono text-sm p-4 rounded-lg overflow-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-white">Terminal</span>
                  </div>
                  <div className="space-y-1">
                    <div>$ Welcome to Dish Platform Terminal</div>
                    <div>$ Type 'help' for available commands</div>
                    <div className="flex items-center gap-2">
                      <span>$</span>
                      <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your projects
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your development environment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred color scheme
                      </p>
                    </div>
                    <Button variant="outline" size="sm">System</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Default Language</p>
                      <p className="text-sm text-muted-foreground">
                        Set your preferred programming language
                      </p>
                    </div>
                    <Button variant="outline" size="sm">TypeScript</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}