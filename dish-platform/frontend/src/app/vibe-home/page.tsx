'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function VibeHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDemo, setActiveDemo] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  const demos = [
    {
      title: "E-commerce Store",
      description: "Full-featured online store with AI recommendations",
      type: "Web App",
      framework: "Next.js",
      features: ["Payment Integration", "AI Recommendations", "Real-time Chat", "Mobile Responsive"],
      preview: "/api/placeholder/400/300"
    },
    {
      title: "Fitness Tracker",
      description: "Mobile app for workout tracking and nutrition",
      type: "Mobile App", 
      framework: "React Native",
      features: ["Workout Tracking", "Nutrition Log", "Progress Charts", "Social Features"],
      preview: "/api/placeholder/400/300"
    },
    {
      title: "Task Manager",
      description: "Collaborative task management with AI assistance",
      type: "Web App",
      framework: "Vue.js",
      features: ["Team Collaboration", "AI Task Suggestions", "Time Tracking", "Project Analytics"],
      preview: "/api/placeholder/400/300"
    }
  ]

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Generate complete applications with natural language descriptions",
      color: "text-purple-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Build and deploy apps in minutes, not months",
      color: "text-yellow-500"
    },
    {
      icon: Shield,
      title: "Production Ready",
      description: "All generated apps are production-ready with best practices",
      color: "text-green-500"
    },
    {
      icon: Globe,
      title: "Multi-Platform",
      description: "Generate web, mobile, and desktop apps from one description",
      color: "text-blue-500"
    }
  ]

  const stats = [
    { number: "10K+", label: "Apps Generated" },
    { number: "50K+", label: "Developers" },
    { number: "99.9%", label: "Uptime" },
    { number: "2min", label: "Avg Build Time" }
  ]

  const frameworks = [
    { name: "Next.js", icon: "⚡", color: "bg-black text-white" },
    { name: "React", icon: "⚛️", color: "bg-blue-500 text-white" },
    { name: "Vue.js", icon: "💚", color: "bg-green-500 text-white" },
    { name: "Angular", icon: "🅰️", color: "bg-red-500 text-white" },
    { name: "React Native", icon: "📱", color: "bg-blue-600 text-white" },
    { name: "Flutter", icon: "🦋", color: "bg-blue-400 text-white" },
    { name: "Express", icon: "🚀", color: "bg-gray-600 text-white" },
    { name: "FastAPI", icon: "🐍", color: "bg-green-600 text-white" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleGenerateDemo = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsGenerating(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                VibeCode
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white hover:text-purple-400 transition-colors">Features</a>
              <a href="#demos" className="text-white hover:text-purple-400 transition-colors">Demos</a>
              <a href="#pricing" className="text-white hover:text-purple-400 transition-colors">Pricing</a>
              <a href="#docs" className="text-white hover:text-purple-400 transition-colors">Docs</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Get Started
              </Button>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-white hover:text-purple-400 transition-colors">Features</a>
              <a href="#demos" className="block text-white hover:text-purple-400 transition-colors">Demos</a>
              <a href="#pricing" className="block text-white hover:text-purple-400 transition-colors">Pricing</a>
              <a href="#docs" className="block text-white hover:text-purple-400 transition-colors">Docs</a>
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Sign In
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-6">
              <Sparkles className="h-3 w-3 mr-2" />
              AI-Powered App Builder
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Build Apps
              </span>
              <br />
              <span className="text-white">with AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Describe your app idea in plain English and watch AI generate a complete, 
              production-ready application in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-medium shadow-2xl"
              onClick={handleGenerateDemo}
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
                  <span>Start Building</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {isGenerating && (
            <div className="max-w-md mx-auto mb-8">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-2">Generating your app...</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Why Choose VibeCode?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The most advanced AI-powered app builder that transforms your ideas into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all group">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demos" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                See It In Action
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real apps generated by VibeCode AI in under 2 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {demos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDemo(index)}
                    className={`h-3 w-3 rounded-full transition-all ${
                      index === activeDemo ? 'bg-purple-500 w-8' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <div className="space-y-4">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 w-fit">
                  {demos[activeDemo].type}
                </Badge>
                <h3 className="text-3xl font-bold text-white">{demos[activeDemo].title}</h3>
                <p className="text-gray-300 text-lg">{demos[activeDemo].description}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-gray-400">Built with:</span>
                  <Badge className="bg-gray-700 text-white">{demos[activeDemo].framework}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {demos[activeDemo].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/10 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-400">App Preview</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frameworks Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                All Frameworks Supported
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Generate apps using your favorite frameworks and technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {frameworks.map((framework, index) => (
              <Card key={index} className="bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`h-12 w-12 rounded-xl ${framework.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <span className="text-lg">{framework.icon}</span>
                  </div>
                  <h3 className="text-white font-medium text-sm">{framework.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Build?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers building the future with AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-medium"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start Building Free
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Join Discord
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  VibeCode
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                The future of app development is here. Build faster, smarter, and more efficiently with AI.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Product</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Features</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Pricing</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">API</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Integrations</a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Tutorials</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Community</a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Company</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">About</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Contact</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 VibeCode. All rights reserved. Built with ❤️ and AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}