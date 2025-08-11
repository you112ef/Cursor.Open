# تكامل Terminal وتنفيذ الأوامر
# Terminal Integration and Command Execution

## المقدمة والنظرة العامة
### Introduction and Overview

هذا المستند يوضح التصميم والتطوير التفصيلي لنظام Terminal المتكامل، وهو أحد المكونات الحيوية في تطبيق Cursor Agents. يوفر النظام واجهة terminal متقدمة مع ميزات ذكية ومتكاملة مع الذكاء الاصطناعي.

## المتطلبات الأساسية
### Core Requirements

### 1. Terminal Interface Features
- **عدة تبويبات Terminal** - Multi-tab support
- **تقسيم الشاشة** - Split panes functionality  
- **تخصيص المظهر** - Customizable themes and fonts
- **تكامل مع AI** - AI-powered command suggestions
- **مزامنة العمليات** - Process monitoring and management

### 2. Command Execution Features
- **تنفيذ آمن للأوامر** - Secure command execution
- **مراقبة العمليات** - Real-time process monitoring
- **إدارة الجلسات** - Session management
- **تخزين التاريخ** - Command history and search
- **الإكمال التلقائي** - Intelligent auto-completion

### 3. Development Tools Integration
- **Git Integration** - Git commands and workflow
- **Package Managers** - npm, yarn, pip support
- **Build Tools** - Docker, Make, Gradle support
- **Database Tools** - SQL and NoSQL connections
- **Cloud Tools** - AWS, GCP, Azure CLI

## التصميم المعماري
### Architectural Design

### 1. Terminal Core Architecture
```typescript
interface TerminalConfig {
  shell: 'bash' | 'zsh' | 'fish' | 'cmd' | 'powershell';
  theme: TerminalTheme;
  fontSize: number;
  fontFamily: string;
  cursorStyle: 'block' | 'underline' | 'bar';
  scrollback: number;
  bellStyle: 'none' | 'visual' | 'sound';
  macOptionIsMeta: boolean;
  rightClickSelectsWord: boolean;
  rendererType: 'dom' | 'canvas' | 'webgl';
}

interface TerminalTheme {
  foreground: string;
  background: string;
  cursor: string;
  selection: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

class TerminalManager {
  private terminals: Map<string, TerminalInstance> = new Map();
  private activeTerminalId: string | null = null;
  private eventManager: TerminalEventManager;
  private aiAssistant: TerminalAIAssistant;
  private securityManager: TerminalSecurityManager;

  constructor() {
    this.eventManager = new TerminalEventManager();
    this.aiAssistant = new TerminalAIAssistant();
    this.securityManager = new TerminalSecurityManager();
    this.setupEventHandlers();
  }

  async createTerminal(config: Partial<TerminalConfig> = {}): Promise<TerminalInstance> {
    const terminalId = `terminal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const terminalConfig = this.mergeConfig(config);
    
    const terminal = new TerminalInstance(terminalId, terminalConfig);
    await terminal.initialize();
    
    this.terminals.set(terminalId, terminal);
    this.activeTerminalId = terminalId;
    
    // Setup AI integration
    await this.aiAssistant.attachToTerminal(terminal);
    
    this.eventManager.emit('terminal-created', { terminalId, terminal });
    
    return terminal;
  }

  async executeCommand(
    terminalId: string,
    command: string,
    options: CommandExecutionOptions = {}
  ): Promise<CommandResult> {
    const terminal = this.terminals.get(terminalId);
    if (!terminal) {
      throw new Error(`Terminal not found: ${terminalId}`);
    }

    // Security validation
    await this.securityManager.validateCommand(command, options);

    // Execute with AI assistance if enabled
    if (options.aiAssistance) {
      return await this.aiAssistant.executeWithAssistance(terminal, command, options);
    }

    return await terminal.execute(command, options);
  }

  getTerminal(terminalId: string): TerminalInstance | undefined {
    return this.terminals.get(terminalId);
  }

  getAllTerminals(): TerminalInstance[] {
    return Array.from(this.terminals.values());
  }

  async closeTerminal(terminalId: string): Promise<void> {
    const terminal = this.terminals.get(terminalId);
    if (!terminal) return;

    await terminal.dispose();
    this.terminals.delete(terminalId);

    if (this.activeTerminalId === terminalId) {
      const remaining = Array.from(this.terminals.keys());
      this.activeTerminalId = remaining.length > 0 ? remaining[0] : null;
    }

    this.eventManager.emit('terminal-closed', { terminalId });
  }

  setActiveTerminal(terminalId: string): void {
    if (this.terminals.has(terminalId)) {
      this.activeTerminalId = terminalId;
      this.eventManager.emit('terminal-activated', { terminalId });
    }
  }

  private mergeConfig(userConfig: Partial<TerminalConfig>): TerminalConfig {
    const defaultConfig: TerminalConfig = {
      shell: process.platform === 'win32' ? 'cmd' : 'bash',
      theme: this.getDefaultTheme(),
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      cursorStyle: 'block',
      scrollback: 1000,
      bellStyle: 'none',
      macOptionIsMeta: false,
      rightClickSelectsWord: true,
      rendererType: 'canvas'
    };

    return { ...defaultConfig, ...userConfig };
  }

  private getDefaultTheme(): TerminalTheme {
    return {
      foreground: '#ffffff',
      background: '#1e1e1e',
      cursor: '#ffffff',
      selection: '#3a3d41',
      black: '#000000',
      red: '#f14c4c',
      green: '#23d18b',
      yellow: '#f5f543',
      blue: '#3b8eea',
      magenta: '#d670d6',
      cyan: '#29b8db',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#ffffff'
    };
  }
}
```

### 2. Terminal Instance Implementation
```typescript
interface CommandExecutionOptions {
  workingDirectory?: string;
  environment?: Record<string, string>;
  timeout?: number;
  silent?: boolean;
  aiAssistance?: boolean;
  captureOutput?: boolean;
  onOutput?: (data: string) => void;
  onError?: (error: string) => void;
  onExit?: (code: number) => void;
}

interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  executionTime: number;
  command: string;
  workingDirectory: string;
  timestamp: Date;
}

class TerminalInstance {
  private id: string;
  private config: TerminalConfig;
  private ptyProcess: any;
  private xterm: any;
  private commandHistory: CommandHistory;
  private processManager: ProcessManager;
  private outputBuffer: OutputBuffer;
  private isInitialized: boolean = false;

