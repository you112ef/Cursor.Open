// IPC Channel Types
export interface IpcChannels {
  // File Operations
  'file:read': string;
  'file:write': { path: string; content: string };
  'file:delete': string;
  'file:exists': string;
  'file:list': string;
  'file:create': { path: string; type: 'file' | 'directory' };
  
  // Project Operations
  'project:open': string;
  'project:close': string;
  'project:list': void;
  'project:create': { name: string; path: string };
  
  // AI Operations
  'ai:chat': { message: string; context?: string };
  'ai:complete': { prompt: string; language: string };
  'ai:analyze': { code: string; language: string };
  
  // Terminal Operations
  'terminal:create': { workingDirectory?: string };
  'terminal:write': { id: string; data: string };
  'terminal:resize': { id: string; cols: number; rows: number };
  'terminal:close': { id: string };
  
  // Search Operations
  'search:files': { query: string; path: string };
  'search:content': { query: string; path: string };
  'search:semantic': { query: string; path: string };
}

// Application State
export interface AppState {
  activeProject?: Project;
  openFiles: OpenFile[];
  activeFileId?: string;
  layout: LayoutConfig;
  settings: AppSettings;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'git' | 'workspace';
  lastOpened: Date;
  settings?: ProjectSettings;
}

export interface ProjectSettings {
  aiProvider: 'openai' | 'anthropic' | 'local';
  model: string;
  autoSave: boolean;
  formatting: {
    tabSize: number;
    insertSpaces: boolean;
    trimTrailingWhitespace: boolean;
  };
}

// File Types
export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  modified?: Date;
  children?: FileItem[];
}

export interface OpenFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
  cursorPosition?: { line: number; column: number };
}

// AI Types
export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  apiKey?: string;
  baseUrl?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  supportsFunction: boolean;
  costPer1kTokens: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
  };
}

export interface CodeCompletion {
  text: string;
  range: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  score: number;
}

// Terminal Types
export interface Terminal {
  id: string;
  title: string;
  workingDirectory: string;
  pid?: number;
  isActive: boolean;
  history: TerminalHistoryItem[];
}

export interface TerminalHistoryItem {
  command: string;
  output: string;
  timestamp: Date;
  exitCode?: number;
}

// UI Layout Types
export interface LayoutConfig {
  sidebar: {
    visible: boolean;
    width: number;
    activePanel: 'explorer' | 'search' | 'git' | 'extensions';
  };
  editor: {
    split: 'none' | 'horizontal' | 'vertical';
    minimap: boolean;
    lineNumbers: boolean;
    wordWrap: boolean;
  };
  terminal: {
    visible: boolean;
    height: number;
  };
  chat: {
    visible: boolean;
    width: number;
    position: 'right' | 'bottom';
  };
}

// Settings Types
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  fontFamily: string;
  language: string;
  telemetry: boolean;
  autoUpdate: boolean;
  ai: {
    defaultProvider: string;
    defaultModel: string;
    autoComplete: boolean;
    inlineChat: boolean;
  };
  editor: {
    tabSize: number;
    insertSpaces: boolean;
    formatOnSave: boolean;
    codeAction: boolean;
  };
  terminal: {
    shell: string;
    fontSize: number;
    fontFamily: string;
  };
}

// Search Types
export interface SearchResult {
  file: string;
  line: number;
  column: number;
  content: string;
  context: string;
  score?: number;
}

export interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
  includeFiles: string[];
  excludeFiles: string[];
}

// Agent Types
export interface AgentTool {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export interface AgentRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

// Events
export type AppEvents = {
  'file:changed': { path: string; content: string };
  'project:changed': { project: Project };
  'terminal:data': { id: string; data: string };
  'ai:message': { message: ChatMessage };
  'search:result': { results: SearchResult[] };
  'layout:changed': { layout: LayoutConfig };
  'settings:changed': { settings: AppSettings };
};