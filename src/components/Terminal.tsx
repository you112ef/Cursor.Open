import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { 
  Plus, 
  X, 
  Square,
  Play,
  RotateCcw,
  Terminal as TerminalIcon
} from 'lucide-react';

interface TerminalSession {
  id: string;
  name: string;
  history: Array<{
    id: string;
    type: 'input' | 'output' | 'error';
    content: string;
    timestamp: Date;
  }>;
  isActive: boolean;
}

const sampleCommands = [
  'npm install',
  'npm start',
  'npm run build',
  'npm test',
  'git status',
  'git add .',
  'git commit -m "Update"',
  'git push',
  'ls -la',
  'pwd',
  'cd src',
  'mkdir components',
  'touch index.js',
];

export function Terminal() {
  const { state, dispatch } = useApp();
  const [sessions, setSessions] = useState<TerminalSession[]>([
    {
      id: 'session-1',
      name: 'bash',
      history: [
        {
          id: 'welcome',
          type: 'output',
          content: 'Welcome to Cursor Open Terminal\nType "help" for available commands.',
          timestamp: new Date(),
        }
      ],
      isActive: true,
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState('session-1');
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalContentRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    // Auto-focus input when terminal becomes visible
    if (state.layout.terminal.visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.layout.terminal.visible]);

  useEffect(() => {
    // Scroll to bottom when new content is added
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [activeSession?.history]);

  const simulateCommand = (command: string): { output: string; type: 'output' | 'error' } => {
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'help') {
      return {
        type: 'output',
        output: `Available commands:
  help          - Show this help message
  clear         - Clear terminal
  ls            - List directory contents
  pwd           - Show current directory
  date          - Show current date and time
  echo [text]   - Display text
  npm [command] - Package manager commands
  git [command] - Git version control commands
  node -v       - Show Node.js version
  whoami        - Show current user`
      };
    }
    
    if (cmd === 'clear') {
      return { type: 'output', output: 'CLEAR_TERMINAL' };
    }
    
    if (cmd === 'ls' || cmd === 'ls -la') {
      return {
        type: 'output',
        output: `total 8
drwxr-xr-x  6 user  staff   192 Dec  1 10:30 .
drwxr-xr-x  3 user  staff    96 Nov 30 15:20 ..
-rw-r--r--  1 user  staff   123 Dec  1 10:25 package.json
-rw-r--r--  1 user  staff   456 Dec  1 10:30 README.md
drwxr-xr-x  4 user  staff   128 Dec  1 10:20 src
drwxr-xr-x  2 user  staff    64 Nov 30 16:15 public`
      };
    }
    
    if (cmd === 'pwd') {
      return { type: 'output', output: '/Users/user/projects/cursor-open-project' };
    }
    
    if (cmd === 'date') {
      return { type: 'output', output: new Date().toString() };
    }
    
    if (cmd.startsWith('echo ')) {
      return { type: 'output', output: command.slice(5) };
    }
    
    if (cmd.startsWith('npm ')) {
      const npmCmd = cmd.slice(4);
      if (npmCmd === 'install') {
        return {
          type: 'output',
          output: `Installing dependencies...
added 1256 packages in 4.2s
Dependencies installed successfully!`
        };
      }
      if (npmCmd === 'start') {
        return {
          type: 'output',
          output: `Starting development server...
Local:            http://localhost:3000
Network:          http://192.168.1.100:3000
Server started successfully!`
        };
      }
      return { type: 'output', output: `npm: '${npmCmd}' command executed` };
    }
    
    if (cmd.startsWith('git ')) {
      const gitCmd = cmd.slice(4);
      if (gitCmd === 'status') {
        return {
          type: 'output',
          output: `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/components/Chat.tsx
  modified:   src/services/ai/providers.ts
  modified:   src/contexts/ProviderContext.tsx

no changes added to commit`
        };
      }
      if (gitCmd === 'log --oneline') {
        return {
          type: 'output',
          output: `abc1234 feat: Add comprehensive AI provider system
567def8 fix: Improve responsive design
901ghi2 feat: Add real API integration`
        };
      }
      return { type: 'output', output: `git: '${gitCmd}' command executed` };
    }
    
    if (cmd === 'node -v' || cmd === 'node --version') {
      return { type: 'output', output: 'v20.12.1' };
    }
    
    if (cmd === 'whoami') {
      return { type: 'output', output: 'developer' };
    }
    
    // Unknown command
    return { 
      type: 'error', 
      output: `Command not found: ${command}\nType "help" for available commands.` 
    };
  };

  const executeCommand = () => {
    if (!currentInput.trim() || !activeSession) return;

    const newHistoryItem = {
      id: `input-${Date.now()}`,
      type: 'input' as const,
      content: currentInput,
      timestamp: new Date(),
    };

    // Add to command history
    setCommandHistory(prev => [...prev, currentInput]);
    setHistoryIndex(-1);

    // Execute command
    const result = simulateCommand(currentInput);
    
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        const newHistory = [...session.history, newHistoryItem];
        
        if (result.output === 'CLEAR_TERMINAL') {
          return { ...session, history: [] };
        }
        
        return {
          ...session,
          history: [
            ...newHistory,
            {
              id: `output-${Date.now()}`,
              type: result.type,
              content: result.output,
              timestamp: new Date(),
            }
          ]
        };
      }
      return session;
    }));

    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < 0 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for sample commands
      const matches = sampleCommands.filter(cmd => cmd.startsWith(currentInput));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
    }
  };

  const addNewSession = () => {
    const newSession: TerminalSession = {
      id: `session-${Date.now()}`,
      name: 'bash',
      history: [],
      isActive: false,
    };
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
  };

  const closeSession = (sessionId: string) => {
    if (sessions.length <= 1) return; // Keep at least one session
    
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setActiveSessionId(remaining[0]?.id || '');
    }
  };

  const clearTerminal = () => {
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { ...session, history: [] }
        : session
    ));
  };

  return (
    <div className="h-full flex flex-col bg-card text-card-foreground">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-1">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        
        {/* Session tabs */}
        <div className="flex items-center gap-1 flex-1 mx-4">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer ${
                session.id === activeSessionId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <span>{session.name}</span>
              {sessions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeSession(session.id);
                  }}
                >
                  <X className="h-2 w-2" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {/* Terminal actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={addNewSession}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTerminal}
            className="h-6 w-6 p-0"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div 
          ref={terminalContentRef}
          className="flex-1 overflow-y-auto p-2 font-mono text-sm bg-black text-green-400"
          style={{ fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace' }}
        >
          {activeSession?.history.map(item => (
            <div key={item.id} className="mb-1">
              {item.type === 'input' ? (
                <div className="flex">
                  <span className="text-blue-400 mr-2">$</span>
                  <span className="text-white">{item.content}</span>
                </div>
              ) : (
                <div className={`whitespace-pre-wrap ${
                  item.type === 'error' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Input Line */}
        <div className="flex items-center p-2 bg-black border-t border-border">
          <span className="text-blue-400 mr-2 font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white font-mono outline-none"
            placeholder="Type a command..."
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}