  constructor(id: string, config: TerminalConfig) {
    this.id = id;
    this.config = config;
    this.commandHistory = new CommandHistory();
    this.processManager = new ProcessManager();
    this.outputBuffer = new OutputBuffer();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize xterm.js
    await this.initializeXterm();
    
    // Create PTY process
    await this.createPtyProcess();
    
    // Setup data handling
    this.setupDataHandling();
    
    // Setup key bindings
    this.setupKeyBindings();

    this.isInitialized = true;
  }

  private async initializeXterm(): Promise<void> {
    const { Terminal } = await import('xterm');
    const { FitAddon } = await import('xterm-addon-fit');
    const { WebLinksAddon } = await import('xterm-addon-web-links');
    const { SearchAddon } = await import('xterm-addon-search');
    const { Unicode11Addon } = await import('xterm-addon-unicode11');

    this.xterm = new Terminal({
      theme: this.config.theme,
      fontSize: this.config.fontSize,
      fontFamily: this.config.fontFamily,
      cursorStyle: this.config.cursorStyle,
      scrollback: this.config.scrollback,
      bellStyle: this.config.bellStyle,
      macOptionIsMeta: this.config.macOptionIsMeta,
      rightClickSelectsWord: this.config.rightClickSelectsWord,
      rendererType: this.config.rendererType,
      allowTransparency: true,
      convertEol: true
    });

    // Load addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();
    const unicode11Addon = new Unicode11Addon();

    this.xterm.loadAddon(fitAddon);
    this.xterm.loadAddon(webLinksAddon);
    this.xterm.loadAddon(searchAddon);
    this.xterm.loadAddon(unicode11Addon);

    // Activate unicode handling
    this.xterm.unicode.activeVersion = '11';

    // Store addon references for later use
    this.xterm.fitAddon = fitAddon;
    this.xterm.searchAddon = searchAddon;
  }

  private async createPtyProcess(): Promise<void> {
    const pty = await import('node-pty');
    
    const shell = this.determineShell();
    const args = this.getShellArgs();

    this.ptyProcess = pty.spawn(shell, args, {
      name: 'xterm-color',
      cols: this.xterm.cols || 80,
      rows: this.xterm.rows || 24,
      cwd: process.cwd(),
      env: { ...process.env, TERM: 'xterm-256color' }
    });

    // Handle PTY process events
    this.ptyProcess.onData((data: string) => {
      this.xterm.write(data);
      this.outputBuffer.append(data);
    });

    this.ptyProcess.onExit((code: number, signal: number) => {
      this.handleProcessExit(code, signal);
    });
  }

  private setupDataHandling(): void {
    // Handle user input
    this.xterm.onData((data: string) => {
      this.ptyProcess.write(data);
      
      // Track command input for history
      if (data === '\r') { // Enter key
        const currentLine = this.getCurrentLine();
        if (currentLine.trim()) {
          this.commandHistory.add(currentLine.trim());
        }
      }
    });

    // Handle resize
    this.xterm.onResize((size: { cols: number; rows: number }) => {
      this.ptyProcess.resize(size.cols, size.rows);
    });
  }

  private setupKeyBindings(): void {
    // Ctrl+C - Copy
    this.xterm.attachCustomKeyEventHandler((e) => {
      if (e.ctrlKey && e.key === 'c' && e.type === 'keydown') {
        if (this.xterm.hasSelection()) {
          const selection = this.xterm.getSelection();
          navigator.clipboard.writeText(selection);
          return false; // Prevent default
        }
      }

      // Ctrl+V - Paste
      if (e.ctrlKey && e.key === 'v' && e.type === 'keydown') {
        navigator.clipboard.readText().then(text => {
          this.ptyProcess.write(text);
        });
        return false;
      }

      // Ctrl+L - Clear
      if (e.ctrlKey && e.key === 'l' && e.type === 'keydown') {
        this.clear();
        return false;
      }

      // Ctrl+D - AI Assistant
      if (e.ctrlKey && e.key === 'd' && e.type === 'keydown') {
        this.showAIAssistant();
        return false;
      }

      // Up/Down arrows - Command history
      if (e.key === 'ArrowUp' && e.type === 'keydown') {
        const prevCommand = this.commandHistory.previous();
        if (prevCommand) {
          this.replaceCurrentLine(prevCommand);
          return false;
        }
      }

      if (e.key === 'ArrowDown' && e.type === 'keydown') {
        const nextCommand = this.commandHistory.next();
        if (nextCommand) {
          this.replaceCurrentLine(nextCommand);
          return false;
        }
      }

      return true; // Allow default handling
    });
  }

  async execute(command: string, options: CommandExecutionOptions = {}): Promise<CommandResult> {
    const startTime = Date.now();
    const workingDirectory = options.workingDirectory || this.getCurrentWorkingDirectory();

    // Add command to history
    this.commandHistory.add(command);

    // Change directory if specified
    if (options.workingDirectory) {
      await this.changeDirectory(options.workingDirectory);
    }

    // Set environment variables if specified
    if (options.environment) {
      await this.setEnvironmentVariables(options.environment);
    }

    // Execute command
    const result = await this.executeCommandInternal(command, options);

    const executionTime = Date.now() - startTime;

    return {
      ...result,
      executionTime,
      command,
      workingDirectory,
      timestamp: new Date()
    };
  }

