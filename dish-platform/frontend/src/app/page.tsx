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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dish Platform</span>
                <p className="text-xs text-muted-foreground">AI-Powered Development</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#docs" className="text-sm font-medium hover:text-primary transition-colors relative group">
                Documentation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-primary">
            <Sparkles className="h-3 w-3 mr-2" />
            Now in Beta - Join the Future
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
            Advanced AI Development Environment
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            A comprehensive full-stack development platform with AI integration, real-time collaboration, 
            and advanced tooling for modern developers. Build faster, smarter, and more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl transform hover:scale-105 transition-all">
              <Link href="/ide" className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Launch IDE
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary/10 transform hover:scale-105 transition-all">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary/10 transform hover:scale-105 transition-all">
              <Link href="https://github.com/your-username/dish-platform" target="_blank" className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                View on GitHub
              </Link>
            </Button>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur border">
              <Brain className="h-8 w-8 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">15+ AI providers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur border">
              <Users className="h-8 w-8 text-secondary" />
              <div className="text-left">
                <h3 className="font-semibold">Real-time</h3>
                <p className="text-sm text-muted-foreground">Live collaboration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur border">
              <Shield className="h-8 w-8 text-green-500" />
              <div className="text-left">
                <h3 className="font-semibold">Secure</h3>
                <p className="text-sm text-muted-foreground">Sandbox execution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-muted/30 to-muted/10 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Developers Worldwide</h2>
            <p className="text-muted-foreground">Join thousands of developers building amazing applications</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="h-3 w-3 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Everything You Need to Build Amazing Apps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From AI-powered code generation to real-time collaboration, Dish Platform provides all the tools 
              modern developers need to build, test, and deploy applications efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader className="pb-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color.replace('text-', 'from-').replace('-500', '-500/20')} to-${feature.color.replace('text-', '').replace('-500', '-500/10')} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/30 to-muted/10 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Globe className="h-3 w-3 mr-2" />
              Live Demo
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              See It In Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the power of AI-assisted development with our interactive demo. 
              See how Dish Platform transforms your development workflow.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur border-2">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Code2 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="editor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Terminal className="h-4 w-4 mr-2" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Brain className="h-4 w-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4 mr-2" />
                Collaboration
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-8">
              <Card className="border-2 bg-card/50 backdrop-blur">
                <CardContent className="p-8">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/20">
                    <div className="text-center">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Code2 className="h-10 w-10 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Interactive Demo</h3>
                      <p className="text-muted-foreground mb-4">Experience the full power of Dish Platform</p>
                      <Button className="bg-gradient-to-r from-primary to-secondary">
                        <Rocket className="h-4 w-4 mr-2" />
                        Launch Demo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="editor" className="mt-8">
              <Card className="border-2 bg-card/50 backdrop-blur">
                <CardContent className="p-8">
                  <div className="aspect-video bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border-2 border-dashed border-green-500/20">
                    <div className="text-center">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Terminal className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Advanced Code Editor</h3>
                      <p className="text-muted-foreground mb-4">Monaco editor with AI-powered features</p>
                      <Button className="bg-gradient-to-r from-green-500 to-blue-500">
                        <Terminal className="h-4 w-4 mr-2" />
                        Try Editor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-8">
              <Card className="border-2 bg-card/50 backdrop-blur">
                <CardContent className="p-8">
                  <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-500/20">
                    <div className="text-center">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">AI Assistant</h3>
                      <p className="text-muted-foreground mb-4">15+ AI providers at your fingertips</p>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Brain className="h-4 w-4 mr-2" />
                        Chat with AI
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="collaboration" className="mt-8">
              <Card className="border-2 bg-card/50 backdrop-blur">
                <CardContent className="p-8">
                  <div className="aspect-video bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl flex items-center justify-center border-2 border-dashed border-orange-500/20">
                    <div className="text-center">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Real-time Collaboration</h3>
                      <p className="text-muted-foreground mb-4">Work together seamlessly</p>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500">
                        <Users className="h-4 w-4 mr-2" />
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
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-primary">
            <Heart className="h-3 w-3 mr-2" />
            Join the Future
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers who are already building amazing applications with Dish Platform. 
            Start your journey today and experience the future of development.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl transform hover:scale-105 transition-all text-lg px-8 py-6">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Rocket className="h-6 w-6" />
                Start Building Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary/10 transform hover:scale-105 transition-all text-lg px-8 py-6">
              <Link href="/docs" className="flex items-center gap-3">
                <ExternalLink className="h-5 w-5" />
                Read Documentation
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Open Source</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Free</div>
              <div className="text-sm text-muted-foreground">Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Code2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dish Platform</span>
                  <p className="text-xs text-muted-foreground">AI-Powered Development</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Advanced AI-powered development environment for modern developers. 
                Build faster, smarter, and more efficiently with our comprehensive platform.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://github.com/your-username/dish-platform" target="_blank">
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="https://twitter.com/dishplatform" target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-primary transition-colors">API Reference</Link></li>
                <li><Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Resources</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link></li>
                <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
                <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
                <li><Link href="/status" className="hover:text-primary transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; 2024 Dish Platform. All rights reserved. Built with ❤️ for developers.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>by developers, for developers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}