'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

interface TerminalProps {
  className?: string
  onCommand?: (command: string) => void
}

export default function Terminal({ className = '', onCommand }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!terminalRef.current) return

    // Create terminal instance
    const terminal = new XTerm({
      theme: {
        background: '#000000',
        foreground: '#00ff00',
        cursor: '#00ff00',
        selection: '#ffffff40',
        black: '#000000',
        red: '#ff0000',
        green: '#00ff00',
        yellow: '#ffff00',
        blue: '#0000ff',
        magenta: '#ff00ff',
        cyan: '#00ffff',
        white: '#ffffff',
        brightBlack: '#808080',
        brightRed: '#ff8080',
        brightGreen: '#80ff80',
        brightYellow: '#ffff80',
        brightBlue: '#8080ff',
        brightMagenta: '#ff80ff',
        brightCyan: '#80ffff',
        brightWhite: '#ffffff'
      },
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      tabStopWidth: 4,
      bellStyle: 'none',
      allowTransparency: true
    })

    // Add addons
    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)

    // Open terminal
    terminal.open(terminalRef.current)
    fitAddon.fit()

    // Welcome message
    terminal.writeln('\x1b[32mWelcome to Dish Platform Terminal\x1b[0m')
    terminal.writeln('\x1b[36mType "help" for available commands\x1b[0m')
    terminal.writeln('')

    // Command history
    let commandHistory: string[] = []
    let historyIndex = -1
    let currentCommand = ''

    // Handle input
    terminal.onData((data) => {
      const code = data.charCodeAt(0)
      
      if (code === 13) { // Enter
        terminal.writeln('')
        const command = currentCommand.trim()
        
        if (command) {
          commandHistory.push(command)
          historyIndex = commandHistory.length
          executeCommand(command, terminal)
          onCommand?.(command)
        }
        
        currentCommand = ''
        terminal.write('\x1b[32m$\x1b[0m ')
      } else if (code === 127) { // Backspace
        if (currentCommand.length > 0) {
          currentCommand = currentCommand.slice(0, -1)
          terminal.write('\b \b')
        }
      } else if (code === 27) { // Escape sequences (arrow keys)
        // Handle arrow keys for history navigation
        if (data === '\x1b[A') { // Up arrow
          if (historyIndex > 0) {
            historyIndex--
            const prevCommand = commandHistory[historyIndex]
            terminal.write('\r\x1b[K') // Clear line
            terminal.write('\x1b[32m$\x1b[0m ')
            terminal.write(prevCommand)
            currentCommand = prevCommand
          }
        } else if (data === '\x1b[B') { // Down arrow
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++
            const nextCommand = commandHistory[historyIndex]
            terminal.write('\r\x1b[K') // Clear line
            terminal.write('\x1b[32m$\x1b[0m ')
            terminal.write(nextCommand)
            currentCommand = nextCommand
          } else if (historyIndex === commandHistory.length - 1) {
            historyIndex = commandHistory.length
            terminal.write('\r\x1b[K') // Clear line
            terminal.write('\x1b[32m$\x1b[0m ')
            currentCommand = ''
          }
        }
      } else if (code >= 32) { // Printable characters
        currentCommand += data
        terminal.write(data)
      }
    })

    // Handle resize
    const handleResize = () => {
      fitAddon.fit()
    }
    window.addEventListener('resize', handleResize)

    xtermRef.current = terminal
    setIsReady(true)

    return () => {
      window.removeEventListener('resize', handleResize)
      terminal.dispose()
    }
  }, [])

  const executeCommand = (command: string, terminal: XTerm) => {
    const [cmd, ...args] = command.split(' ')
    
    switch (cmd.toLowerCase()) {
      case 'help':
        terminal.writeln('\x1b[33mAvailable commands:\x1b[0m')
        terminal.writeln('  help     - Show this help message')
        terminal.writeln('  clear    - Clear the terminal')
        terminal.writeln('  ls       - List files and directories')
        terminal.writeln('  pwd      - Print working directory')
        terminal.writeln('  cd       - Change directory')
        terminal.writeln('  mkdir    - Create directory')
        terminal.writeln('  touch    - Create file')
        terminal.writeln('  cat      - Display file contents')
        terminal.writeln('  echo     - Print text')
        terminal.writeln('  npm      - Node package manager')
        terminal.writeln('  git      - Git commands')
        terminal.writeln('  python   - Python interpreter')
        terminal.writeln('  node     - Node.js interpreter')
        terminal.writeln('  exit     - Exit terminal')
        break
        
      case 'clear':
        terminal.clear()
        break
        
      case 'ls':
        terminal.writeln('\x1b[36m📁 src/\x1b[0m')
        terminal.writeln('\x1b[36m📁 public/\x1b[0m')
        terminal.writeln('\x1b[36m📁 node_modules/\x1b[0m')
        terminal.writeln('\x1b[32m📄 package.json\x1b[0m')
        terminal.writeln('\x1b[32m📄 README.md\x1b[0m')
        terminal.writeln('\x1b[32m📄 .gitignore\x1b[0m')
        break
        
      case 'pwd':
        terminal.writeln('/workspace/dish-platform')
        break
        
      case 'cd':
        if (args.length === 0) {
          terminal.writeln('\x1b[33mUsage: cd <directory>\x1b[0m')
        } else {
          terminal.writeln(`\x1b[36mChanged directory to: ${args[0]}\x1b[0m`)
        }
        break
        
      case 'mkdir':
        if (args.length === 0) {
          terminal.writeln('\x1b[33mUsage: mkdir <directory>\x1b[0m')
        } else {
          terminal.writeln(`\x1b[32mCreated directory: ${args[0]}\x1b[0m`)
        }
        break
        
      case 'touch':
        if (args.length === 0) {
          terminal.writeln('\x1b[33mUsage: touch <file>\x1b[0m')
        } else {
          terminal.writeln(`\x1b[32mCreated file: ${args[0]}\x1b[0m`)
        }
        break
        
      case 'cat':
        if (args.length === 0) {
          terminal.writeln('\x1b[33mUsage: cat <file>\x1b[0m')
        } else {
          terminal.writeln(`\x1b[36mContents of ${args[0]}:\x1b[0m`)
          terminal.writeln('// File contents would be displayed here')
        }
        break
        
      case 'echo':
        terminal.writeln(args.join(' '))
        break
        
      case 'npm':
        if (args.length === 0) {
          terminal.writeln('\x1b[33mUsage: npm <command>\x1b[0m')
        } else {
          terminal.writeln(`\x1b[36mRunning: npm ${args.join(' ')}\x1b[0m`)
          if (args[0] === 'install') {
            terminal.writeln('\x1b[32m✓ Dependencies installed successfully\x1b[0m')
          } else if (args[0] === 'run' && args[1] === 'dev') {
            terminal.writeln('\x1b[32m✓ Development server started\x1b[0m')
            terminal.writeln('\x1b[36mLocal: http://localhost:3000\x1b[0m')
          }
        }
        break
        
      case 'git':
        if (args.length === 0) {
          terminal.writeln('\x1b[33mUsage: git <command>\x1b[0m')
        } else {
          terminal.writeln(`\x1b[36mRunning: git ${args.join(' ')}\x1b[0m`)
          if (args[0] === 'status') {
            terminal.writeln('\x1b[32mOn branch main\x1b[0m')
            terminal.writeln('\x1b[33mChanges not staged for commit:\x1b[0m')
            terminal.writeln('  modified: src/components/CodeEditor.tsx')
          } else if (args[0] === 'add') {
            terminal.writeln('\x1b[32m✓ Files added to staging area\x1b[0m')
          } else if (args[0] === 'commit') {
            terminal.writeln('\x1b[32m✓ Changes committed successfully\x1b[0m')
          }
        }
        break
        
      case 'python':
        terminal.writeln('\x1b[36mPython 3.9.0 (default, Oct 19 2020, 15:13:10)\x1b[0m')
        terminal.writeln('\x1b[36mType "help", "copyright", "credits" or "license" for more information.\x1b[0m')
        terminal.writeln('\x1b[36m>>>\x1b[0m')
        break
        
      case 'node':
        terminal.writeln('\x1b[36mNode.js v18.0.0\x1b[0m')
        terminal.writeln('\x1b[36mType ".help" for more information.\x1b[0m')
        terminal.writeln('\x1b[36m>\x1b[0m')
        break
        
      case 'exit':
        terminal.writeln('\x1b[33mGoodbye!\x1b[0m')
        break
        
      default:
        terminal.writeln(`\x1b[31mCommand not found: ${cmd}\x1b[0m`)
        terminal.writeln('\x1b[33mType "help" for available commands\x1b[0m')
    }
    
    terminal.write('\x1b[32m$\x1b[0m ')
  }

  return (
    <div className={`terminal-container ${className}`}>
      <div 
        ref={terminalRef} 
        className="h-full w-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  )
}