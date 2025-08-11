import { BrowserWindow } from 'electron';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private childWindows: Map<string, BrowserWindow> = new Map();

  setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
    this.setupWindowEventHandlers(window);
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  createChildWindow(id: string, options: Electron.BrowserWindowConstructorOptions): BrowserWindow {
    const window = new BrowserWindow({
      parent: this.mainWindow || undefined,
      modal: false,
      show: false,
      ...options
    });

    this.childWindows.set(id, window);
    this.setupWindowEventHandlers(window);

    window.on('closed', () => {
      this.childWindows.delete(id);
    });

    return window;
  }

  getChildWindow(id: string): BrowserWindow | undefined {
    return this.childWindows.get(id);
  }

  closeChildWindow(id: string): void {
    const window = this.childWindows.get(id);
    if (window && !window.isDestroyed()) {
      window.close();
    }
    this.childWindows.delete(id);
  }

  getAllWindows(): BrowserWindow[] {
    const windows: BrowserWindow[] = [];
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      windows.push(this.mainWindow);
    }
    this.childWindows.forEach(window => {
      if (!window.isDestroyed()) {
        windows.push(window);
      }
    });
    return windows;
  }

  focusMainWindow(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.focus();
    }
  }

  minimizeAllWindows(): void {
    this.getAllWindows().forEach(window => {
      if (!window.isMinimized()) {
        window.minimize();
      }
    });
  }

  restoreAllWindows(): void {
    this.getAllWindows().forEach(window => {
      if (window.isMinimized()) {
        window.restore();
      }
    });
  }

  private setupWindowEventHandlers(window: BrowserWindow): void {
    window.on('focus', () => {
      // Handle window focus
      window.webContents.send('window:focus');
    });

    window.on('blur', () => {
      // Handle window blur
      window.webContents.send('window:blur');
    });

    window.on('resize', () => {
      // Handle window resize
      const bounds = window.getBounds();
      window.webContents.send('window:resize', bounds);
    });

    window.on('moved', () => {
      // Handle window move
      const bounds = window.getBounds();
      window.webContents.send('window:moved', bounds);
    });

    window.on('maximize', () => {
      window.webContents.send('window:maximize');
    });

    window.on('unmaximize', () => {
      window.webContents.send('window:unmaximize');
    });

    window.on('minimize', () => {
      window.webContents.send('window:minimize');
    });

    window.on('restore', () => {
      window.webContents.send('window:restore');
    });

    // Handle external links
    window.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      require('electron').shell.openExternal(url);
    });
  }
}