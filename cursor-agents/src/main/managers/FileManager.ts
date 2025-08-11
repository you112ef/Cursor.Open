import { promises as fs } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { watch, FSWatcher } from 'chokidar';
import { FileItem } from '@/shared/types';
import { v4 as uuidv4 } from 'uuid';

export class FileManager {
  private watchers: Map<string, FSWatcher> = new Map();
  private fileCache: Map<string, string> = new Map();

  async readFile(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      this.fileCache.set(filePath, content);
      return content;
    } catch (error) {
      throw new Error(`Failed to read file: ${error}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      // Ensure directory exists
      const dir = dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(filePath, content, 'utf-8');
      this.fileCache.set(filePath, content);
    } catch (error) {
      throw new Error(`Failed to write file: ${error}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        await fs.rmdir(filePath, { recursive: true });
      } else {
        await fs.unlink(filePath);
      }
      
      this.fileCache.delete(filePath);
      this.stopWatching(filePath);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async createFile(filePath: string, type: 'file' | 'directory'): Promise<void> {
    try {
      if (type === 'directory') {
        await fs.mkdir(filePath, { recursive: true });
      } else {
        // Ensure directory exists
        const dir = dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        
        // Create empty file if it doesn't exist
        if (!(await this.fileExists(filePath))) {
          await fs.writeFile(filePath, '', 'utf-8');
        }
      }
    } catch (error) {
      throw new Error(`Failed to create ${type}: ${error}`);
    }
  }

  async listFiles(directoryPath: string): Promise<FileItem[]> {
    try {
      const items = await fs.readdir(directoryPath, { withFileTypes: true });
      const fileItems: FileItem[] = [];

      for (const item of items) {
        const fullPath = join(directoryPath, item.name);
        const stats = await fs.stat(fullPath);

        const fileItem: FileItem = {
          id: uuidv4(),
          name: item.name,
          path: fullPath,
          type: item.isDirectory() ? 'directory' : 'file',
          size: item.isFile() ? stats.size : undefined,
          modified: stats.mtime,
          extension: item.isFile() ? extname(item.name).slice(1) : undefined
        };

        // Recursively load directory children (limit depth for performance)
        if (item.isDirectory() && this.shouldLoadDirectory(item.name)) {
          try {
            fileItem.children = await this.listFiles(fullPath);
          } catch (error) {
            // Skip directories we can't read
            console.warn(`Cannot read directory ${fullPath}: ${error}`);
          }
        }

        fileItems.push(fileItem);
      }

      // Sort: directories first, then files, both alphabetically
      return fileItems.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      throw new Error(`Failed to list files: ${error}`);
    }
  }

  async getFileStats(filePath: string): Promise<any> {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile()
      };
    } catch (error) {
      throw new Error(`Failed to get file stats: ${error}`);
    }
  }

  async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      const dir = dirname(destinationPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.copyFile(sourcePath, destinationPath);
    } catch (error) {
      throw new Error(`Failed to copy file: ${error}`);
    }
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      const dir = dirname(destinationPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.rename(sourcePath, destinationPath);
      
      // Update cache
      const content = this.fileCache.get(sourcePath);
      if (content) {
        this.fileCache.delete(sourcePath);
        this.fileCache.set(destinationPath, content);
      }
    } catch (error) {
      throw new Error(`Failed to move file: ${error}`);
    }
  }

  startWatching(directoryPath: string, callback: (event: string, path: string) => void): void {
    if (this.watchers.has(directoryPath)) {
      return;
    }

    const watcher = watch(directoryPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    watcher
      .on('add', path => callback('add', path))
      .on('change', path => callback('change', path))
      .on('unlink', path => callback('unlink', path))
      .on('addDir', path => callback('addDir', path))
      .on('unlinkDir', path => callback('unlinkDir', path))
      .on('error', error => console.error('File watcher error:', error));

    this.watchers.set(directoryPath, watcher);
  }

  stopWatching(directoryPath: string): void {
    const watcher = this.watchers.get(directoryPath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(directoryPath);
    }
  }

  async getFileContent(filePath: string): Promise<string> {
    // Check cache first
    const cached = this.fileCache.get(filePath);
    if (cached) {
      return cached;
    }

    return this.readFile(filePath);
  }

  async searchFiles(directoryPath: string, query: string): Promise<string[]> {
    try {
      const allFiles = await this.getAllFilesRecursively(directoryPath);
      const searchRegex = new RegExp(query, 'i');
      
      return allFiles.filter(filePath => {
        const fileName = basename(filePath);
        return searchRegex.test(fileName);
      });
    } catch (error) {
      throw new Error(`Failed to search files: ${error}`);
    }
  }

  private async getAllFilesRecursively(directoryPath: string): Promise<string[]> {
    const files: string[] = [];
    const items = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = join(directoryPath, item.name);
      
      if (item.isDirectory() && this.shouldLoadDirectory(item.name)) {
        const subFiles = await this.getAllFilesRecursively(fullPath);
        files.push(...subFiles);
      } else if (item.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private shouldLoadDirectory(dirName: string): boolean {
    const ignoredDirs = [
      'node_modules',
      '.git',
      '.vscode',
      '.idea',
      'dist',
      'build',
      'coverage',
      '.next',
      '.nuxt',
      '__pycache__',
      '.pytest_cache'
    ];

    return !ignoredDirs.includes(dirName) && !dirName.startsWith('.');
  }

  cleanup(): void {
    this.watchers.forEach(watcher => watcher.close());
    this.watchers.clear();
    this.fileCache.clear();
  }
}