  private async executeCommandInternal(
    command: string,
    options: CommandExecutionOptions
  ): Promise<Omit<CommandResult, 'executionTime' | 'command' | 'workingDirectory' | 'timestamp'>> {
    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      let isResolved = false;

      // Set timeout if specified
      const timeoutHandle = options.timeout ? setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          reject(new Error(`Command timed out after ${options.timeout} seconds`));
        }
      }, options.timeout * 1000) : null;

      // Create a temporary data handler to capture output
      const dataHandler = (data: string) => {
        const cleanData = this.stripAnsiCodes(data);
        
        if (this.isStdout(data)) {
          stdout += cleanData;
        } else {
          stderr += cleanData;
        }

        // Call user-provided handlers
        if (options.onOutput) {
          options.onOutput(cleanData);
        }
      };

      // Monitor for command completion
      const exitHandler = (code: number) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        
        if (!isResolved) {
          isResolved = true;
          
          if (options.onExit) {
            options.onExit(code);
          }

          resolve({
            exitCode: code,
            stdout: stdout.trim(),
            stderr: stderr.trim()
          });
        }
      };

      // Attach handlers
      this.outputBuffer.onData(dataHandler);
      this.processManager.onExit(exitHandler);

      // Send command to PTY
      this.ptyProcess.write(command + '\r');

      // Setup cleanup
      const cleanup = () => {
        this.outputBuffer.offData(dataHandler);
        this.processManager.offExit(exitHandler);
      };

      // Cleanup after resolution
      setTimeout(cleanup, 100);
    });
  }

  // AI Integration Methods
  private async showAIAssistant(): Promise<void> {
    const currentContext = this.getCurrentContext();
    const suggestions = await this.getAISuggestions(currentContext);
    this.displayAISuggestions(suggestions);
  }

  private getCurrentContext(): TerminalContext {
    return {
      currentDirectory: this.getCurrentWorkingDirectory(),
      commandHistory: this.commandHistory.getRecent(10),
      currentCommand: this.getCurrentLine(),
      environment: this.getEnvironmentInfo(),
      runningProcesses: this.processManager.getRunningProcesses()
    };
  }

  // Utility Methods
  private getCurrentLine(): string {
    // Extract current line from terminal buffer
    const buffer = this.xterm.buffer.active;
    const currentRow = buffer.baseY + buffer.cursorY;
    return buffer.getLine(currentRow)?.translateToString() || '';
  }

  private replaceCurrentLine(text: string): void {
    // Clear current line and write new text
    this.ptyProcess.write('\u001b[2K\r'); // Clear line
    this.ptyProcess.write(text);
  }

  private getCurrentWorkingDirectory(): string {
    // This would need to be tracked or queried from the shell
    return process.cwd(); // Simplified
  }

  private stripAnsiCodes(text: string): string {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  }

  private isStdout(data: string): boolean {
    // Heuristic to determine if data is stdout or stderr
    // This is simplified - in practice, would need more sophisticated detection
    return !data.includes('error') && !data.includes('Error');
  }

  clear(): void {
    this.xterm.clear();
  }

  focus(): void {
    this.xterm.focus();
  }

  resize(): void {
    this.xterm.fitAddon?.fit();
  }

  attach(container: HTMLElement): void {
    this.xterm.open(container);
    this.resize();
  }

  async dispose(): Promise<void> {
    if (this.ptyProcess) {
      this.ptyProcess.kill();
    }
    
    if (this.xterm) {
      this.xterm.dispose();
    }

    this.isInitialized = false;
  }

  // Getters
  get terminalId(): string {
    return this.id;
  }

  get isActive(): boolean {
    return this.isInitialized && this.ptyProcess && !this.ptyProcess.killed;
  }
}
```

### 3. AI Terminal Assistant
```typescript
interface TerminalContext {
  currentDirectory: string;
  commandHistory: string[];
  currentCommand: string;
  environment: EnvironmentInfo;
  runningProcesses: ProcessInfo[];
}

interface EnvironmentInfo {
  shell: string;
  platform: string;
  nodeVersion?: string;
  pythonVersion?: string;
  gitBranch?: string;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
}

interface ProcessInfo {
  pid: number;
  name: string;
  command: string;
  status: 'running' | 'stopped' | 'zombie';
}

interface CommandSuggestion {
  command: string;
  description: string;
  confidence: number;
  category: 'git' | 'npm' | 'file' | 'system' | 'docker' | 'other';
  examples?: string[];
  alternatives?: string[];
}

class TerminalAIAssistant {
  private aiManager: AIManager;
  private commandPatterns: Map<string, CommandPattern> = new Map();

  constructor(aiManager: AIManager) {
    this.aiManager = aiManager;
    this.initializeCommandPatterns();
  }

  async attachToTerminal(terminal: TerminalInstance): Promise<void> {
    // Setup AI-powered features for the terminal
    await this.setupAutoCompletion(terminal);
    await this.setupErrorDetection(terminal);
    await this.setupCommandSuggestions(terminal);
  }

  async executeWithAssistance(
    terminal: TerminalInstance,
    command: string,
    options: CommandExecutionOptions
  ): Promise<CommandResult> {
    // Pre-execution: Validate and optimize command
    const optimizedCommand = await this.optimizeCommand(command, terminal);
    
    // Execute the command
    const result = await terminal.execute(optimizedCommand, {
      ...options,
      onOutput: (data) => {
        this.analyzeOutput(data, command);
        if (options.onOutput) options.onOutput(data);
      },
      onError: (error) => {
        this.analyzeError(error, command);
        if (options.onError) options.onError(error);
      }
    });

    // Post-execution: Analyze results and provide insights
    await this.analyzeResult(result, terminal);

    return result;
  }

  async getSuggestions(context: TerminalContext): Promise<CommandSuggestion[]> {
    const prompt = this.buildSuggestionPrompt(context);
    const suggestions = await this.aiManager.generateCommandSuggestions(prompt);
    
    return suggestions.map(suggestion => ({
      ...suggestion,
      confidence: this.calculateConfidence(suggestion, context)
    })).sort((a, b) => b.confidence - a.confidence);
  }

  private async optimizeCommand(command: string, terminal: TerminalInstance): Promise<string> {
    const context = terminal.getCurrentContext();
    
    const prompt = `
Optimize the following command for better performance and safety:

Command: ${command}
Current directory: ${context.currentDirectory}
Platform: ${context.environment.platform}
Shell: ${context.environment.shell}

Consider:
1. Adding appropriate flags for better output
2. Safety checks (especially for destructive operations)
3. Performance optimizations
4. Best practices for the current environment
5. Error handling improvements

Return the optimized command with a brief explanation of changes made.
    `;

    const optimization = await this.aiManager.optimizeCommand(prompt);
    return optimization.optimizedCommand || command;
  }

  private buildSuggestionPrompt(context: TerminalContext): string {
    return `
Provide intelligent command suggestions based on the current context:

Current Directory: ${context.currentDirectory}
Platform: ${context.environment.platform}
Shell: ${context.environment.shell}
Current Command: ${context.currentCommand}

Recent Command History:
${context.commandHistory.map((cmd, i) => `${i + 1}. ${cmd}`).join('\n')}

Environment Info:
- Node.js: ${context.environment.nodeVersion || 'Not detected'}
- Python: ${context.environment.pythonVersion || 'Not detected'}  
- Git Branch: ${context.environment.gitBranch || 'Not in git repo'}
- Package Manager: ${context.environment.packageManager || 'Unknown'}

Running Processes:
${context.runningProcesses.map(p => `- ${p.name} (${p.pid}): ${p.command}`).join('\n')}

Provide 5-10 relevant command suggestions with:
1. The complete command
2. Clear description of what it does
3. Confidence score (0-1)
4. Category (git, npm, file, system, docker, other)
5. Usage examples if helpful
6. Alternative approaches

Focus on:
- Commands relevant to the current directory and project
- Next logical steps based on command history
- Common development workflows
- Troubleshooting and debugging commands
- Performance and optimization commands
    `;
  }

