import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, Project, OpenFile, LayoutConfig, AppSettings } from '../../shared/types';

// Initial state
const initialState: AppState = {
  activeProject: undefined,
  openFiles: [],
  activeFileId: undefined,
  layout: {
    sidebar: {
      visible: true,
      width: 300,
      activePanel: 'explorer'
    },
    editor: {
      split: 'none',
      minimap: true,
      lineNumbers: true,
      wordWrap: false
    },
    terminal: {
      visible: false,
      height: 300
    },
    chat: {
      visible: false,
      width: 400,
      position: 'right'
    }
  },
  settings: {
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'Fira Code',
    language: 'en',
    telemetry: false,
    autoUpdate: true,
    ai: {
      defaultProvider: 'openai',
      defaultModel: 'gpt-4',
      autoComplete: true,
      inlineChat: true
    },
    editor: {
      tabSize: 2,
      insertSpaces: true,
      formatOnSave: true,
      codeAction: true
    },
    terminal: {
      shell: 'bash',
      fontSize: 12,
      fontFamily: 'Fira Code'
    }
  }
};

// Action types
type AppAction =
  | { type: 'SET_ACTIVE_PROJECT'; payload: Project | undefined }
  | { type: 'ADD_OPEN_FILE'; payload: OpenFile }
  | { type: 'REMOVE_OPEN_FILE'; payload: string }
  | { type: 'UPDATE_OPEN_FILE'; payload: { id: string; updates: Partial<OpenFile> } }
  | { type: 'SET_ACTIVE_FILE'; payload: string | undefined }
  | { type: 'UPDATE_LAYOUT'; payload: Partial<LayoutConfig> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_TERMINAL' }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_SIDEBAR_PANEL'; payload: 'explorer' | 'search' | 'git' | 'extensions' }
  | { type: 'RESTORE_STATE'; payload: Partial<AppState> };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_PROJECT':
      return {
        ...state,
        activeProject: action.payload
      };

    case 'ADD_OPEN_FILE':
      return {
        ...state,
        openFiles: [...state.openFiles.filter(f => f.id !== action.payload.id), action.payload],
        activeFileId: action.payload.id
      };

    case 'REMOVE_OPEN_FILE':
      const newOpenFiles = state.openFiles.filter(f => f.id !== action.payload);
      const newActiveFileId = state.activeFileId === action.payload 
        ? newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1].id : undefined
        : state.activeFileId;
      
      return {
        ...state,
        openFiles: newOpenFiles,
        activeFileId: newActiveFileId
      };

    case 'UPDATE_OPEN_FILE':
      return {
        ...state,
        openFiles: state.openFiles.map(file =>
          file.id === action.payload.id
            ? { ...file, ...action.payload.updates }
            : file
        )
      };

    case 'SET_ACTIVE_FILE':
      return {
        ...state,
        activeFileId: action.payload
      };

    case 'UPDATE_LAYOUT':
      return {
        ...state,
        layout: {
          ...state.layout,
          ...action.payload,
          sidebar: {
            ...state.layout.sidebar,
            ...(action.payload.sidebar || {})
          },
          editor: {
            ...state.layout.editor,
            ...(action.payload.editor || {})
          },
          terminal: {
            ...state.layout.terminal,
            ...(action.payload.terminal || {})
          },
          chat: {
            ...state.layout.chat,
            ...(action.payload.chat || {})
          }
        }
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
          ai: {
            ...state.settings.ai,
            ...(action.payload.ai || {})
          },
          editor: {
            ...state.settings.editor,
            ...(action.payload.editor || {})
          },
          terminal: {
            ...state.settings.terminal,
            ...(action.payload.terminal || {})
          }
        }
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        layout: {
          ...state.layout,
          sidebar: {
            ...state.layout.sidebar,
            visible: !state.layout.sidebar.visible
          }
        }
      };

    case 'TOGGLE_TERMINAL':
      return {
        ...state,
        layout: {
          ...state.layout,
          terminal: {
            ...state.layout.terminal,
            visible: !state.layout.terminal.visible
          }
        }
      };

    case 'TOGGLE_CHAT':
      return {
        ...state,
        layout: {
          ...state.layout,
          chat: {
            ...state.layout.chat,
            visible: !state.layout.chat.visible
          }
        }
      };

    case 'SET_SIDEBAR_PANEL':
      return {
        ...state,
        layout: {
          ...state.layout,
          sidebar: {
            ...state.layout.sidebar,
            activePanel: action.payload
          }
        }
      };

    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  openFile: (file: OpenFile) => void;
  closeFile: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  toggleSidebar: () => void;
  toggleTerminal: () => void;
  toggleChat: () => void;
  setSidebarPanel: (panel: 'explorer' | 'search' | 'git' | 'extensions') => void;
  updateLayout: (layout: Partial<LayoutConfig>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial settings from Electron
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await window.electron.app.getSettings();
        if (settings) {
          dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await window.electron.app.updateSettings(state.settings);
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    };

    // Debounce settings save
    const timeoutId = setTimeout(saveSettings, 1000);
    return () => clearTimeout(timeoutId);
  }, [state.settings]);

  // Helper functions
  const openFile = (file: OpenFile) => {
    dispatch({ type: 'ADD_OPEN_FILE', payload: file });
  };

  const closeFile = (fileId: string) => {
    dispatch({ type: 'REMOVE_OPEN_FILE', payload: fileId });
  };

  const setActiveFile = (fileId: string) => {
    dispatch({ type: 'SET_ACTIVE_FILE', payload: fileId });
  };

  const updateFileContent = (fileId: string, content: string) => {
    dispatch({
      type: 'UPDATE_OPEN_FILE',
      payload: {
        id: fileId,
        updates: { content, isDirty: true }
      }
    });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const toggleTerminal = () => {
    dispatch({ type: 'TOGGLE_TERMINAL' });
  };

  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
  };

  const setSidebarPanel = (panel: 'explorer' | 'search' | 'git' | 'extensions') => {
    dispatch({ type: 'SET_SIDEBAR_PANEL', payload: panel });
  };

  const updateLayout = (layout: Partial<LayoutConfig>) => {
    dispatch({ type: 'UPDATE_LAYOUT', payload: layout });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    openFile,
    closeFile,
    setActiveFile,
    updateFileContent,
    toggleSidebar,
    toggleTerminal,
    toggleChat,
    setSidebarPanel,
    updateLayout,
    updateSettings
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}