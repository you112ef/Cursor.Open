'use client'

import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Activity
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Development',
      description: '15+ AI providers including OpenAI, Anthropic, Google, Mistral, and more',
      color: 'text-blue-500',
      link: '/agent'
    },
    {
      icon: Code2,
      title: 'Advanced IDE',
      description: 'Monaco editor with syntax highlighting, IntelliSense, and AI-powered completion',
      color: 'text-green-500',
      link: '/ide'
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Collaborate with team members in real-time with conflict resolution',
      color: 'text-purple-500',
      link: '/collaboration'
    },
    {
      icon: Terminal,
      title: 'Agent CLI Terminal',
      description: 'AI-powered command-line interface with system monitoring',
      color: 'text-orange-500',
      link: '/agent'
    },
    {
      icon: Zap,
      title: 'AI App Builder',
      description: 'Build applications with AI assistance and real-time progress tracking',
      color: 'text-yellow-500',
      link: '/builder'
    },
    {
      icon: Shield,
      title: 'Secure Sandbox',
      description: 'Execute code safely in isolated containers with resource limits',
      color: 'text-red-500',
      link: '/sandbox'
    },
    {
      icon: GitBranch,
      title: 'VibeCode Clone',
      description: '100% authentic replica of vibecodeapp.dev with all features',
      color: 'text-gray-500',
      link: '/vibe'
    },
    {
      icon: Cloud,
      title: 'Auto Deployment',
      description: 'Deploy applications directly to Vercel with one click',
      color: 'text-cyan-500',
      link: '/builder'
    }
  ]

  const stats = [
    { label: 'AI Providers', value: '15+', icon: Brain },
    { label: 'Supported Languages', value: '50+', icon: Code2 },
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Projects Created', value: '100K+', icon: Rocket }
  ]

  const quickActions = [
    { title: 'Launch IDE', description: 'Start coding with AI assistance', icon: Code2, link: '/ide', color: 'bg-green-500' },
    { title: 'Agent CLI', description: 'AI-powered terminal commands', icon: Terminal, link: '/agent', color: 'bg-orange-500' },
    { title: 'Build App', description: 'Create applications with AI', icon: Zap, link: '/builder', color: 'bg-yellow-500' },
    { title: 'Collaborate', description: 'Work with your team', icon: Users, link: '/collaboration', color: 'bg-purple-500' },
    { title: 'VibeCode', description: 'Access VibeCode clone', icon: Sparkles, link: '/vibe', color: 'bg-pink-500' },
    { title: 'Sandbox', description: 'Execute code safely', icon: Shield, link: '/sandbox', color: 'bg-red-500' }
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
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Unified Platform</span>
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
                <Link href="/ide" className="flex items-center gap-1 sm:gap-2">
                  <Rocket className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 sm:mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-primary text-xs sm:text-sm">
            <Sparkles className="h-3 w-3 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Unified AI Development Platform</span>
            <span className="sm:hidden">Unified Platform</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient leading-tight">
            Everything You Need to Build Amazing Apps
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
            A comprehensive unified platform combining Agenticseek, Dish Platform, AI Assistant, 
            and VibeCode Clone. Build faster, smarter, and more efficiently with AI-powered tools.
          </p>
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-6xl mx-auto">
            {quickActions.map((action, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader className="pb-3 p-4">
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-base group-hover:text-primary transition-colors">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-xs sm:text-sm leading-relaxed mb-3">{action.description}</CardDescription>
                  <Button asChild size="sm" className="w-full">
                    <Link href={action.link} className="flex items-center justify-center gap-1">
                      <span className="text-xs">Launch</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-muted/30 to-muted/10 relative">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Platform Statistics</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">Comprehensive metrics across all integrated platforms</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
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
              Unified Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
              All Platforms Integrated
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
              Experience the power of unified development with all platforms working together seamlessly.
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
                  <CardDescription className="text-sm sm:text-base leading-relaxed mb-4">{feature.description}</CardDescription>
                  <Button asChild className="w-full">
                    <Link href={feature.link} className="flex items-center justify-center gap-2">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-4 sm:mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-primary text-xs sm:text-sm">
            <Heart className="h-3 w-3 mr-1 sm:mr-2" />
            Ready to Start?
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
            Launch Your Development Journey
          </h2>
          <p className="text-sm sm:text-base lg:text-xl xl:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Start building amazing applications with our unified AI-powered development platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl transform hover:scale-105 transition-all text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
              <Link href="/ide" className="flex items-center justify-center gap-2 sm:gap-3">
                <Rocket className="h-4 w-4 sm:h-5 sm:h-6 sm:w-6" />
                Launch IDE
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary/10 transform hover:scale-105 transition-all text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
              <Link href="/agent" className="flex items-center justify-center gap-2 sm:gap-3">
                <Terminal className="h-4 w-4 sm:h-5 sm:w-5" />
                Agent CLI
              </Link>
            </Button>
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
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Unified Platform</span>
                  <p className="text-xs text-muted-foreground">AI-Powered Development</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                Comprehensive unified platform combining all development tools and AI capabilities in one place.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Platforms</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/ide" className="hover:text-primary transition-colors">IDE</Link></li>
                <li><Link href="/agent" className="hover:text-primary transition-colors">Agent CLI</Link></li>
                <li><Link href="/collaboration" className="hover:text-primary transition-colors">Collaboration</Link></li>
                <li><Link href="/builder" className="hover:text-primary transition-colors">App Builder</Link></li>
                <li><Link href="/vibe" className="hover:text-primary transition-colors">VibeCode</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Features</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">AI Development</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">Real-time Collaboration</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">Secure Sandbox</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">Auto Deployment</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">System Monitoring</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Resources</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="#docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/sandbox" className="hover:text-primary transition-colors">Sandbox</Link></li>
                <li><Link href="/collaboration" className="hover:text-primary transition-colors">Support</Link></li>
                <li><Link href="/agent" className="hover:text-primary transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              &copy; 2024 Unified Platform. All rights reserved. Built with ❤️ for developers.
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