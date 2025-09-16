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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dish Platform</h1>
                <p className="text-sm text-muted-foreground">Development Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/10">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back!
          </h2>
          <p className="text-xl text-muted-foreground">Ready to build something amazing? Let's get started!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card/50 backdrop-blur border-2">
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Brain className="h-4 w-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="terminal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Terminal className="h-4 w-4 mr-2" />
              Terminal
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">Recent Projects</h3>
                <p className="text-muted-foreground">Manage and access your development projects</p>
              </div>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid gap-6">
              {recentProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20 bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Code2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">{project.name}</h4>
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                          <span className="px-2 py-1 bg-primary/10 rounded-md">{project.language}</span>
                          <span className="px-2 py-1 bg-secondary/10 rounded-md">{project.framework}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Last modified: {project.lastModified}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="hover:bg-primary/10">
                          <Play className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
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