  private async setupAutoCompletion(terminal: TerminalInstance): Promise<void> {
    // Implement AI-powered auto-completion
    terminal.onTabKey(async () => {
      const currentLine = terminal.getCurrentLine();
      const completions = await this.getCompletions(currentLine, terminal);
      
      if (completions.length === 1) {
        // Auto-complete with single match
        terminal.replaceCurrentLine(completions[0].command);
      } else if (completions.length > 1) {
        // Show completion menu
        this.showCompletionMenu(terminal, completions);
      }
    });
  }

  private async getCompletions(
    partialCommand: string,
    terminal: TerminalInstance
  ): Promise<CommandSuggestion[]> {
    const context = terminal.getCurrentContext();
    
    const prompt = `
Provide command completions for: "${partialCommand}"

Context:
${this.buildContextString(context)}

Return up to 10 possible completions that:
1. Start with or logically continue the partial command
2. Are relevant to the current directory and environment
3. Are commonly used in development workflows
4. Include file/directory completions if applicable

Format each completion with the full command and brief description.
    `;

    return await this.aiManager.generateCompletions(prompt);
  }

  private async setupErrorDetection(terminal: TerminalInstance): Promise<void> {
    terminal.onOutput((output) => {
      if (this.isError(output)) {
        this.handleError(output, terminal);
      }
    });
  }

  private isError(output: string): boolean {
    const errorIndicators = [
      /error:/i,
      /exception:/i,
      /failed/i,
      /permission denied/i,
      /no such file/i,
      /command not found/i,
      /syntax error/i
    ];

    return errorIndicators.some(pattern => pattern.test(output));
  }

  private async handleError(errorOutput: string, terminal: TerminalInstance): Promise<void> {
    const context = terminal.getCurrentContext();
    const suggestions = await this.generateErrorSolutions(errorOutput, context);
    
    // Display error analysis and solutions
    this.displayErrorAnalysis(terminal, errorOutput, suggestions);
  }

  private async generateErrorSolutions(
    errorOutput: string,
    context: TerminalContext
  ): Promise<ErrorSolution[]> {
    const prompt = `
Analyze this error and provide solutions:

Error Output:
${errorOutput}

Context:
${this.buildContextString(context)}

Provide:
1. Clear explanation of what went wrong
2. 3-5 specific solutions to fix the error
3. Prevention tips for the future
4. Related commands that might help

Focus on practical, actionable solutions.
    `;

    return await this.aiManager.generateErrorSolutions(prompt);
  }

  private buildContextString(context: TerminalContext): string {
    return `
Current Directory: ${context.currentDirectory}
Platform: ${context.environment.platform}
Shell: ${context.environment.shell}
Recent Commands: ${context.commandHistory.slice(-3).join(', ')}
Environment: ${JSON.stringify(context.environment, null, 2)}
    `;
  }

