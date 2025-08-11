import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannels, AppEvents } from '@/shared/types';

// Define the API that will be exposed to the renderer process
export interface ElectronAPI {
  // File Operations
  file: {
    read: (path: string) => Promise<string>;
    write: (path: string, content: string) => Promise<void>;
    delete: (path: string) => Promise<void>;
    exists: (path: string) => Promise<boolean>;
    list: (path: string) => Promise<any[]>;
    create: (path: string, type: 'file' | 'directory') => Promise<void>;
  };

  // Project Operations
  project: {
    open: (path: string) => Promise<any>;
    close: (projectId: string) => Promise<void>;
    list: () => Promise<any[]>;
    create: (name: string, path: string) => Promise<any>;
  };

  // AI Operations
  ai: {
    chat: (message: string, context?: string) => Promise<any>;
    complete: (prompt: string, language: string) => Promise<any>;
    analyze: (code: string, language: string) => Promise<any>;
  };

  // Terminal Operations
  terminal: {
    create: (workingDirectory?: string) => Promise<any>;
    write: (id: string, data: string) => Promise<void>;
    resize: (id: string, cols: number, rows: number) => Promise<void>;
    close: (id: string) => Promise<void>;
  };

  // Search Operations
  search: {
    files: (query: string, path: string) => Promise<any[]>;
    content: (query: string, path: string) => Promise<any[]>;
    semantic: (query: string, path: string) => Promise<any[]>;
  };

  // Application Operations
  app: {
    showOpenDialog: () => Promise<any>;
    showSaveDialog: (options: any) => Promise<any>;
    getSettings: () => Promise<any>;
    updateSettings: (settings: any) => Promise<void>;
  };

  // Event Listeners
  on: <K extends keyof AppEvents>(
    channel: K,
    listener: (event: any, ...args: any[]) => void
  ) => void;

  off: <K extends keyof AppEvents>(
    channel: K,
    listener: (event: any, ...args: any[]) => void
  ) => void;

  // Menu Events
  onMenuEvent: (event: string, callback: () => void) => void;
  offMenuEvent: (event: string) => void;
}

// Create the API object
const electronAPI: ElectronAPI = {
  // File Operations
  file: {
    read: (path: string) => ipcRenderer.invoke('file:read', path),
    write: (path: string, content: string) => ipcRenderer.invoke('file:write', { path, content }),
    delete: (path: string) => ipcRenderer.invoke('file:delete', path),
    exists: (path: string) => ipcRenderer.invoke('file:exists', path),
    list: (path: string) => ipcRenderer.invoke('file:list', path),
    create: (path: string, type: 'file' | 'directory') => ipcRenderer.invoke('file:create', { path, type })
  },

  // Project Operations
  project: {
    open: (path: string) => ipcRenderer.invoke('project:open', path),
    close: (projectId: string) => ipcRenderer.invoke('project:close', projectId),
    list: () => ipcRenderer.invoke('project:list'),
    create: (name: string, path: string) => ipcRenderer.invoke('project:create', { name, path })
  },

  // AI Operations
  ai: {
    chat: (message: string, context?: string) => ipcRenderer.invoke('ai:chat', { message, context }),
    complete: (prompt: string, language: string) => ipcRenderer.invoke('ai:complete', { prompt, language }),
    analyze: (code: string, language: string) => ipcRenderer.invoke('ai:analyze', { code, language })
  },

  // Terminal Operations
  terminal: {
    create: (workingDirectory?: string) => ipcRenderer.invoke('terminal:create', { workingDirectory }),
    write: (id: string, data: string) => ipcRenderer.invoke('terminal:write', { id, data }),
    resize: (id: string, cols: number, rows: number) => ipcRenderer.invoke('terminal:resize', { id, cols, rows }),
    close: (id: string) => ipcRenderer.invoke('terminal:close', { id })
  },

  // Search Operations
  search: {
    files: (query: string, path: string) => ipcRenderer.invoke('search:files', { query, path }),
    content: (query: string, path: string) => ipcRenderer.invoke('search:content', { query, path }),
    semantic: (query: string, path: string) => ipcRenderer.invoke('search:semantic', { query, path })
  },

  // Application Operations
  app: {
    showOpenDialog: () => ipcRenderer.invoke('app:show-open-dialog'),
    showSaveDialog: (options: any) => ipcRenderer.invoke('app:show-save-dialog', options),
    getSettings: () => ipcRenderer.invoke('app:get-settings'),
    updateSettings: (settings: any) => ipcRenderer.invoke('app:update-settings', settings)
  },

  // Event Listeners
  on: <K extends keyof AppEvents>(
    channel: K,
    listener: (event: any, ...args: any[]) => void
  ) => {
    ipcRenderer.on(channel, listener);
  },

  off: <K extends keyof AppEvents>(
    channel: K,
    listener: (event: any, ...args: any[]) => void
  ) => {
    ipcRenderer.removeListener(channel, listener);
  },

  // Menu Events
  onMenuEvent: (event: string, callback: () => void) => {
    ipcRenderer.on(event, callback);
  },

  offMenuEvent: (event: string) => {
    ipcRenderer.removeAllListeners(event);
  }
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', electronAPI);

// Type declaration for the global window object
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export { electronAPI };