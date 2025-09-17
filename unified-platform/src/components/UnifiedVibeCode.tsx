'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  Code2, 
  Terminal, 
  Zap, 
  Play, 
  Download, 
  Upload,
  Settings,
  Users,
  Monitor,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Rocket,
  Globe,
  Database,
  Network,
  Shield,
  Brain,
  FileText,
  Folder,
  Plus,
  Minus,
  RefreshCw,
  Maximize2,
  Minimize2,
  X,
  Check,
  Info,
  HelpCircle,
  Star,
  Heart,
  Github,
  ExternalLink
} from 'lucide-react'

export default function UnifiedVibeCode() {
  const [activeProject, setActiveProject] = useState('new-project')
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildProgress, setBuildProgress] = useState(0)

  const frameworks = [
    { name: 'Next.js', icon: '⚡', color: 'bg-black text-white' },
    { name: 'React', icon: '⚛️', color: 'bg-blue-500 text-white' },
    { name: 'Vue', icon: '💚', color: 'bg-green-500 text-white' },
    { name: 'Angular', icon: '🅰️', color: 'bg-red-500 text-white' },
    { name: 'React Native', icon: '📱', color: 'bg-blue-600 text-white' },
    { name: 'Flutter', icon: '🦋', color: 'bg-blue-400 text-white' }
  ]

  const projects = [
    { id: 'new-project', name: 'New Project', status: 'ready', lastModified: 'Just now' },
    { id: 'ecommerce-app', name: 'E-commerce App', status: 'building', lastModified: '2 minutes ago' },
    { id: 'portfolio-site', name: 'Portfolio Site', status: 'completed', lastModified: '1 hour ago' },
    { id: 'blog-platform', name: 'Blog Platform', status: 'error', lastModified: '3 hours ago' }
  ]

  const handleBuild = () => {
    setIsBuilding(true)
    setBuildProgress(0)
    
    const interval = setInterval(() => {
      setBuildProgress(prev => {
        if (prev >= 100) {
          setIsBuilding(false)
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">VibeCode</span>
              <p className="text-xs text-muted-foreground">AI-Powered App Builder</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Team
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
        <div className="w-80 border-r bg-muted/30 p-4">
          {/* Projects */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Folder className="h-5 w-5" />
                <span>Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      activeProject === project.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveProject(project.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {project.status === 'ready' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {project.status === 'building' && <Clock className="h-4 w-4 text-blue-500" />}
                        {project.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {project.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      </div>
                      <span className="text-sm">{project.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{project.lastModified}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Project
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Project
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Project Header */}
          <div className="border-b bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Build Apps with AI</h2>
                <p className="text-sm text-muted-foreground">Create amazing applications with AI assistance</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">AI-Powered</Badge>
                <Badge variant="outline">Real-time</Badge>
                <Badge variant="outline">Secure</Badge>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Frameworks Grid */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Choose Framework</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {frameworks.map((framework, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className={`h-12 w-12 rounded-lg ${framework.color} flex items-center justify-center mx-auto mb-3 text-2xl`}>
                        {framework.icon}
                      </div>
                      <h4 className="font-medium text-sm">{framework.name}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Builder */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">AI App Builder</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Generate Your App</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">App Description</label>
                      <textarea
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={3}
                        placeholder="Describe the app you want to build..."
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button onClick={handleBuild} disabled={isBuilding} className="bg-gradient-to-r from-primary to-secondary">
                        {isBuilding ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Building...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Generate App
                          </>
                        )}
                      </Button>
                      {isBuilding && (
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${buildProgress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{buildProgress}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="h-5 w-5" />
                    <span>Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                    <div className="text-center">
                      <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">App preview will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deployment */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Deployment</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Rocket className="h-5 w-5" />
                    <span>Deploy to Production</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="font-medium">Vercel</h4>
                        <p className="text-sm text-muted-foreground">Deploy to Vercel</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Database className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <h4 className="font-medium">AWS</h4>
                        <p className="text-sm text-muted-foreground">Deploy to AWS</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Network className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <h4 className="font-medium">Custom</h4>
                        <p className="text-sm text-muted-foreground">Custom deployment</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}