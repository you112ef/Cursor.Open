import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileItem[];
  isOpen?: boolean;
  content?: string;
}

interface EditorTab {
  id: string;
  path: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AppState {
  // Files
  files: FileItem[];
  selectedFile: string | null;
  
  // Editor
  editorTabs: EditorTab[];
  activeTab: string | null;
  
  // Chat
  chatMessages: ChatMessage[];
  isAIThinking: boolean;
  
  // Terminal
  terminalSessions: string[];
  activeTerminal: string | null;
  
  // Layout
  layout: {
    sidebar: { visible: boolean; width: number };
    terminal: { visible: boolean; height: number };
    chat: { visible: boolean; width: number; position: 'right' | 'bottom' };
    tools: { visible: boolean; width: number; position: 'right' | 'bottom' };
  };
  
  // Settings
  settings: {
    theme: 'light' | 'dark';
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
  };
}

// Actions
type AppAction =
  | { type: 'SET_FILES'; payload: FileItem[] }
  | { type: 'SELECT_FILE'; payload: string }
  | { type: 'OPEN_FILE'; payload: { file: FileItem; content: string } }
  | { type: 'CLOSE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'UPDATE_TAB_CONTENT'; payload: { id: string; content: string } }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_AI_THINKING'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_TERMINAL' }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'TOGGLE_TOOLS' }
  | { type: 'SET_LAYOUT'; payload: Partial<AppState['layout']> }
  | { type: 'SET_SETTINGS'; payload: Partial<AppState['settings']> };

// Initial state
const initialState: AppState = {
  files: [],
  selectedFile: null,
  editorTabs: [],
  activeTab: null,
  chatMessages: [],
  isAIThinking: false,
  terminalSessions: [],
  activeTerminal: null,
  layout: {
    sidebar: { visible: true, width: 280 },
    terminal: { visible: false, height: 300 },
    chat: { visible: true, width: 350, position: 'right' },
    tools: { visible: false, width: 400, position: 'bottom' },
  },
  settings: {
    theme: 'dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
  },
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload };
      
    case 'SELECT_FILE':
      return { ...state, selectedFile: action.payload };
      
    case 'OPEN_FILE': {
      const { file, content } = action.payload;
      const existingTab = state.editorTabs.find(tab => tab.path === file.path);
      
      if (existingTab) {
        return { 
          ...state, 
          activeTab: existingTab.id,
          selectedFile: file.path 
        };
      }
      
      const newTab: EditorTab = {
        id: file.id,
        path: file.path,
        name: file.name,
        content,
        language: getLanguageFromFile(file.name),
        isDirty: false,
      };
      
      return {
        ...state,
        editorTabs: [...state.editorTabs, newTab],
        activeTab: newTab.id,
        selectedFile: file.path,
      };
    }
    
    case 'CLOSE_TAB': {
      const updatedTabs = state.editorTabs.filter(tab => tab.id !== action.payload);
      const newActiveTab = updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1].id : null;
      
      return {
        ...state,
        editorTabs: updatedTabs,
        activeTab: newActiveTab,
        selectedFile: newActiveTab ? updatedTabs.find(tab => tab.id === newActiveTab)?.path || null : null,
      };
    }
    
    case 'SET_ACTIVE_TAB':
      const tab = state.editorTabs.find(t => t.id === action.payload);
      return { 
        ...state, 
        activeTab: action.payload,
        selectedFile: tab?.path || null 
      };
      
    case 'UPDATE_TAB_CONTENT': {
      const updatedTabs = state.editorTabs.map(tab =>
        tab.id === action.payload.id
          ? { ...tab, content: action.payload.content, isDirty: true }
          : tab
      );
      return { ...state, editorTabs: updatedTabs };
    }
    
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
      
    case 'SET_AI_THINKING':
      return { ...state, isAIThinking: action.payload };
      
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        layout: {
          ...state.layout,
          sidebar: { ...state.layout.sidebar, visible: !state.layout.sidebar.visible },
        },
      };
      
    case 'TOGGLE_TERMINAL':
      return {
        ...state,
        layout: {
          ...state.layout,
          terminal: { ...state.layout.terminal, visible: !state.layout.terminal.visible },
        },
      };
      
    case 'TOGGLE_CHAT':
      return {
        ...state,
        layout: {
          ...state.layout,
          chat: { ...state.layout.chat, visible: !state.layout.chat.visible },
        },
      };
      
    case 'TOGGLE_TOOLS':
      return {
        ...state,
        layout: {
          ...state.layout,
          tools: { ...state.layout.tools, visible: !state.layout.tools.visible },
        },
      };
      
    case 'SET_LAYOUT':
      return {
        ...state,
        layout: { ...state.layout, ...action.payload },
      };
      
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
      
    default:
      return state;
  }
}

// Helper function to determine language from file extension
function getLanguageFromFile(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    json: 'json',
    md: 'markdown',
    xml: 'xml',
    sql: 'sql',
    sh: 'shell',
    yaml: 'yaml',
    yml: 'yaml',
  };
  
  return languageMap[extension || ''] || 'plaintext';
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}