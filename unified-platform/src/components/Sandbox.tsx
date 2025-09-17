'use client'

import { useState, useRef, useEffect } from 'react'
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
  Database,
  Globe,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  Folder,
  Trash2,
  Copy,
  Save
} from 'lucide-react'

interface ExecutionResult {
  id: string
  code: string
  language: string
  output: string
  error?: string
  status: 'success' | 'error' | 'running' | 'timeout'
  executionTime: number
  timestamp: Date
  memoryUsage?: number
}

interface SandboxProps {
  onCodeExecute?: (code: string, language: string) => Promise<ExecutionResult>
  onSaveCode?: (code: string, language: string) => void
}

export default function Sandbox({ onCodeExecute, onSaveCode }: SandboxProps) {
  const [code, setCode] = useState(`// Welcome to Dish Sandbox
console.log("Hello, World!");

// Try some JavaScript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);

// Async example
async function fetchData() {
  try {
    const response = await fetch('https://api.github.com/users/octocat');
    const data = await response.json();
    console.log("GitHub user:", data.login);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchData();`)
  
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [isRunning, setIsRunning] = useState(false)
  const [executionHistory, setExecutionHistory] = useState<ExecutionResult[]>([])
  const [currentResult, setCurrentResult] = useState<ExecutionResult | null>(null)
  const [environment, setEnvironment] = useState({
    nodeVersion: '18.0.0',
    npmVersion: '9.0.0',
    pythonVersion: '3.9.0',
    memoryLimit: '512MB',
    timeout: 30
  })

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨', runtime: 'Node.js' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷', runtime: 'Node.js' },
    { value: 'python', label: 'Python', icon: '🐍', runtime: 'Python' },
    { value: 'html', label: 'HTML', icon: '🌐', runtime: 'Browser' },
    { value: 'css', label: 'CSS', icon: '🎨', runtime: 'Browser' },
    { value: 'sql', label: 'SQL', icon: '🗄️', runtime: 'Database' }
  ]

  const handleRun = async () => {
    if (!code.trim()) return

    setIsRunning(true)
    const startTime = Date.now()

    // Create execution result
    const result: ExecutionResult = {
      id: Date.now().toString(),
      code,
      language: selectedLanguage,
      output: '',
      status: 'running',
      executionTime: 0,
      timestamp: new Date()
    }

    setCurrentResult(result)

    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      // Simulate different outcomes
      const random = Math.random()
      if (random < 0.1) {
        // Error case
        result.status = 'error'
        result.error = 'SyntaxError: Unexpected token'
        result.output = 'Error occurred during execution'
      } else if (random < 0.2) {
        // Timeout case
        result.status = 'timeout'
        result.output = 'Execution timed out after 30 seconds'
      } else {
        // Success case
        result.status = 'success'
        result.output = `Hello, World!
Doubled numbers: 2,4,6,8,10
GitHub user: octocat
Execution completed successfully!`
        result.memoryUsage = Math.floor(Math.random() * 100) + 50 // MB
      }

      result.executionTime = Date.now() - startTime
      
      // Add to history
      setExecutionHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10
      
      // Call external handler if provided
      if (onCodeExecute) {
        await onCodeExecute(code, selectedLanguage)
      }
      
    } catch (error) {
      result.status = 'error'
      result.error = error instanceof Error ? error.message : 'Unknown error'
      result.output = 'Execution failed'
      result.executionTime = Date.now() - startTime
    } finally {
      setIsRunning(false)
      setCurrentResult(result)
    }
  }

  const handleStop = () => {
    setIsRunning(false)
    if (currentResult) {
      currentResult.status = 'error'
      currentResult.error = 'Execution stopped by user'
      currentResult.output = 'Execution interrupted'
    }
  }

  const handleSave = () => {
    onSaveCode?.(code, selectedLanguage)
    // Show success message
    console.log('Code saved successfully')
  }

  const handleClear = () => {
    setCode('')
    setCurrentResult(null)
  }

  const handleLoadExample = (example: string) => {
    const examples: Record<string, string> = {
      javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
      python: `# Python Example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci sequence:")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to Dish Sandbox</p>
    <script>
        console.log("JavaScript is working!");
    </script>
</body>
</html>`,
      css: `/* CSS Example */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 20px;
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
}

.button {
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.button:hover {
    background: #45a049;
}`
    }
    
    setCode(examples[example] || '')
  }

  const getStatusIcon = (status: ExecutionResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'timeout':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: ExecutionResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'running':
        return 'bg-blue-500'
      case 'timeout':
        return 'bg-yellow-500'
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Terminal className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Code Sandbox
            </h2>
            <p className="text-sm text-muted-foreground">Execute code safely in isolated environments</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b bg-card/30">
            <div className="flex items-center gap-4">
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.icon} {lang.label} ({lang.runtime})
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {environment.nodeVersion}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {environment.memoryLimit}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {environment.timeout}s timeout
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleLoadExample(selectedLanguage)}>
                <FileText className="h-4 w-4 mr-2" />
                Example
              </Button>
              {isRunning ? (
                <Button variant="destructive" size="sm" onClick={handleStop}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  onClick={handleRun}
                  disabled={!code.trim()}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code here..."
              className="w-full h-full p-4 border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ minHeight: '300px' }}
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="w-96 border-l bg-card/30 backdrop-blur">
          <Tabs defaultValue="output" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur border-b">
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="output" className="flex-1 m-0 p-4">
              <div className="space-y-4">
                {currentResult && (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(currentResult.status)}
                        <CardTitle className="text-sm">
                          Execution Result
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {currentResult.executionTime}ms
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-black text-green-400 font-mono text-sm p-3 rounded-lg overflow-x-auto">
                        <pre>{currentResult.output}</pre>
                      </div>
                      
                      {currentResult.error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
                          <strong>Error:</strong> {currentResult.error}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {currentResult.executionTime}ms
                        </div>
                        {currentResult.memoryUsage && (
                          <div className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            {currentResult.memoryUsage}MB
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {currentResult.language}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {!currentResult && (
                  <div className="text-center text-muted-foreground py-8">
                    <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No execution yet</p>
                    <p className="text-sm">Run your code to see results here</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="flex-1 m-0 p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm mb-3">Execution History</h3>
                {executionHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No executions yet</p>
                  </div>
                ) : (
                  executionHistory.map((result) => (
                    <Card key={result.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(result.status)}
                          <span className="text-sm font-medium">{result.language}</span>
                          <Badge variant="outline" className="text-xs">
                            {result.executionTime}ms
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {result.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="text-xs font-mono bg-muted p-2 rounded truncate">
                          {result.code.slice(0, 50)}...
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="environment" className="flex-1 m-0 p-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm mb-3">Environment Info</h3>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Runtime Versions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Node.js</span>
                      <Badge variant="outline">{environment.nodeVersion}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>npm</span>
                      <Badge variant="outline">{environment.npmVersion}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Python</span>
                      <Badge variant="outline">{environment.pythonVersion}</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Limits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory</span>
                      <Badge variant="outline">{environment.memoryLimit}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Timeout</span>
                      <Badge variant="outline">{environment.timeout}s</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Available Packages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <Badge variant="outline">lodash</Badge>
                      <Badge variant="outline">axios</Badge>
                      <Badge variant="outline">moment</Badge>
                      <Badge variant="outline">express</Badge>
                      <Badge variant="outline">react</Badge>
                      <Badge variant="outline">vue</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}