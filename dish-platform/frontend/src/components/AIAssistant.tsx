'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Send, 
  Bot, 
  User, 
  Zap, 
  Code2, 
  Lightbulb,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Sparkles
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface AIAssistantProps {
  onCodeGenerated?: (code: string) => void
  onCodeOptimized?: (code: string) => void
  onCodeExplained?: (explanation: string) => void
}

export default function AIAssistant({ 
  onCodeGenerated, 
  onCodeOptimized, 
  onCodeExplained 
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you with code generation, optimization, debugging, and explanations. What would you like to work on today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('openai')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const providers = [
    { id: 'openai', name: 'OpenAI GPT-4', status: 'connected', color: 'bg-green-500' },
    { id: 'anthropic', name: 'Anthropic Claude', status: 'connected', color: 'bg-blue-500' },
    { id: 'google', name: 'Google Gemini', status: 'connected', color: 'bg-purple-500' },
    { id: 'mistral', name: 'Mistral AI', status: 'disconnected', color: 'bg-orange-500' }
  ]

  const quickActions = [
    { icon: Code2, label: 'Generate Code', prompt: 'Generate a React component for a todo list' },
    { icon: Zap, label: 'Optimize Code', prompt: 'Optimize this code for better performance' },
    { icon: Lightbulb, label: 'Explain Code', prompt: 'Explain how this code works' },
    { icon: Bot, label: 'Debug Code', prompt: 'Help me debug this error' }
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('generate') || input.includes('create')) {
      const code = `// Generated React Component
import React, { useState } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <div className="input-section">
        <input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input 
              type="checkbox" 
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;`
      
      onCodeGenerated?.(code)
      return `Here's a complete React TodoList component for you:\n\n\`\`\`jsx\n${code}\n\`\`\`\n\nThis component includes:\n- State management with useState\n- Adding new todos\n- Toggling todo completion\n- Clean, modern React patterns\n\nWould you like me to explain any part of this code or make any modifications?`
    }
    
    if (input.includes('optimize') || input.includes('performance')) {
      return `Here are some optimization strategies for your code:\n\n1. **Memoization**: Use React.memo() for components that don't need to re-render frequently\n2. **useMemo**: Cache expensive calculations\n3. **useCallback**: Prevent unnecessary re-renders of child components\n4. **Code Splitting**: Use dynamic imports for better bundle size\n5. **Lazy Loading**: Load components only when needed\n\nWould you like me to show you specific examples of these optimizations?`
    }
    
    if (input.includes('explain') || input.includes('how')) {
      return `I'd be happy to explain! Here's a breakdown:\n\n**State Management**: The component uses React's useState hook to manage the todos array and input value.\n\n**Event Handling**: The addTodo function creates a new todo object and adds it to the existing todos array.\n\n**Conditional Rendering**: The component conditionally renders todos based on their completion status.\n\n**Key Props**: Each todo item has a unique key prop for efficient React rendering.\n\nIs there a specific part you'd like me to explain in more detail?`
    }
    
    if (input.includes('debug') || input.includes('error')) {
      return `Let me help you debug! Common issues and solutions:\n\n**Common Errors**:\n1. **"Cannot read property of undefined"** - Check if data exists before accessing properties\n2. **"Maximum update depth exceeded"** - Usually caused by infinite re-renders\n3. **"Cannot find module"** - Check import paths and dependencies\n\n**Debugging Tips**:\n1. Use console.log() to track state changes\n2. Check browser DevTools for error messages\n3. Use React DevTools to inspect component state\n4. Add error boundaries to catch runtime errors\n\nCan you share the specific error you're encountering?`
    }
    
    return `I understand you're asking about "${userInput}". I'm here to help with:\n\n- **Code Generation**: Creating new components, functions, or entire applications\n- **Code Optimization**: Improving performance and efficiency\n- **Code Explanation**: Breaking down complex code into understandable parts\n- **Debugging**: Finding and fixing errors in your code\n- **Best Practices**: Following modern development standards\n\nWhat specific aspect would you like me to help you with?`
  }

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Assistant
            </h2>
            <p className="text-sm text-muted-foreground">Powered by multiple AI providers</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedProvider} 
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-1 rounded-md border bg-background text-sm"
          >
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Provider Status */}
      <div className="p-4 border-b bg-card/30">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Providers:</span>
          {providers.map(provider => (
            <div key={provider.id} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${provider.color}`}></div>
              <span className="text-xs">{provider.name}</span>
              <Badge variant={provider.status === 'connected' ? 'default' : 'secondary'} className="text-xs">
                {provider.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border'
                  }`}
                >
                  <div 
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.type === 'assistant' && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-card border px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-card/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AI assistant anything..."
                className="flex-1 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                {isTyping ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="w-64 border-l bg-card/30 backdrop-blur p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-3 hover:bg-primary/10"
                onClick={() => handleQuickAction(action.prompt)}
              >
                <action.icon className="h-4 w-4 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {action.prompt.slice(0, 30)}...
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be specific with your requests</li>
              <li>• Include code examples when asking for help</li>
              <li>• Ask follow-up questions for clarification</li>
              <li>• Use quick actions for common tasks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}