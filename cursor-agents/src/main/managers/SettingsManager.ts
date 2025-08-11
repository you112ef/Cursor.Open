import { AppSettings } from '@/shared/types';
import Store from 'electron-store';

export class SettingsManager {
  private store: Store<AppSettings>;
  private settings: AppSettings;

  constructor() {
    this.store = new Store<AppSettings>({
      name: 'settings',
      defaults: {
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
          shell: process.platform === 'win32' ? 'cmd' : 'bash',
          fontSize: 12,
          fontFamily: 'Fira Code'
        }
      }
    });

    this.settings = this.store.store;
  }

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.store.store = this.settings;
  }

  async save(): Promise<void> {
    // Settings are automatically saved by electron-store
    return Promise.resolve();
  }

  reset(): void {
    this.store.clear();
    this.settings = this.store.store;
  }
}