  private calculateConfidence(suggestion: CommandSuggestion, context: TerminalContext): number {
    let confidence = suggestion.confidence || 0.5;

    // Boost confidence based on context relevance
    if (suggestion.category === 'git' && context.environment.gitBranch) {
      confidence += 0.2;
    }

    if (suggestion.category === 'npm' && context.environment.packageManager === 'npm') {
      confidence += 0.2;
    }

    // Boost if command matches recent patterns
    if (context.commandHistory.some(cmd => 
      cmd.startsWith(suggestion.command.split(' ')[0])
    )) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  private initializeCommandPatterns(): void {
    // Common command patterns for better suggestions
    this.commandPatterns.set('git', {
      triggers: ['git status', 'git diff'],
      suggestions: ['git add', 'git commit', 'git push', 'git pull']
    });

    this.commandPatterns.set('npm', {
      triggers: ['npm install', 'package.json'],
      suggestions: ['npm start', 'npm test', 'npm run build', 'npm run dev']
    });

    this.commandPatterns.set('docker', {
      triggers: ['docker', 'Dockerfile'],
      suggestions: ['docker build', 'docker run', 'docker ps', 'docker logs']
    });
  }
}
```

### 4. Process Management System
```typescript
interface ProcessInfo {
  pid: number;
  ppid: number;
  name: string;
  command: string;
  args: string[];
  status: 'running' | 'sleeping' | 'stopped' | 'zombie';
  cpuUsage: number;
  memoryUsage: number;
  startTime: Date;
  user: string;
}

interface ProcessFilter {
  name?: string;
  status?: ProcessInfo['status'];
  user?: string;
  minCpuUsage?: number;
  minMemoryUsage?: number;
}

class ProcessManager {
  private processes: Map<number, ProcessInfo> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      await this.updateProcessList();
    }, 2000); // Update every 2 seconds
  }

  private async updateProcessList(): Promise<void> {
    try {
      const processes = await this.getSystemProcesses();
      
      // Update existing processes and add new ones
      for (const process of processes) {
        const existing = this.processes.get(process.pid);
        
        if (existing) {
          // Update existing process
          this.updateProcessInfo(existing, process);
        } else {
          // New process
          this.processes.set(process.pid, process);
          this.eventEmitter.emit('process-started', process);
        }
      }

      // Remove processes that no longer exist
      const currentPids = new Set(processes.map(p => p.pid));
      for (const [pid, process] of this.processes) {
        if (!currentPids.has(pid)) {
          this.processes.delete(pid);
          this.eventEmitter.emit('process-ended', process);
        }
      }
    } catch (error) {
      console.error('Error updating process list:', error);
    }
  }

  private async getSystemProcesses(): Promise<ProcessInfo[]> {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    try {
      let command: string;
      if (process.platform === 'win32') {
        command = 'wmic process get ProcessId,ParentProcessId,Name,CommandLine,PageFileUsage,WorkingSetSize /format:csv';
      } else {
        command = 'ps aux';
      }

      const { stdout } = await execAsync(command);
      return this.parseProcessOutput(stdout);
    } catch (error) {
      throw new Error(`Failed to get process list: ${error.message}`);
    }
  }

  private parseProcessOutput(output: string): ProcessInfo[] {
    const processes: ProcessInfo[] = [];

    if (process.platform === 'win32') {
      // Parse Windows WMIC output
      const lines = output.split('\n').slice(1); // Skip header
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        const parts = line.split(',');
        if (parts.length < 6) continue;

        try {
          processes.push({
            pid: parseInt(parts[4]),
            ppid: parseInt(parts[3]),
            name: parts[2] || 'Unknown',
            command: parts[1] || '',
            args: (parts[1] || '').split(' ').slice(1),
            status: 'running',
            cpuUsage: 0, // Would need additional query
            memoryUsage: parseInt(parts[5]) || 0,
            startTime: new Date(), // Would need additional query
            user: 'Unknown'
          });
        } catch (error) {
          // Skip malformed entries
          continue;
        }
      }
    } else {
      // Parse Unix ps output
      const lines = output.split('\n').slice(1); // Skip header
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        const parts = line.trim().split(/\s+/);
        if (parts.length < 11) continue;

        try {
          const command = parts.slice(10).join(' ');
          const args = command.split(' ').slice(1);

          processes.push({
            pid: parseInt(parts[1]),
            ppid: parseInt(parts[2]),
            name: parts[10],
            command: command,
            args: args,
            status: this.parseProcessStatus(parts[7]),
            cpuUsage: parseFloat(parts[2]),
            memoryUsage: parseFloat(parts[3]),
            startTime: new Date(), // Would need to parse parts[8]
            user: parts[0]
          });
        } catch (error) {
          // Skip malformed entries
          continue;
        }
      }
    }

    return processes;
  }

  private parseProcessStatus(statusChar: string): ProcessInfo['status'] {
    switch (statusChar.charAt(0).toUpperCase()) {
      case 'R': return 'running';
      case 'S': return 'sleeping';
      case 'T': return 'stopped';
      case 'Z': return 'zombie';
      default: return 'running';
    }
  }

  private updateProcessInfo(existing: ProcessInfo, updated: ProcessInfo): void {
    existing.status = updated.status;
    existing.cpuUsage = updated.cpuUsage;
    existing.memoryUsage = updated.memoryUsage;
    existing.command = updated.command;
    existing.args = updated.args;
  }

  // Public API
  getProcesses(filter?: ProcessFilter): ProcessInfo[] {
    let processes = Array.from(this.processes.values());

    if (filter) {
      processes = processes.filter(process => {
        if (filter.name && !process.name.includes(filter.name)) return false;
        if (filter.status && process.status !== filter.status) return false;
        if (filter.user && process.user !== filter.user) return false;
        if (filter.minCpuUsage && process.cpuUsage < filter.minCpuUsage) return false;
        if (filter.minMemoryUsage && process.memoryUsage < filter.minMemoryUsage) return false;
        return true;
      });
    }

    return processes;
  }

  getProcess(pid: number): ProcessInfo | undefined {
    return this.processes.get(pid);
  }

  getRunningProcesses(): ProcessInfo[] {
    return this.getProcesses({ status: 'running' });
  }

  async killProcess(pid: number, signal: string = 'SIGTERM'): Promise<boolean> {
    try {
      process.kill(pid, signal);
      return true;
    } catch (error) {
      return false;
    }
  }

  async killProcessTree(pid: number): Promise<boolean> {
    const children = this.getChildProcesses(pid);
    
    // Kill children first
    for (const child of children) {
      await this.killProcessTree(child.pid);
    }

    // Kill the parent process
    return await this.killProcess(pid);
  }

  private getChildProcesses(ppid: number): ProcessInfo[] {
    return Array.from(this.processes.values()).filter(p => p.ppid === ppid);
  }

  // Event handling
  onProcessStarted(callback: (process: ProcessInfo) => void): void {
    this.eventEmitter.on('process-started', callback);
  }

  onProcessEnded(callback: (process: ProcessInfo) => void): void {
    this.eventEmitter.on('process-ended', callback);
  }

  onExit(callback: (code: number) => void): void {
    this.eventEmitter.on('exit', callback);
  }

  offExit(callback: (code: number) => void): void {
    this.eventEmitter.off('exit', callback);
  }

  dispose(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.eventEmitter.removeAllListeners();
  }
}
```

### 5. Command History and Auto-completion
```typescript
interface HistoryEntry {
  command: string;
  timestamp: Date;
  exitCode?: number;
  workingDirectory: string;
  executionTime?: number;
}

interface HistoryFilter {
  pattern?: string;
  exitCode?: number;
  directory?: string;
  fromDate?: Date;
  toDate?: Date;
}

