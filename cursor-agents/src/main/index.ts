import { app, BrowserWindow, ipcMain, Menu, dialog, shell } from 'electron';
import { join } from 'path';
import { AppSettings } from '../shared/types';

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
import { WindowManager } from './managers/WindowManager';
import { FileManager } from './managers/FileManager';
import { ProjectManager } from './managers/ProjectManager';
import { TerminalManager } from './managers/TerminalManager';
import { AIManager } from './managers/AIManager';
import { SearchManager } from './managers/SearchManager';
import { SettingsManager } from './managers/SettingsManager';

export class Application {
  private windowManager: WindowManager;
  private fileManager: FileManager;
  private projectManager: ProjectManager;
  private terminalManager: TerminalManager;
  private aiManager: AIManager;
  private searchManager: SearchManager;
  private settingsManager: SettingsManager;

  constructor() {
    this.windowManager = new WindowManager();
    this.fileManager = new FileManager();
    this.projectManager = new ProjectManager();
    this.terminalManager = new TerminalManager();
    this.aiManager = new AIManager();
    this.searchManager = new SearchManager();
    this.settingsManager = new SettingsManager();

    this.initializeApp();
  }

  private initializeApp(): void {
    // Set app user model ID for Windows
    if (process.platform === 'win32') {
      app.setAppUserModelId('com.cursoragents.app');
    }

    // Handle app events
    app.whenReady().then(() => {
      this.setupIpcHandlers();
      this.createMainWindow();
      this.setupApplicationMenu();
      
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('before-quit', async () => {
      await this.cleanup();
    });
  }

  private createMainWindow(): void {
    const mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      show: false,
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
      if (isDev) {
        mainWindow.webContents.openDevTools();
      }
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });

    // Load the app
    if (isDev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }

    this.windowManager.setMainWindow(mainWindow);
  }

  private setupIpcHandlers(): void {
    // File operations
    ipcMain.handle('file:read', async (_, path: string) => {
      return this.fileManager.readFile(path);
    });

    ipcMain.handle('file:write', async (_, { path, content }: { path: string; content: string }) => {
      return this.fileManager.writeFile(path, content);
    });

    ipcMain.handle('file:delete', async (_, path: string) => {
      return this.fileManager.deleteFile(path);
    });

    ipcMain.handle('file:exists', async (_, path: string) => {
      return this.fileManager.fileExists(path);
    });

    ipcMain.handle('file:list', async (_, path: string) => {
      return this.fileManager.listFiles(path);
    });

    ipcMain.handle('file:create', async (_, { path, type }: { path: string; type: 'file' | 'directory' }) => {
      return this.fileManager.createFile(path, type);
    });

    // Project operations
    ipcMain.handle('project:open', async (_, path: string) => {
      return this.projectManager.openProject(path);
    });

    ipcMain.handle('project:close', async (_, projectId: string) => {
      return this.projectManager.closeProject(projectId);
    });

    ipcMain.handle('project:list', async () => {
      return this.projectManager.listProjects();
    });

    ipcMain.handle('project:create', async (_, { name, path }: { name: string; path: string }) => {
      return this.projectManager.createProject(name, path);
    });

    // AI operations
    ipcMain.handle('ai:chat', async (_, { message, context }: { message: string; context?: string }) => {
      return this.aiManager.chat(message, context);
    });

    ipcMain.handle('ai:complete', async (_, { prompt, language }: { prompt: string; language: string }) => {
      return this.aiManager.complete(prompt, language);
    });

    ipcMain.handle('ai:analyze', async (_, { code, language }: { code: string; language: string }) => {
      return this.aiManager.analyzeCode(code, language);
    });

    // Terminal operations
    ipcMain.handle('terminal:create', async (_, { workingDirectory }: { workingDirectory?: string }) => {
      return this.terminalManager.createTerminal(workingDirectory);
    });

    ipcMain.handle('terminal:write', async (_, { id, data }: { id: string; data: string }) => {
      return this.terminalManager.writeToTerminal(id, data);
    });

    ipcMain.handle('terminal:resize', async (_, { id, cols, rows }: { id: string; cols: number; rows: number }) => {
      return this.terminalManager.resizeTerminal(id, cols, rows);
    });

    ipcMain.handle('terminal:close', async (_, { id }: { id: string }) => {
      return this.terminalManager.closeTerminal(id);
    });

    // Search operations
    ipcMain.handle('search:files', async (_, { query, path }: { query: string; path: string }) => {
      return this.searchManager.searchFiles(query, path);
    });

    ipcMain.handle('search:content', async (_, { query, path }: { query: string; path: string }) => {
      return this.searchManager.searchContent(query, path);
    });

    ipcMain.handle('search:semantic', async (_, { query, path }: { query: string; path: string }) => {
      return this.searchManager.searchSemantic(query, path);
    });

    // Application operations
    ipcMain.handle('app:show-open-dialog', async () => {
      const result = await dialog.showOpenDialog(this.windowManager.getMainWindow()!, {
        properties: ['openDirectory'],
        title: 'Open Project Folder'
      });
      return result;
    });

    ipcMain.handle('app:show-save-dialog', async (_, options: any) => {
      const result = await dialog.showSaveDialog(this.windowManager.getMainWindow()!, options);
      return result;
    });

    ipcMain.handle('app:get-settings', async () => {
      return this.settingsManager.getSettings();
    });

    ipcMain.handle('app:update-settings', async (_, settings: AppSettings) => {
      return this.settingsManager.updateSettings(settings);
    });
  }

  private setupApplicationMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New File',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:new-file');
            }
          },
          {
            label: 'Open File',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:open-file');
            }
          },
          {
            label: 'Open Folder',
            accelerator: 'CmdOrCtrl+Shift+O',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:open-folder');
            }
          },
          { type: 'separator' },
          {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:save');
            }
          },
          {
            label: 'Save As',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:save-as');
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Toggle Terminal',
            accelerator: 'CmdOrCtrl+`',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:toggle-terminal');
            }
          },
          {
            label: 'Toggle Chat',
            accelerator: 'CmdOrCtrl+Shift+C',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:toggle-chat');
            }
          },
          { type: 'separator' },
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'AI',
        submenu: [
          {
            label: 'Chat with AI',
            accelerator: 'CmdOrCtrl+I',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:ai-chat');
            }
          },
          {
            label: 'Code Completion',
            accelerator: 'CmdOrCtrl+Space',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:ai-complete');
            }
          },
          {
            label: 'Analyze Code',
            accelerator: 'CmdOrCtrl+Shift+A',
            click: () => {
              this.windowManager.getMainWindow()?.webContents.send('menu:ai-analyze');
            }
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ];

    if (process.platform === 'darwin') {
      template.unshift({
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private async cleanup(): Promise<void> {
    await this.terminalManager.cleanup();
    await this.aiManager.cleanup();
    await this.settingsManager.save();
  }
}

// Initialize the application
new Application();