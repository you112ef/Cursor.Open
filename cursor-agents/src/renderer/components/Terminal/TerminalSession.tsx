import React, { useEffect, useRef, useState } from 'react';

interface TerminalSessionProps {
  terminalId: string;
}

export function TerminalSession({ terminalId }: TerminalSessionProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentDir, setCurrentDir] = useState('~');
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output'; content: string }>>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Initialize terminal session with Electron backend
    const initTerminal = async () => {
      try {
        // Create terminal session in main process
        await window.electron.terminal.create(process.cwd());
        setIsReady(true);
        
        // Add welcome message
        setHistory([
          { type: 'output', content: 'Welcome to Cursor Agents Terminal' },
          { type: 'output', content: 'Type "help" for available commands' },
          { type: 'output', content: '' }
        ]);
      } catch (error) {
        console.error('Failed to initialize terminal:', error);
        setHistory([
          { type: 'output', content: 'Failed to initialize terminal' },
          { type: 'output', content: 'Terminal functionality will be limited' },
          { type: 'output', content: '' }
        ]);
      }
    };

    initTerminal();

    // Cleanup on unmount
    return () => {
      if (isReady) {
        window.electron.terminal.close(terminalId).catch(console.error);
      }
    };
  }, [terminalId]);

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add input to history
    setHistory(prev => [...prev, { type: 'input', content: `$ ${command}` }]);

    // Handle built-in commands
    if (command === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (command === 'help') {
      setHistory(prev => [...prev, 
        { type: 'output', content: 'Available commands:' },
        { type: 'output', content: '  clear    - Clear terminal' },
        { type: 'output', content: '  help     - Show this help message' },
        { type: 'output', content: '  pwd      - Print working directory' },
        { type: 'output', content: '  ls       - List directory contents' },
        { type: 'output', content: '  cd <dir> - Change directory' },
        { type: 'output', content: '  Other commands will be executed by the system' },
        { type: 'output', content: '' }
      ]);
      setInput('');
      return;
    }

    if (command === 'pwd') {
      setHistory(prev => [...prev, { type: 'output', content: currentDir }, { type: 'output', content: '' }]);
      setInput('');
      return;
    }

    // For real terminal integration, send command to Electron backend
    try {
      await window.electron.terminal.write(terminalId, command + '\r\n');
      
      // Simulate output for demo purposes (this would normally come from terminal events)
      setTimeout(() => {
        setHistory(prev => [...prev, 
          { type: 'output', content: `Command executed: ${command}` },
          { type: 'output', content: '' }
        ]);
      }, 100);
    } catch (error) {
      setHistory(prev => [...prev, 
        { type: 'output', content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { type: 'output', content: '' }
      ]);
    }

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="h-full flex flex-col bg-slate-900 text-green-400 font-mono">
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 pb-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {history.map((line, index) => (
          <div key={index} className={`${line.type === 'input' ? 'text-green-400' : 'text-gray-300'}`}>
            {line.content}
          </div>
        ))}
      </div>

      {/* Input line */}
      <div className="flex items-center px-4 pb-4">
        <span className="text-green-400 mr-2">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent text-green-400 outline-none font-mono"
          placeholder={isReady ? "Type a command..." : "Initializing terminal..."}
          disabled={!isReady}
          autoFocus
        />
        
        {/* AI suggestion button */}
        <button
          onClick={() => {
            // TODO: Implement AI command suggestions
            console.log('AI suggest command for:', input);
          }}
          className="ml-2 px-2 py-1 text-xs text-purple-400 hover:text-purple-300 border border-purple-400 hover:border-purple-300 rounded"
          title="AI Command Suggestion"
        >
          🤖 Suggest
        </button>
      </div>

      {/* Status bar */}
      <div className="px-4 pb-2 text-xs text-gray-500 border-t border-slate-700 pt-2">
        <div className="flex justify-between items-center">
          <span>Working directory: {currentDir}</span>
          <div className="flex space-x-4">
            <span>Shell: bash</span>
            <span className={isReady ? 'text-green-500' : 'text-yellow-500'}>
              {isReady ? '● Ready' : '● Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}