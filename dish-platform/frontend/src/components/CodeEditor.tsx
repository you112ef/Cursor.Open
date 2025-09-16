'use client'

import { useState, useRef, useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Terminal,
  Brain,
  Zap,
  FileText,
  Folder,
  Search,
  GitBranch,
  RefreshCw
} from 'lucide-react'

interface CodeEditorProps {
  initialCode?: string
  language?: string
  theme?: string
  onCodeChange?: (code: string) => void
  onRun?: (code: string, language: string) => void
}

export default function CodeEditor({ 
  initialCode = '// Welcome to Dish Platform Code Editor\nconsole.log("Hello, World!");', 
  language = 'javascript',
  theme = 'vs-dark',
  onCodeChange,
  onRun
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [files, setFiles] = useState([
    { name: 'main.js', content: initialCode, language: 'javascript' },
    { name: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My App</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>', language: 'html' },
    { name: 'style.css', content: 'body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}', language: 'css' }
  ])
  const [activeFile, setActiveFile] = useState(0)
  const editorRef = useRef<any>(null)

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'json', label: 'JSON', icon: '📄' },
    { value: 'markdown', label: 'Markdown', icon: '📝' },
    { value: 'sql', label: 'SQL', icon: '🗄️' }
  ]

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    
    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun()
    })
    
    // Add AI suggestions
    editor.addAction({
      id: 'ai-suggest',
      label: 'AI Code Suggestions',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
      run: () => {
        // Trigger AI suggestions
        console.log('AI suggestions triggered')
      }
    })
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      onCodeChange?.(value)
      
      // Update current file
      const updatedFiles = [...files]
      updatedFiles[activeFile].content = value
      setFiles(updatedFiles)
    }
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('Running code...\n')
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Real code execution would happen here
      const result = `Code executed successfully!\nLanguage: ${selectedLanguage}\nOutput: ${code.slice(0, 50)}...`
      setOutput(result)
      
      onRun?.(code, selectedLanguage)
    } catch (error) {
      setOutput(`Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSave = () => {
    // Real save functionality
    console.log('Saving file...', files[activeFile])
  }

  const handleNewFile = () => {
    const newFile = {
      name: `file${files.length + 1}.js`,
      content: '// New file\n',
      language: 'javascript'
    }
    setFiles([...files, newFile])
    setActiveFile(files.length)
  }

  const handleFileSelect = (index: number) => {
    setActiveFile(index)
    setCode(files[index].content)
    setSelectedLanguage(files[index].language)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold">Code Editor</span>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1 rounded-md border bg-background text-sm"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleNewFile}>
            <FileText className="h-4 w-4 mr-2" />
            New
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button 
            size="sm" 
            onClick={handleRun} 
            disabled={isRunning}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File Explorer */}
        <div className="w-64 border-r bg-card/30 backdrop-blur">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="h-5 w-5 text-primary" />
              <span className="font-semibold">Files</span>
            </div>
            
            <div className="space-y-1">
              {files.map((file, index) => (
                <div
                  key={index}
                  onClick={() => handleFileSelect(index)}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    activeFile === index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur border-b">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 m-0">
              <div className="h-full">
                <Editor
                  height="100%"
                  language={selectedLanguage}
                  theme={theme}
                  value={code}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: true },
                    wordWrap: 'on',
                    automaticLayout: true,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    parameterHints: { enabled: true },
                    hover: { enabled: true },
                    contextmenu: true,
                    mouseWheelZoom: true,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    renderWhitespace: 'selection',
                    bracketPairColorization: { enabled: true },
                    guides: {
                      bracketPairs: true,
                      indentation: true
                    }
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="terminal" className="flex-1 m-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Terminal
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="h-full bg-black text-green-400 font-mono text-sm p-4 rounded-lg overflow-auto">
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
                      <div>$ npm install</div>
                      <div className="text-green-300">✓ Dependencies installed successfully</div>
                      <div>$ npm run dev</div>
                      <div className="text-blue-300">✓ Development server started on http://localhost:3000</div>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 m-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full flex flex-col">
                  <div className="flex-1 bg-muted/30 rounded-lg p-4 mb-4 overflow-auto">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Brain className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="bg-card p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Hello! I'm your AI coding assistant. How can I help you today?</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Can you help me optimize this code?</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs">You</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Brain className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="bg-card p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Of course! I can help you optimize your code. What specific improvements are you looking for?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask AI assistant..." 
                      className="flex-1 px-3 py-2 border rounded-md bg-background"
                    />
                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Output Panel */}
        <div className="w-80 border-l bg-card/30 backdrop-blur">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="font-semibold">Output</span>
            </div>
            
            <div className="space-y-2">
              <Badge variant="outline">Console</Badge>
              <Badge variant="outline">Problems</Badge>
              <Badge variant="outline">Debug</Badge>
            </div>
          </div>
          
          <div className="p-4">
            <div className="bg-black text-green-400 font-mono text-xs p-3 rounded-lg h-64 overflow-auto">
              <div className="space-y-1">
                <div>$ {code.slice(0, 30)}...</div>
                <div className="text-blue-300">✓ Code compiled successfully</div>
                <div className="text-yellow-300">⚠ 2 warnings found</div>
                <div className="text-red-300">✗ 1 error found</div>
                <div className="text-gray-400">---</div>
                <div>Output:</div>
                <div className="text-white">{output || 'No output yet'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}