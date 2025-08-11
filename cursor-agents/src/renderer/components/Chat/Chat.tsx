import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export function Chat() {
  const { state } = useApp();
  const { activeProject, openFiles, activeFileId, settings } = state;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you write code, debug issues, explain concepts, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeFile = openFiles.find(f => f.id === activeFileId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Prepare context
    const context = buildContext();

    try {
      // Send to AI backend
      const response = await window.electron.ai.chat(content, context);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting to the AI service. Please check your API configuration and try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const buildContext = (): string => {
    const contextParts = [];

    // Add project information
    if (activeProject) {
      contextParts.push(`Current project: ${activeProject.name}`);
      contextParts.push(`Project path: ${activeProject.path}`);
    }

    // Add active file information
    if (activeFile) {
      contextParts.push(`Active file: ${activeFile.name}`);
      contextParts.push(`Language: ${activeFile.language}`);
      
      // Add file content (truncated for performance)
      const content = activeFile.content;
      if (content.length > 2000) {
        contextParts.push(`File content (first 2000 chars): ${content.substring(0, 2000)}...`);
      } else {
        contextParts.push(`File content: ${content}`);
      }
    }

    // Add open files list
    if (openFiles.length > 0) {
      contextParts.push(`Open files: ${openFiles.map(f => f.name).join(', ')}`);
    }

    return contextParts.join('\n\n');
  };

  const handleClearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Chat cleared. How can I help you?',
      timestamp: new Date()
    }]);
  };

  const handleExportChat = () => {
    const chatText = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <span className="text-lg mr-2">🤖</span>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              AI Assistant
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Model: {settings.ai.defaultModel}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleExportChat}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
            title="Export chat"
          >
            💾
          </button>
          
          <button
            onClick={handleClearChat}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
            title="Clear chat"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ChatInput
          onSend={sendMessage}
          disabled={isLoading}
          placeholder="Ask me anything about your code..."
        />
      </div>

      {/* Context info */}
      {activeFile && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <span className="mr-1">📄</span>
            <span>Context: {activeFile.name}</span>
            {activeProject && (
              <>
                <span className="mx-2">•</span>
                <span>{activeProject.name}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}