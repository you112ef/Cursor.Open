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
  Layers
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('overview')

  const features = [
    {
      icon: Brain,
      title: 'Multi-Provider AI',
      description: 'Integrate with 15+ AI providers including OpenAI, Anthropic, Google, and more',
      color: 'text-blue-500'
    },
    {
      icon: Code2,
      title: 'Advanced Code Editor',
      description: 'Monaco editor with syntax highlighting, IntelliSense, and AI-powered completion',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Collaborate with team members in real-time with conflict resolution',
      color: 'text-purple-500'
    },
    {
      icon: Terminal,
      title: 'Integrated Terminal',
      description: 'Built-in terminal with full shell access and command execution',
      color: 'text-orange-500'
    },
    {
      icon: Zap,
      title: 'AI Code Generation',
      description: 'Generate, optimize, and refactor code with AI assistance',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Secure Sandbox',
      description: 'Execute code safely in isolated containers with resource limits',
      color: 'text-red-500'
    },
    {
      icon: GitBranch,
      title: 'Git Integration',
      description: 'Seamless integration with GitHub, GitLab, and Bitbucket',
      color: 'text-gray-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Deployment',
      description: 'Deploy applications directly to cloud platforms',
      color: 'text-cyan-500'
    }
  ]

  const stats = [
    { label: 'AI Providers', value: '15+' },
    { label: 'Supported Languages', value: '50+' },
    { label: 'Active Users', value: '10K+' },
    { label: 'Projects Created', value: '100K+' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Code2 className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dish Platform</span>
                <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Development</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#docs" className="text-sm font-medium hover:text-primary transition-colors relative group">
                Docs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg text-sm px-3 py-2">
                <Link href="/dashboard" className="flex items-center gap-1 sm:gap-2">
                  <Rocket className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Link>
              </Button>
            </nav>
            {/* Mobile Menu Button */}
            <Button variant="outline" size="sm" className="lg:hidden">
              <span className="sr-only">Open menu</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 sm:mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-primary text-xs sm:text-sm">
            <Sparkles className="h-3 w-3 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Now in Beta - Join the Future</span>
            <span className="sm:hidden">Beta - Join Future</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient leading-tight">
            Advanced AI Development Environment
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
            A comprehensive full-stack development platform with AI integration, real-time collaboration, 
            and advanced tooling for modern developers. Build faster, smarter, and more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-2">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl transform hover:scale-105 transition-all w-full sm:w-auto">
              <Link href="/ide" className="flex items-center justify-center gap-2">
                <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
                Launch IDE
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
            <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4">
              <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary/10 transform hover:scale-105 transition-all">
                <Link href="/vibe" className="flex items-center justify-center gap-1 sm:gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">VibeCode</span>
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary/10 transform hover:scale-105 transition-all">
                <Link href="/agent" className="flex items-center justify-center gap-1 sm:gap-2">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Agent CLI</span>
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4">
              <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary/10 transform hover:scale-105 transition-all">
                <Link href="/dashboard" className="flex items-center justify-center gap-1 sm:gap-2">
                  <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Dashboard</span>
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary/10 transform hover:scale-105 transition-all">
                <Link href="https://github.com/your-username/dish-platform" target="_blank" className="flex items-center justify-center gap-1 sm:gap-2">
                  <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">GitHub</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur border">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <div className="text-left min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">AI-Powered</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">15+ AI providers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur border">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-secondary flex-shrink-0" />
              <div className="text-left min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">Real-time</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Live collaboration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur border sm:col-span-2 lg:col-span-1">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
              <div className="text-left min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">Secure</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Sandbox execution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-muted/30 to-muted/10 relative">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Trusted by Developers Worldwide</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">Join thousands of developers building amazing applications</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">
              <Sparkles className="h-3 w-3 mr-1 sm:mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
              Everything You Need to Build Amazing Apps
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
              From AI-powered code generation to real-time collaboration, Dish Platform provides all the tools 
              modern developers need to build, test, and deploy applications efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${feature.color.replace('text-', 'from-').replace('-500', '-500/20')} to-${feature.color.replace('text-', '').replace('-500', '-500/10')} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <CardDescription className="text-sm sm:text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-muted/30 to-muted/10 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">
              <Globe className="h-3 w-3 mr-1 sm:mr-2" />
              Live Demo
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
              See It In Action
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
              Experience the power of AI-assisted development with our interactive demo. 
              See how Dish Platform transforms your development workflow.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-card/50 backdrop-blur border-2">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                <Code2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="editor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                <Terminal className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Code Editor</span>
                <span className="sm:hidden">Editor</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">AI Assistant</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Collaboration</span>
                <span className="sm:hidden">Team</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 sm:mt-8">
              <Card className="border-2 bg-card/50 backdrop-blur">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/20">
                    <div className="text-center px-4">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
                        <Code2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Interactive Demo</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">Experience the full power of Dish Platform</p>
                      <Button className="bg-gradient-to-r from-primary to-secondary text-sm sm:text-base">
                        <Rocket className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Launch Demo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="editor" className="mt-6 sm:mt-8">
              <Card className="border-2 bg-card/50 backdrop-blur">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="aspect-video bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border-2 border-dashed border-green-500/20">
                    <div className="text-center px-4">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
                        <Terminal className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Advanced Code Editor</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">Monaco editor with AI-powered features</p>
                      <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-sm sm:text-base">
                        <Terminal className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Try Editor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-6 sm:mt-8">
              <Card className="border-2 bg-card/50 backdrop-blur">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-500/20">
                    <div className="text-center px-4">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
                        <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">AI Assistant</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">15+ AI providers at your fingertips</p>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-sm sm:text-base">
                        <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Chat with AI
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="collaboration" className="mt-6 sm:mt-8">
              <Card className="border-2 bg-card/50 backdrop-blur">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="aspect-video bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl flex items-center justify-center border-2 border-dashed border-orange-500/20">
                    <div className="text-center px-4">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
                        <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Real-time Collaboration</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">Work together seamlessly</p>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-sm sm:text-base">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Start Collaborating
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-4 sm:mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-primary text-xs sm:text-sm">
            <Heart className="h-3 w-3 mr-1 sm:mr-2" />
            Join the Future
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-sm sm:text-base lg:text-xl xl:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Join thousands of developers who are already building amazing applications with Dish Platform. 
            Start your journey today and experience the future of development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl transform hover:scale-105 transition-all text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
              <Link href="/dashboard" className="flex items-center justify-center gap-2 sm:gap-3">
                <Rocket className="h-4 w-4 sm:h-5 sm:h-6 sm:w-6" />
                Start Building Now
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary/10 transform hover:scale-105 transition-all text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
              <Link href="/docs" className="flex items-center justify-center gap-2 sm:gap-3">
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                Read Documentation
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Open Source</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">Free</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Code2 className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dish Platform</span>
                  <p className="text-xs text-muted-foreground">AI-Powered Development</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                Advanced AI-powered development environment for modern developers. 
                Build faster, smarter, and more efficiently with our comprehensive platform.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://github.com/your-username/dish-platform" target="_blank">
                    <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://twitter.com/dishplatform" target="_blank">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Product</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-primary transition-colors">API Reference</Link></li>
                <li><Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Resources</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link></li>
                <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
                <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
                <li><Link href="/status" className="hover:text-primary transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Company</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              &copy; 2024 Dish Platform. All rights reserved. Built with ❤️ for developers.
            </p>
            <div className="flex items-center space-x-3 sm:space-x-6 text-xs sm:text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 animate-pulse" />
              <span>by developers, for developers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}