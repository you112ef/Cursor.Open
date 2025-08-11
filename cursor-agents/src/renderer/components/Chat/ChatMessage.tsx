import React, { useState } from 'react';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting for code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    
    let formatted = content;
    
    // Replace code blocks
    formatted = formatted.replace(codeBlockRegex, (match, language, code) => {
      return `<pre class="code-block"><code class="language-${language || 'text'}">${code.trim()}</code></pre>`;
    });
    
    // Replace inline code
    formatted = formatted.replace(inlineCodeRegex, '<code class="inline-code">$1</code>');
    
    // Replace newlines with breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-lg ${
            message.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100'
          }`}
        >
          <div 
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        </div>

        {/* Message footer */}
        <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 dark:text-gray-400 ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          <span>{message.timestamp.toLocaleTimeString()}</span>
          
          {message.role === 'assistant' && (
            <button
              onClick={copyToClipboard}
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Copy message"
            >
              {copied ? '✅' : '📋'}
            </button>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
        message.role === 'user' 
          ? 'order-1 mr-3 bg-blue-100 dark:bg-blue-900' 
          : 'order-2 ml-3 bg-purple-100 dark:bg-purple-900'
      }`}>
        {message.role === 'user' ? '👤' : '🤖'}
      </div>
    </div>
  );
}