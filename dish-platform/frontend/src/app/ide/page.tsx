'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import CodeEditor from '@/components/CodeEditor'
import Terminal from '@/components/Terminal'
import AIAssistant from '@/components/AIAssistant'
import FileManager from '@/components/FileManager'
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Terminal as TerminalIcon,
  Brain,
  FileText,
  Folder,
  Search,
  GitBranch,
  RefreshCw,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelRight,
  Layout,
  Zap,
  Code2,
  Database,
  Cloud,
  Users,
  Bell,
  User
} from 'lucide-react'

export default function IDEPage() {
  const [activeTab, setActiveTab] = useState('editor')
  const [leftPanelVisible, setLeftPanelVisible] = useState(true)
  const [rightPanelVisible, setRightPanelVisible] = useState(true)
  const [bottomPanelVisible, setBottomPanelVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleCodeRun = (code: string, language: string) => {
    console.log('Running code:', { code, language })
  }

  const handleCodeChange = (code: string) => {
    console.log('Code changed:', code)
  }

  const handleFileSelect = (file: any) => {
    console.log('File selected:', file)
  }

  const handleAIResponse = (response: string) => {
    console.log('AI response:', response)
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-3 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Dish IDE</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <GitBranch className="h-4 w-4 mr-2" />
              main
            </Button>
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        {leftPanelVisible && (
          <div className="w-80 border-r bg-card/30 backdrop-blur flex flex-col">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Explorer</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Layout className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <FileManager 
                onFileSelect={handleFileSelect}
                onFileEdit={(file) => console.log('Edit file:', file)}
                onFileDelete={(file) => console.log('Delete file:', file)}
              />
            </div>
          </div>
        )}

        {/* Center Panel */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="flex items-center border-b bg-card/30 backdrop-blur">
            <div className="flex items-center gap-1 p-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">App.tsx</span>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  ×
                </Button>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <FileText className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">index.css</span>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  ×
                </Button>
              </div>
            </div>
            
            <div className="flex-1"></div>
            
            <div className="flex items-center gap-2 p-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1">
            <CodeEditor
              initialCode={`// Welcome to Dish Platform IDE
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const App = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Hello, Dish Platform!');

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {message}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              {count}
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleIncrement}>
                Increment
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;`}
              language="typescript"
              onCodeChange={handleCodeChange}
              onRun={handleCodeRun}
            />
          </div>
        </div>

        {/* Right Panel */}
        {rightPanelVisible && (
          <div className="w-80 border-l bg-card/30 backdrop-blur">
            <Tabs defaultValue="ai" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur border-b">
                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                <TabsTrigger value="explorer">Explorer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai" className="flex-1 m-0">
                <AIAssistant
                  onCodeGenerated={(code) => console.log('Generated code:', code)}
                  onCodeOptimized={(code) => console.log('Optimized code:', code)}
                  onCodeExplained={(explanation) => console.log('Explanation:', explanation)}
                />
              </TabsContent>
              
              <TabsContent value="explorer" className="flex-1 m-0">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Project Explorer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Dependencies</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>• React 19.0.0</div>
                        <div>• Next.js 15.0.0</div>
                        <div>• TypeScript 5.3.3</div>
                        <div>• Tailwind CSS 4.0.0</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Scripts</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>• npm run dev</div>
                        <div>• npm run build</div>
                        <div>• npm run test</div>
                        <div>• npm run lint</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Environment</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>• Node.js v18.0.0</div>
                        <div>• npm v9.0.0</div>
                        <div>• Git v2.40.0</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      {bottomPanelVisible && (
        <div className="h-64 border-t bg-card/30 backdrop-blur">
          <Tabs defaultValue="terminal" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur border-b">
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="debug">Debug</TabsTrigger>
            </TabsList>
            
            <TabsContent value="terminal" className="flex-1 m-0">
              <Terminal 
                onCommand={(command) => console.log('Command:', command)}
                className="h-full"
              />
            </TabsContent>
            
            <TabsContent value="problems" className="flex-1 m-0 p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Error: Cannot find module 'react'</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Warning: Unused variable 'unusedVar'</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="output" className="flex-1 m-0 p-4">
              <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-full overflow-auto">
                <div>$ npm run dev</div>
                <div className="text-blue-300">✓ Starting development server...</div>
                <div className="text-green-300">✓ Ready on http://localhost:3000</div>
                <div className="text-yellow-300">⚠ 2 warnings found</div>
                <div className="text-gray-400">---</div>
                <div>$ Next.js 15.0.0</div>
                <div>$ React 19.0.0</div>
                <div>$ TypeScript 5.3.3</div>
              </div>
            </TabsContent>
            
            <TabsContent value="debug" className="flex-1 m-0 p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Debug session started</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Breakpoint hit at line 15</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Panel Controls */}
      <div className="absolute top-20 left-0 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLeftPanelVisible(!leftPanelVisible)}
          className="rounded-r-none"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute top-20 right-0 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRightPanelVisible(!rightPanelVisible)}
          className="rounded-l-none"
        >
          <PanelRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute bottom-0 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setBottomPanelVisible(!bottomPanelVisible)}
          className="rounded-b-none"
        >
          {bottomPanelVisible ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}