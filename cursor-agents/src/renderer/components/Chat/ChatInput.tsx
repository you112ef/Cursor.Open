import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = "Type your message..." }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isMultiline, setIsMultiline] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      setIsMultiline(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter for new line
        setIsMultiline(true);
      } else {
        // Enter to send
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120; // 5 lines approximately
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
      
      // Update multiline state based on content
      setIsMultiline(scrollHeight > 40);
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const quickSuggestions = [
    "Explain this code",
    "Find bugs in this file",
    "Optimize this function",
    "Add comments to this code",
    "Convert to TypeScript",
    "Write unit tests"
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <div className="p-4">
      {/* Quick suggestions */}
      <div className="mb-3 flex flex-wrap gap-2">
        {quickSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleQuickSuggestion(suggestion)}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors"
            disabled={disabled}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-3 py-2 resize-none border border-gray-300 dark:border-gray-600 
              rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isMultiline ? 'rounded-lg' : 'rounded-full'}
            `}
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          
          {/* Character count */}
          {input.length > 100 && (
            <div className="absolute bottom-1 right-2 text-xs text-gray-400">
              {input.length}
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className={`
            p-2 rounded-lg transition-colors flex-shrink-0
            ${input.trim() && !disabled
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
          title="Send message (Enter)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      {/* Help text */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <span>
          Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd> to send, 
          <kbd className="ml-1 px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">Shift+Enter</kbd> for new line
        </span>
        
        {disabled && (
          <span className="text-orange-500">AI is processing...</span>
        )}
      </div>
    </div>
  );
}