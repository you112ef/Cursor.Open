import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useProvider } from '../contexts/ProviderContext';
import { aiService } from '../services/ai/aiService';
import { AIServiceError } from '../services/ai/providers';
import { toolRegistry, parseToolMentions, ToolResult } from '../services/tools/toolRegistry';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Send, 
  Bot, 
  User, 
  RotateCcw,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Key,
  Search,
  Globe,
  BookOpen
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  toolResults?: ToolResult[];
}

const sampleSuggestions = [
  "How do I optimize React performance?",
  "@docs TypeScript interfaces",
  "@web latest React best practices", 
  "@symbols useState",
  "Help me fix this bug",
  "Generate a component for me",
];

export function Chat() {
  const { state, dispatch } = useApp();
  const { state: providerState, getSelectedProvider, getSelectedModel, hasValidApiKey, getApiKey } = useProvider();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "Hello! I'm your AI assistant. I can help you with coding questions, explain concepts, debug issues, and generate code. What would you like to work on?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toolResults, setToolResults] = useState<ToolResult[]>([]);
  const [isExecutingTools, setIsExecutingTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const selectedProvider = getSelectedProvider();
  const selectedModel = getSelectedModel();
  const needsApiKey = selectedProvider?.requiresApiKey && !hasValidApiKey(selectedProvider.id);

  // Get tool icons
  const getToolIcon = (toolType: string) => {
    switch (toolType) {
      case 'docs': return <BookOpen className="h-3 w-3" />;
      case 'web': return <Globe className="h-3 w-3" />;
      case 'symbols': return <Search className="h-3 w-3" />;
      default: return <Sparkles className="h-3 w-3" />;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-focus input when chat becomes visible
    if (state.layout.chat.visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.layout.chat.visible]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const executeTools = async (toolMentions: { type: string; query: string; position: number }[]): Promise<ToolResult[]> => {
    if (toolMentions.length === 0) return [];
    
    setIsExecutingTools(true);
    
    try {
      const toolRequests = toolMentions.map(mention => ({
        type: mention.type,
        query: mention.query,
        context: {
          files: state.editorTabs,
          currentFile: state.editorTabs.find(tab => tab.id === state.activeTab),
        },
      }));
      
      const results = await toolRegistry.executeMultipleTools(toolRequests);
      return results;
    } catch (error) {
      console.error('Tool execution error:', error);
      return [{
        type: 'error',
        content: `Tool execution failed: ${(error as Error).message}`,
        metadata: { error: true },
      }];
    } finally {
      setIsExecutingTools(false);
    }
  };

  const sendAIRequest = async (userMessage: string, toolResults: ToolResult[] = []): Promise<string> => {
    if (!selectedProvider || !selectedModel) {
      throw new Error('No provider or model selected');
    }

    // Check if we need an API key and have one
    if (needsApiKey) {
      throw new Error(`API key required for ${selectedProvider.name}`);
    }

    try {
      // Get current file context if available
      const activeTab = state.editorTabs.find(tab => tab.id === state.activeTab);
      
      // Include tool results in context
      let contextualMessage = userMessage;
      if (toolResults.length > 0) {
        const toolContext = toolResults.map(result => 
          `## Tool Result (${result.type})\n${result.content}`
        ).join('\n\n');
        
        contextualMessage = `${userMessage}\n\n--- Tool Results ---\n${toolContext}`;
      }
      
      // Format messages for AI service
      const contextMessages = aiService.formatChatContext(
        [...messages, { role: 'user', content: contextualMessage }],
        providerState.agentMode,
        providerState.tools,
        activeTab?.path,
        activeTab?.content
      ) as { role: 'user' | 'assistant' | 'system'; content: string; }[];

      const apiKey = getApiKey(selectedProvider.id);
      
      const response = await aiService.chat({
        messages: contextMessages,
        model: selectedModel.id,
        provider: selectedProvider.id,
        apiKey: apiKey?.key,
        temperature: 0.7,
        maxTokens: 2000,
      });

      return response.message.content;
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw new Error(`${error.provider}: ${error.message}`);
      } else {
        throw new Error((error as Error).message || 'Unknown error occurred');
      }
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    if (needsApiKey) return;

    const messageText = inputValue;
    setInputValue('');
    setError(null);
    
    // Parse tool mentions
    const parsed = parseToolMentions(messageText);
    const hasTools = parsed.tools.length > 0;
    
    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: messageText,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      let toolResults: ToolResult[] = [];
      
      // Execute tools if mentioned
      if (hasTools && providerState.tools) {
        // Check if tools are enabled
        const enabledTools = parsed.tools.filter(tool => {
          switch (tool.type) {
            case 'docs': return providerState.tools.docs;
            case 'web': return providerState.tools.web;
            case 'symbols': return providerState.tools.symbols;
            default: return false;
          }
        });
        
        if (enabledTools.length > 0) {
          toolResults = await executeTools(enabledTools);
          setToolResults(toolResults);
        }
      }
      
      // Send to AI with tool results
      const aiResponse = await sendAIRequest(parsed.cleanText || messageText, toolResults);
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        toolResults: toolResults.length > 0 ? toolResults : undefined,
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setError((error as Error).message);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: `Sorry, I encountered an error: ${(error as Error).message}`,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsExecutingTools(false);
      setToolResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: uuidv4(),
        content: "Chat cleared! How can I help you today?",
        role: 'assistant',
        timestamp: new Date(),
      }
    ]);
  };

  const useSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-card text-card-foreground">
      {/* Chat Header */}
      <div className="flex items-center justify-between responsive-padding border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm font-medium">AI Assistant</span>
          {selectedProvider && (
            <Badge variant="outline" className="text-xs">
              {selectedProvider.icon} {selectedModel?.name}
            </Badge>
          )}
          {needsApiKey && (
            <Badge variant="destructive" className="text-xs">
              <Key className="h-2 w-2 mr-1" />
              No API Key
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="h-6 w-6 p-0"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 border-b border-border">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* No API Key Warning */}
      {needsApiKey && (
        <div className="p-3 border-b border-border">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              API key required for {selectedProvider?.name}. Please add your API key in the settings.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            
            {/* Message Content */}
            <div className={`flex-1 max-w-[80%] ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}>
              <div className={`inline-block p-3 rounded-lg text-sm whitespace-pre-wrap ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}>
                {message.content}
              </div>
              
              {/* Tool Results */}
              {message.toolResults && message.toolResults.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.toolResults.map((result, index) => (
                    <div key={index} className="bg-muted/50 border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {getToolIcon(result.type)}
                        <span className="text-xs font-medium capitalize">
                          {result.type} Result
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {result.metadata?.source || 'tool'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap max-h-32 overflow-y-auto">
                        {result.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Tool Execution Indicator */}
        {isExecutingTools && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            
            <div className="flex-1">
              <div className="inline-block p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2 text-sm">
                  <Search className="h-3 w-3 animate-spin" />
                  <span>Executing tools...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Typing Indicator */}
        {isTyping && !isExecutingTools && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            
            <div className="flex-1">
              <div className="inline-block p-3 rounded-lg bg-muted">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-foreground rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <div className="p-3 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">
            Quick suggestions (try @docs, @web, @symbols):
          </div>
          <div className="grid grid-cols-1 gap-1">
            {sampleSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => useSuggestion(suggestion)}
                className="text-left text-xs p-2 rounded hover:bg-muted text-foreground border border-border transition-colors flex items-center gap-2"
              >
                {suggestion.includes('@') && (
                  <span className="text-primary">
                    {suggestion.includes('@docs') && getToolIcon('docs')}
                    {suggestion.includes('@web') && getToolIcon('web')}
                    {suggestion.includes('@symbols') && getToolIcon('symbols')}
                  </span>
                )}
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your code... (try @docs, @web, @symbols)"
            className="flex-1 min-h-[40px] max-h-32 p-2 text-sm border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            disabled={isTyping || isExecutingTools}
            rows={1}
            style={{ 
              height: 'auto',
              minHeight: '40px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping || needsApiKey || isExecutingTools}
            size="sm"
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {selectedProvider && selectedModel && (
            <span className="flex items-center gap-1">
              <span>{selectedProvider.icon}</span>
              <span>{selectedModel.name}</span>
              {selectedProvider.requiresApiKey && (
                <span className={hasValidApiKey(selectedProvider.id) ? 'text-green-600' : 'text-amber-600'}>
                  {hasValidApiKey(selectedProvider.id) ? '✓' : '⚠'}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}