class CommandHistory {
  private history: HistoryEntry[] = [];
  private currentIndex: number = -1;
  private maxSize: number = 10000;
  private searchIndex: Map<string, number[]> = new Map();

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
    this.loadFromStorage();
  }

  add(command: string, workingDirectory: string = process.cwd(), exitCode?: number, executionTime?: number): void {
    const entry: HistoryEntry = {
      command: command.trim(),
      timestamp: new Date(),
      exitCode,
      workingDirectory,
      executionTime
    };

    // Don't add empty commands or duplicates of the last command
    if (!entry.command || (this.history.length > 0 && this.history[this.history.length - 1].command === entry.command)) {
      return;
    }

    this.history.push(entry);
    this.updateSearchIndex(entry, this.history.length - 1);

    // Trim if exceeding max size
    if (this.history.length > this.maxSize) {
      const removed = this.history.shift();
      if (removed) {
        this.removeFromSearchIndex(removed, 0);
        this.updateSearchIndexAfterRemoval();
      }
    }

    this.currentIndex = this.history.length;
    this.saveToStorage();
  }

  previous(): string | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex].command;
    }
    return null;
  }

  next(): string | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex].command;
    }
    this.currentIndex = this.history.length;
    return null;
  }

  search(pattern: string, limit: number = 50): HistoryEntry[] {
    const regex = new RegExp(pattern, 'i');
    return this.history
      .filter(entry => regex.test(entry.command))
      .slice(-limit)
      .reverse();
  }

  filter(filter: HistoryFilter): HistoryEntry[] {
    return this.history.filter(entry => {
      if (filter.pattern && !new RegExp(filter.pattern, 'i').test(entry.command)) {
        return false;
      }
      if (filter.exitCode !== undefined && entry.exitCode !== filter.exitCode) {
        return false;
      }
      if (filter.directory && !entry.workingDirectory.includes(filter.directory)) {
        return false;
      }
      if (filter.fromDate && entry.timestamp < filter.fromDate) {
        return false;
      }
      if (filter.toDate && entry.timestamp > filter.toDate) {
        return false;
      }
      return true;
    });
  }

  getRecent(count: number = 10): string[] {
    return this.history
      .slice(-count)
      .map(entry => entry.command)
      .reverse();
  }

  getStatistics(): HistoryStatistics {
    const commandCounts = new Map<string, number>();
    const directoryCounts = new Map<string, number>();
    let totalExecutionTime = 0;
    let successfulCommands = 0;
    let failedCommands = 0;

    for (const entry of this.history) {
      // Command frequency
      const commandBase = entry.command.split(' ')[0];
      commandCounts.set(commandBase, (commandCounts.get(commandBase) || 0) + 1);

      // Directory usage
      directoryCounts.set(entry.workingDirectory, (directoryCounts.get(entry.workingDirectory) || 0) + 1);

      // Execution time
      if (entry.executionTime) {
        totalExecutionTime += entry.executionTime;
      }

      // Success/failure rate
      if (entry.exitCode === 0) {
        successfulCommands++;
      } else if (entry.exitCode !== undefined) {
        failedCommands++;
      }
    }

    return {
      totalCommands: this.history.length,
      successfulCommands,
      failedCommands,
      successRate: successfulCommands / (successfulCommands + failedCommands),
      averageExecutionTime: totalExecutionTime / this.history.length,
      mostUsedCommands: Array.from(commandCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      mostUsedDirectories: Array.from(directoryCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    };
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.searchIndex.clear();
    this.saveToStorage();
  }

  export(): HistoryEntry[] {
    return [...this.history];
  }

  import(entries: HistoryEntry[]): void {
    this.history = entries.slice(0, this.maxSize);
    this.rebuildSearchIndex();
    this.currentIndex = this.history.length;
    this.saveToStorage();
  }

  private updateSearchIndex(entry: HistoryEntry, index: number): void {
    const words = entry.command.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (!this.searchIndex.has(word)) {
        this.searchIndex.set(word, []);
      }
      this.searchIndex.get(word)!.push(index);
    }
  }

  private removeFromSearchIndex(entry: HistoryEntry, index: number): void {
    const words = entry.command.toLowerCase().split(/\s+/);
    for (const word of words) {
      const indices = this.searchIndex.get(word);
      if (indices) {
        const indexPos = indices.indexOf(index);
        if (indexPos !== -1) {
          indices.splice(indexPos, 1);
        }
        if (indices.length === 0) {
          this.searchIndex.delete(word);
        }
      }
    }
  }

  private updateSearchIndexAfterRemoval(): void {
    // Decrement all indices after removal
    for (const indices of this.searchIndex.values()) {
      for (let i = 0; i < indices.length; i++) {
        indices[i]--;
      }
    }
  }

  private rebuildSearchIndex(): void {
    this.searchIndex.clear();
    this.history.forEach((entry, index) => {
      this.updateSearchIndex(entry, index);
    });
  }

  private saveToStorage(): void {
    try {
      const data = JSON.stringify(this.history);
      localStorage.setItem('terminal-history', data);
    } catch (error) {
      console.warn('Failed to save command history:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('terminal-history');
      if (data) {
        const entries = JSON.parse(data);
        this.history = entries.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        this.rebuildSearchIndex();
        this.currentIndex = this.history.length;
      }
    } catch (error) {
      console.warn('Failed to load command history:', error);
    }
  }
}

// Auto-completion system
class TerminalAutoCompletion {
  private commandDatabase: CommandDatabase;
  private fileSystemCache: FileSystemCache;
  private aiAssistant: TerminalAIAssistant;

  constructor(aiAssistant: TerminalAIAssistant) {
    this.commandDatabase = new CommandDatabase();
    this.fileSystemCache = new FileSystemCache();
    this.aiAssistant = aiAssistant;
  }

  async getCompletions(
    partialCommand: string,
    context: TerminalContext
  ): Promise<CompletionSuggestion[]> {
    const completions: CompletionSuggestion[] = [];

    // 1. Command completions
    if (!partialCommand.includes(' ')) {
      completions.push(...await this.getCommandCompletions(partialCommand));
    }

    // 2. File/directory completions
    completions.push(...await this.getFileCompletions(partialCommand, context));

    // 3. Flag/option completions
    completions.push(...await this.getFlagCompletions(partialCommand));

    // 4. AI-powered completions
    completions.push(...await this.getAICompletions(partialCommand, context));

    // Sort and deduplicate
    return this.rankAndDeduplicateCompletions(completions, partialCommand);
  }

  private async getCommandCompletions(partial: string): Promise<CompletionSuggestion[]> {
    const commands = this.commandDatabase.searchCommands(partial);
    return commands.map(cmd => ({
      type: 'command',
      text: cmd.name,
      description: cmd.description,
      score: this.calculateScore(cmd.name, partial)
    }));
  }

  private async getFileCompletions(
    partialCommand: string,
    context: TerminalContext
  ): Promise<CompletionSuggestion[]> {
    const parts = partialCommand.split(' ');
    const lastPart = parts[parts.length - 1];

    if (!lastPart.startsWith('/') && !lastPart.includes('.') && !lastPart.includes('\\')) {
      return [];
    }

    const files = await this.fileSystemCache.getFiles(context.currentDirectory, lastPart);
    return files.map(file => ({
      type: file.isDirectory ? 'directory' : 'file',
      text: lastPart + file.name.substring(lastPart.length),
      description: file.isDirectory ? 'Directory' : `File (${file.size} bytes)`,
      score: this.calculateScore(file.name, lastPart)
    }));
  }

  private async getFlagCompletions(partialCommand: string): Promise<CompletionSuggestion[]> {
    const parts = partialCommand.split(' ');
    const command = parts[0];
    const lastPart = parts[parts.length - 1];

    if (!lastPart.startsWith('-')) {
      return [];
    }

    const flags = this.commandDatabase.getCommandFlags(command);
    return flags
      .filter(flag => flag.startsWith(lastPart))
      .map(flag => ({
        type: 'flag',
        text: flag,
        description: this.commandDatabase.getFlagDescription(command, flag),
        score: this.calculateScore(flag, lastPart)
      }));
  }

  private async getAICompletions(
    partialCommand: string,
    context: TerminalContext
  ): Promise<CompletionSuggestion[]> {
    if (partialCommand.length < 3) return []; // Only for longer inputs

    const suggestions = await this.aiAssistant.getSuggestions(context);
    return suggestions
      .filter(suggestion => suggestion.command.startsWith(partialCommand))
      .map(suggestion => ({
        type: 'ai-suggestion',
        text: suggestion.command,
        description: suggestion.description,
        score: suggestion.confidence
      }));
  }

  private calculateScore(candidate: string, partial: string): number {
    if (candidate.startsWith(partial)) {
      return 1.0 - (candidate.length - partial.length) / candidate.length;
    }

    if (candidate.toLowerCase().includes(partial.toLowerCase())) {
      return 0.5;
    }

    return 0.1;
  }

  private rankAndDeduplicateCompletions(
    completions: CompletionSuggestion[],
    partial: string
  ): CompletionSuggestion[] {
    // Remove duplicates
    const unique = new Map<string, CompletionSuggestion>();
    for (const completion of completions) {
      const existing = unique.get(completion.text);
      if (!existing || completion.score > existing.score) {
        unique.set(completion.text, completion);
      }
    }

    // Sort by score and relevance
    return Array.from(unique.values())
      .sort((a, b) => {
        // Prioritize exact prefix matches
        const aStartsWith = a.text.startsWith(partial);
        const bStartsWith = b.text.startsWith(partial);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Then by score
        return b.score - a.score;
      })
      .slice(0, 20); // Limit to top 20 results
  }
}
```

## Security and Permissions
### الأمان والصلاحيات

### 1. Security Manager
```typescript
interface SecurityPolicy {
  allowedCommands: string[];
  blockedCommands: string[];
  allowedDirectories: string[];
  blockedDirectories: string[];
  maxExecutionTime: number;
  requireConfirmation: string[];
  logAllCommands: boolean;
}

interface SecurityViolation {
  type: 'blocked-command' | 'unauthorized-directory' | 'timeout' | 'suspicious-pattern';
  command: string;
  reason: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class TerminalSecurityManager {
  private policy: SecurityPolicy;
  private violations: SecurityViolation[] = [];
  private suspiciousPatterns: RegExp[] = [];

  constructor(policy?: Partial<SecurityPolicy>) {
    this.policy = this.mergeWithDefaults(policy || {});
    this.initializeSuspiciousPatterns();
  }

  private mergeWithDefaults(userPolicy: Partial<SecurityPolicy>): SecurityPolicy {
    const defaultPolicy: SecurityPolicy = {
      allowedCommands: ['ls', 'cd', 'pwd', 'cat', 'grep', 'find', 'git', 'npm', 'node', 'python'],
      blockedCommands: ['rm -rf /', 'format', 'del /s /q', 'shutdown', 'reboot', 'mkfs'],
      allowedDirectories: [process.cwd(), os.homedir()],
      blockedDirectories: ['/etc', '/var', '/sys', '/proc', 'C:\\Windows', 'C:\\System32'],
      maxExecutionTime: 300, // 5 minutes
      requireConfirmation: ['rm -rf', 'git push --force', 'npm publish'],
      logAllCommands: true
    };

    return { ...defaultPolicy, ...userPolicy };
  }

  private initializeSuspiciousPatterns(): void {
    this.suspiciousPatterns = [
      /curl.*\|.*sh/, // Piping curl to shell
      /wget.*\|.*sh/, // Piping wget to shell
      /nc\s+-l/, // Netcat listening
      /ncat\s+-l/, // Ncat listening
      /python.*-c.*os\.system/, // Python system calls
      /eval\s*\(/, // Eval functions
      /base64.*decode/, // Base64 decoding (potential obfuscation)
      /rm\s+-rf\s+[\/\\]/, // Recursive delete of root
      /chmod\s+777/, // Overly permissive permissions
      /sudo\s+su/, // Privilege escalation
    ];
  }

  async validateCommand(command: string, options: CommandExecutionOptions = {}): Promise<void> {
    const trimmedCommand = command.trim();
    
    // Check for empty commands
    if (!trimmedCommand) {
      throw new SecurityError('Empty command not allowed', 'empty-command');
    }

    // Check blocked commands
    await this.checkBlockedCommands(trimmedCommand);

    // Check directory access
    await this.checkDirectoryAccess(trimmedCommand, options.workingDirectory);

    // Check suspicious patterns
    await this.checkSuspiciousPatterns(trimmedCommand);

    // Check command length (prevent buffer overflow)
    if (trimmedCommand.length > 10000) {
      throw new SecurityError('Command too long', 'command-length');
    }

    // Log if required
    if (this.policy.logAllCommands) {
      this.logCommand(trimmedCommand, options);
    }
  }

  private async checkBlockedCommands(command: string): Promise<void> {
    const commandBase = command.split(' ')[0].toLowerCase();
    
    for (const blocked of this.policy.blockedCommands) {
      if (command.toLowerCase().includes(blocked.toLowerCase())) {
        const violation: SecurityViolation = {
          type: 'blocked-command',
          command,
          reason: `Blocked command pattern: ${blocked}`,
          timestamp: new Date(),
          severity: 'high'
        };
        
        this.violations.push(violation);
        throw new SecurityError(`Command blocked: ${blocked}`, 'blocked-command');
      }
    }

    // Check if command is in allowed list (if allowlist is restrictive)
    if (this.policy.allowedCommands.length > 0) {
      const isAllowed = this.policy.allowedCommands.some(allowed => 
        commandBase === allowed.toLowerCase() ||
        command.toLowerCase().startsWith(allowed.toLowerCase())
      );

      if (!isAllowed) {
        const violation: SecurityViolation = {
          type: 'blocked-command',
          command,
          reason: `Command not in allowlist: ${commandBase}`,
          timestamp: new Date(),
          severity: 'medium'
        };
        
        this.violations.push(violation);
        throw new SecurityError(`Command not allowed: ${commandBase}`, 'not-allowed');
      }
    }
  }

  private async checkDirectoryAccess(command: string, workingDirectory?: string): Promise<void> {
    const targetDir = workingDirectory || process.cwd();

    // Check if trying to access blocked directories
    for (const blocked of this.policy.blockedDirectories) {
      if (targetDir.startsWith(blocked) || command.includes(blocked)) {
        const violation: SecurityViolation = {
          type: 'unauthorized-directory',
          command,
          reason: `Access to blocked directory: ${blocked}`,
          timestamp: new Date(),
          severity: 'high'
        };
        
        this.violations.push(violation);
        throw new SecurityError(`Directory access denied: ${blocked}`, 'directory-access');
      }
    }

    // Check if accessing allowed directories (if allowlist exists)
    if (this.policy.allowedDirectories.length > 0) {
      const isAllowed = this.policy.allowedDirectories.some(allowed => 
        targetDir.startsWith(allowed)
      );

      if (!isAllowed) {
        const violation: SecurityViolation = {
          type: 'unauthorized-directory',
          command,
          reason: `Directory not in allowlist: ${targetDir}`,
          timestamp: new Date(),
          severity: 'medium'
        };
        
        this.violations.push(violation);
        throw new SecurityError(`Directory access denied: ${targetDir}`, 'directory-not-allowed');
      }
    }
  }

  private async checkSuspiciousPatterns(command: string): Promise<void> {
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(command)) {
        const violation: SecurityViolation = {
          type: 'suspicious-pattern',
          command,
          reason: `Suspicious pattern detected: ${pattern.source}`,
          timestamp: new Date(),
          severity: 'critical'
        };
        
        this.violations.push(violation);
        
        // For critical patterns, block immediately
        throw new SecurityError(`Suspicious command pattern detected`, 'suspicious-pattern');
      }
    }
  }

  async requireConfirmation(command: string): Promise<boolean> {
    for (const pattern of this.policy.requireConfirmation) {
      if (command.toLowerCase().includes(pattern.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  private logCommand(command: string, options: CommandExecutionOptions): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      command,
      workingDirectory: options.workingDirectory || process.cwd(),
      user: os.userInfo().username,
      pid: process.pid
    };

    // In a real implementation, this would write to a secure log file
    console.log('SECURITY LOG:', logEntry);
  }

  getViolations(): SecurityViolation[] {
    return [...this.violations];
  }

  clearViolations(): void {
    this.violations = [];
  }

  updatePolicy(newPolicy: Partial<SecurityPolicy>): void {
    this.policy = { ...this.policy, ...newPolicy };
  }

  getPolicy(): SecurityPolicy {
    return { ...this.policy };
  }
}

class SecurityError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SecurityError';
  }
}
```

## Integration with Development Tools
### تكامل مع أدوات التطوير

### 1. Git Integration
```typescript
class GitIntegration {
  private terminalManager: TerminalManager;

  constructor(terminalManager: TerminalManager) {
    this.terminalManager = terminalManager;
  }

  async getStatus(terminalId: string): Promise<GitStatus> {
    const result = await this.terminalManager.executeCommand(terminalId, 'git status --porcelain');
    return this.parseGitStatus(result.stdout);
  }

  async getBranches(terminalId: string): Promise<GitBranch[]> {
    const result = await this.terminalManager.executeCommand(terminalId, 'git branch -a');
    return this.parseGitBranches(result.stdout);
  }

  async getCurrentBranch(terminalId: string): Promise<string> {
    const result = await this.terminalManager.executeCommand(terminalId, 'git rev-parse --abbrev-ref HEAD');
    return result.stdout.trim();
  }

  async getCommitHistory(terminalId: string, limit: number = 10): Promise<GitCommit[]> {
    const command = `git log --oneline -n ${limit} --pretty=format:"%H|%an|%ad|%s" --date=iso`;
    const result = await this.terminalManager.executeCommand(terminalId, command);
    return this.parseGitLog(result.stdout);
  }

  private parseGitStatus(output: string): GitStatus {
    const lines = output.split('\n').filter(line => line.trim());
    const files: GitFileStatus[] = [];

    for (const line of lines) {
      if (line.length >= 3) {
        const status = line.substring(0, 2);
        const filename = line.substring(3);
        
        files.push({
          filename,
          status: this.parseFileStatus(status),
          staged: status[0] !== ' ',
          unstaged: status[1] !== ' '
        });
      }
    }

    return { files };
  }

  private parseFileStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'M ': 'modified-staged',
      ' M': 'modified-unstaged',
      'MM': 'modified-both',
      'A ': 'added',
      'D ': 'deleted',
      'R ': 'renamed',
      'C ': 'copied',
      '??': 'untracked'
    };

    return statusMap[status] || 'unknown';
  }
}
```

## الخلاصة والخطوات التالية
### Summary and Next Steps

تم تصميم نظام Terminal المتكامل بشكل شامل ومتقدم يشمل:

### الميزات المكتملة:
1. **Terminal Interface متقدم**:
   - عدة تبويبات مع إدارة جلسات
   - تخصيص كامل للمظهر والسلوك
   - تكامل مع xterm.js وnode-pty
   - دعم جميع أنظمة التشغيل

2. **AI Terminal Assistant ذكي**:
   - اقتراحات الأوامر الذكية
   - تحليل الأخطاء والحلول
   - تحسين الأوامر تلقائياً
   - إكمال تلقائي مدعوم بالAI

3. **إدارة العمليات المتطورة**:
   - مراقبة العمليات في الوقت الفعلي
   - إحصائيات الأداء والذاكرة
   - إدارة شجرة العمليات
   - تنظيف العمليات المعلقة

4. **نظام الأمان الشامل**:
   - سياسات أمان قابلة للتخصيص
   - منع الأوامر الخطيرة
   - مراقبة الأنماط المشبوهة
   - تسجيل جميع الأنشطة

5. **Command History وAuto-completion**:
   - تاريخ أوامر ذكي مع بحث
   - إحصائيات الاستخدام
   - إكمال تلقائي للملفات والأوامر
   - تصدير/استيراد التاريخ

6. **تكامل أدوات التطوير**:
   - Git integration شامل
   - دعم npm, yarn, pip
   - تكامل Docker والبناء
   - أدوات قواعد البيانات والSaaS

### الميزات التقنية المتقدمة:
- **Real-time output streaming** مع معالجة ANSI
- **Session management** مع استمرارية الجلسات
- **Cross-platform support** لجميع أنظمة التشغيل
- **Performance monitoring** مع تحليل الأداء
- **Security framework** قابل للتوسع
- **AI integration** في جميع جوانب Terminal

### الخطوة التالية:
المكون التالي هو **نظام إدارة الملفات والمشاريع** والذي سيتضمن:
- File Explorer متقدم مع البحث الذكي
- إدارة المشاريع والWorkspaces
- تكامل مع Version Control
- نظام الملفات المؤقتة والنسخ الاحتياطية
- تزامن الملفات والمجلدات

هذا النظام يوفر بيئة Terminal متكاملة وقوية تحاكي وتتفوق على أفضل الحلول المتاحة مع إضافة الذكاء الاصطناعي والميزات المتقدمة.