# النظام الخلفي و API لتطبيق Cursor Agents Clone

## 🏗️ معمارية النظام الخلفي

### **البنية العامة**
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                            │
├─────────────────────────────────────────────────────────────┤
│         IPC Communication (Electron Main ↔ Renderer)       │
├─────────────────────────────────────────────────────────────┤
│                    API Gateway                             │
│               (Rate Limiting, Auth, Validation)            │
├─────────────────────────────────────────────────────────────┤
│                  Business Logic Layer                      │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │   Agent Engine  │  File Manager   │  Code Analyzer  │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                       │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │  Repository     │  Cache Manager  │  Vector Store   │   │
│  │  Pattern        │                 │                 │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Persistence Layer                       │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │     SQLite      │   File System   │  Vector DB      │   │
│  │   (Metadata)    │   (Projects)    │ (Embeddings)    │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 IPC API Design

### **IPC Channels & Handlers**
```typescript
// src/main/ipc/channels.ts
export const IPC_CHANNELS = {
  // File Operations
  FILE_OPEN: 'file:open',
  FILE_SAVE: 'file:save',
  FILE_CREATE: 'file:create',
  FILE_DELETE: 'file:delete',
  FILE_RENAME: 'file:rename',
  FILE_WATCH: 'file:watch',
  FILE_UNWATCH: 'file:unwatch',
  
  // Project Operations
  PROJECT_OPEN: 'project:open',
  PROJECT_CLOSE: 'project:close',
  PROJECT_SETTINGS: 'project:settings',
  PROJECT_INDEX: 'project:index',
  
  // Agent Operations
  AGENT_CHAT: 'agent:chat',
  AGENT_EDIT: 'agent:edit',
  AGENT_SEARCH: 'agent:search',
  AGENT_TOOLS: 'agent:tools',
  AGENT_MODE: 'agent:mode',
  
  // Terminal Operations
  TERMINAL_CREATE: 'terminal:create',
  TERMINAL_EXECUTE: 'terminal:execute',
  TERMINAL_KILL: 'terminal:kill',
  TERMINAL_RESIZE: 'terminal:resize',
  
  // Settings & Config
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  CONFIG_EXPORT: 'config:export',
  CONFIG_IMPORT: 'config:import',
  
  // AI Operations
  AI_COMPLETION: 'ai:completion',
  AI_EMBEDDING: 'ai:embedding',
  AI_ANALYZE: 'ai:analyze'
} as const;

// IPC Handler Types
interface IPCHandler<TRequest = any, TResponse = any> {
  (event: IpcMainInvokeEvent, request: TRequest): Promise<TResponse>;
}

// Request/Response Types
interface FileOperationRequest {
  path: string;
  content?: string;
  encoding?: string;
}

interface FileOperationResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface AgentChatRequest {
  message: string;
  context: {
    files: string[];
    selectedText?: string;
    cursorPosition?: { line: number; column: number };
  };
  mode: 'agent' | 'ask' | 'manual' | 'custom';
  conversationId?: string;
}

interface AgentChatResponse {
  response: string;
  actions?: AgentAction[];
  conversationId: string;
  metadata: {
    tokensUsed: number;
    processingTime: number;
    model: string;
  };
}
```

### **IPC Handlers Implementation**
```typescript
// src/main/ipc/handlers/file.handlers.ts
export class FileHandlers {
  constructor(
    private fileManager: FileManager,
    private securityManager: SecurityManager
  ) {}

  async handleFileOpen(event: IpcMainInvokeEvent, request: FileOperationRequest): Promise<FileOperationResponse> {
    try {
      // Security validation
      if (!this.securityManager.validatePath(request.path)) {
        throw new Error('Invalid file path');
      }

      const content = await this.fileManager.readFile(request.path);
      
      return {
        success: true,
        data: {
          content,
          path: request.path,
          stats: await this.fileManager.getFileStats(request.path)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async handleFileSave(event: IpcMainInvokeEvent, request: FileOperationRequest): Promise<FileOperationResponse> {
    try {
      if (!request.content) {
        throw new Error('Content is required');
      }

      await this.fileManager.writeFile(request.path, request.content);
      
      // Trigger file change event
      event.sender.send('file:changed', { path: request.path });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async handleFileWatch(event: IpcMainInvokeEvent, request: { path: string }): Promise<FileOperationResponse> {
    try {
      const watcher = this.fileManager.watchFile(request.path, (eventType, filename) => {
        event.sender.send('file:watch-event', {
          path: request.path,
          eventType,
          filename
        });
      });

      return { success: true, data: { watcherId: watcher.id } };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

---

## 🗄️ Database Schema & Models

### **SQLite Schema Design**
```sql
-- Configuration and Settings
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
  encrypted BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects and Workspaces
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  description TEXT,
  settings TEXT, -- JSON object
  git_repository TEXT,
  last_opened DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Project-specific settings and rules
CREATE TABLE project_settings (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE(project_id, key)
);

-- Agent conversations and chat history
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  title TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('agent', 'ask', 'manual', 'custom')) DEFAULT 'agent',
  metadata TEXT, -- JSON object with model info, settings, etc.
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Individual messages within conversations
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata TEXT, -- JSON: tokens, processing time, tools used, etc.
  files TEXT, -- JSON array of referenced files
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Code embeddings cache for semantic search
CREATE TABLE code_embeddings (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_hash TEXT NOT NULL, -- SHA256 of file content
  chunk_content TEXT NOT NULL,
  chunk_start_line INTEGER NOT NULL,
  chunk_end_line INTEGER NOT NULL,
  embedding BLOB NOT NULL, -- Vector embedding as binary data
  language TEXT,
  symbols TEXT, -- JSON array of code symbols in chunk
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project_file (project_id, file_path),
  INDEX idx_file_hash (file_hash)
);

-- Agent rules and custom instructions
CREATE TABLE agent_rules (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('coding_style', 'framework', 'security', 'custom')),
  rule_content TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Terminal sessions and command history
CREATE TABLE terminal_sessions (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  name TEXT,
  cwd TEXT NOT NULL,
  environment TEXT, -- JSON object
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Terminal command history
CREATE TABLE terminal_commands (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  command TEXT NOT NULL,
  exit_code INTEGER,
  output TEXT,
  duration_ms INTEGER,
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES terminal_sessions(id) ON DELETE CASCADE
);

-- File change tracking for intelligent features
CREATE TABLE file_changes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('created', 'modified', 'deleted', 'renamed')),
  old_path TEXT, -- For rename operations
  content_hash TEXT,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project_file_time (project_id, file_path, changed_at)
);

-- Background tasks and job queue
CREATE TABLE background_jobs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  priority INTEGER DEFAULT 0,
  payload TEXT, -- JSON data for the job
  result TEXT, -- JSON result data
  error TEXT, -- Error message if failed
  progress REAL DEFAULT 0.0, -- 0.0 to 1.0
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME,
  completed_at DATETIME,
  INDEX idx_status_priority (status, priority)
);

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at 
  AFTER UPDATE ON projects
  BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER update_conversations_updated_at 
  AFTER UPDATE ON conversations
  BEGIN
    UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER update_agent_rules_updated_at 
  AFTER UPDATE ON agent_rules
  BEGIN
    UPDATE agent_rules SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
```

### **Data Access Layer (Repository Pattern)**
```typescript
// src/main/database/repositories/base.repository.ts
export abstract class BaseRepository<T> {
  constructor(protected db: Database) {}

  abstract tableName: string;

  async findById(id: string): Promise<T | null> {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    const row = stmt.get(id);
    return row ? this.mapRowToEntity(row) : null;
  }

  async findAll(): Promise<T[]> {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName}`);
    const rows = stmt.all();
    return rows.map(row => this.mapRowToEntity(row));
  }

  async create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const id = generateId();
    const now = new Date().toISOString();
    
    const fields = Object.keys(entity).join(', ');
    const placeholders = Object.keys(entity).map(() => '?').join(', ');
    
    const stmt = this.db.prepare(`
      INSERT INTO ${this.tableName} (id, ${fields}, created_at, updated_at) 
      VALUES (?, ${placeholders}, ?, ?)
    `);
    
    stmt.run(id, ...Object.values(entity), now, now);
    
    return this.findById(id)!;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const stmt = this.db.prepare(`
      UPDATE ${this.tableName} 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(...Object.values(updates), id);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }

  protected abstract mapRowToEntity(row: any): T;
}

// src/main/database/repositories/project.repository.ts
export class ProjectRepository extends BaseRepository<Project> {
  tableName = 'projects';

  async findByPath(path: string): Promise<Project | null> {
    const stmt = this.db.prepare('SELECT * FROM projects WHERE path = ?');
    const row = stmt.get(path);
    return row ? this.mapRowToEntity(row) : null;
  }

  async findRecent(limit: number = 10): Promise<Project[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM projects 
      ORDER BY last_opened DESC NULLS LAST, created_at DESC 
      LIMIT ?
    `);
    const rows = stmt.all(limit);
    return rows.map(row => this.mapRowToEntity(row));
  }

  async updateLastOpened(id: string): Promise<void> {
    const stmt = this.db.prepare('UPDATE projects SET last_opened = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(id);
  }

  protected mapRowToEntity(row: any): Project {
    return {
      id: row.id,
      name: row.name,
      path: row.path,
      description: row.description,
      settings: row.settings ? JSON.parse(row.settings) : {},
      gitRepository: row.git_repository,
      lastOpened: row.last_opened ? new Date(row.last_opened) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}

// src/main/database/repositories/conversation.repository.ts
export class ConversationRepository extends BaseRepository<Conversation> {
  tableName = 'conversations';

  async findByProject(projectId: string): Promise<Conversation[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      WHERE project_id = ? 
      ORDER BY updated_at DESC
    `);
    const rows = stmt.all(projectId);
    return rows.map(row => this.mapRowToEntity(row));
  }

  async findWithMessages(conversationId: string): Promise<ConversationWithMessages | null> {
    const conversation = await this.findById(conversationId);
    if (!conversation) return null;

    const messageStmt = this.db.prepare(`
      SELECT * FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at ASC
    `);
    const messageRows = messageStmt.all(conversationId);
    const messages = messageRows.map(row => ({
      id: row.id,
      role: row.role as 'user' | 'assistant' | 'system',
      content: row.content,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
      files: row.files ? JSON.parse(row.files) : [],
      createdAt: new Date(row.created_at)
    }));

    return {
      ...conversation,
      messages
    };
  }

  protected mapRowToEntity(row: any): Conversation {
    return {
      id: row.id,
      projectId: row.project_id,
      title: row.title,
      mode: row.mode as AgentMode,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}
```

---

## 🔍 File Management System

### **File Manager Core**
```typescript
// src/main/services/file.manager.ts
export class FileManager {
  private watchers: Map<string, FSWatcher> = new Map();
  private fileCache: Map<string, FileInfo> = new Map();

  constructor(
    private securityManager: SecurityManager,
    private eventEmitter: EventEmitter
  ) {}

  async readFile(filePath: string): Promise<string> {
    await this.securityManager.validateFileAccess(filePath, 'read');
    
    // Check cache first
    const cached = this.fileCache.get(filePath);
    const stats = await fs.stat(filePath);
    
    if (cached && cached.mtime.getTime() === stats.mtime.getTime()) {
      return cached.content;
    }

    const content = await fs.readFile(filePath, 'utf-8');
    
    // Update cache
    this.fileCache.set(filePath, {
      content,
      mtime: stats.mtime,
      size: stats.size
    });

    return content;
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    await this.securityManager.validateFileAccess(filePath, 'write');
    
    // Create backup if file exists
    if (await this.fileExists(filePath)) {
      await this.createBackup(filePath);
    }

    await fs.writeFile(filePath, content, 'utf-8');
    
    // Update cache
    const stats = await fs.stat(filePath);
    this.fileCache.set(filePath, {
      content,
      mtime: stats.mtime,
      size: stats.size
    });

    // Emit change event
    this.eventEmitter.emit('file:changed', { path: filePath, type: 'modified' });
  }

  async createFile(filePath: string, content: string = ''): Promise<void> {
    if (await this.fileExists(filePath)) {
      throw new Error(`File already exists: ${filePath}`);
    }

    await this.writeFile(filePath, content);
    this.eventEmitter.emit('file:changed', { path: filePath, type: 'created' });
  }

  async deleteFile(filePath: string): Promise<void> {
    await this.securityManager.validateFileAccess(filePath, 'delete');
    
    // Create backup before deletion
    await this.createBackup(filePath);
    
    await fs.unlink(filePath);
    this.fileCache.delete(filePath);
    
    this.eventEmitter.emit('file:changed', { path: filePath, type: 'deleted' });
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    await this.securityManager.validateFileAccess(oldPath, 'read');
    await this.securityManager.validateFileAccess(newPath, 'write');
    
    await fs.rename(oldPath, newPath);
    
    // Update cache
    const cached = this.fileCache.get(oldPath);
    if (cached) {
      this.fileCache.set(newPath, cached);
      this.fileCache.delete(oldPath);
    }

    this.eventEmitter.emit('file:changed', { 
      path: newPath, 
      oldPath, 
      type: 'renamed' 
    });
  }

  async watchFile(filePath: string, callback: FileChangeCallback): Promise<FileWatcher> {
    const watcherId = generateId();
    
    const watcher = chokidar.watch(filePath, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100
      }
    });

    watcher.on('change', () => {
      this.fileCache.delete(filePath);
      callback('change', filePath);
    });

    watcher.on('unlink', () => {
      this.fileCache.delete(filePath);
      callback('unlink', filePath);
    });

    this.watchers.set(watcherId, watcher);

    return {
      id: watcherId,
      path: filePath,
      close: () => {
        watcher.close();
        this.watchers.delete(watcherId);
      }
    };
  }

  async unwatchFile(watcherId: string): Promise<void> {
    const watcher = this.watchers.get(watcherId);
    if (watcher) {
      await watcher.close();
      this.watchers.delete(watcherId);
    }
  }

  async getFileTree(rootPath: string, maxDepth: number = 10): Promise<FileNode[]> {
    await this.securityManager.validateFileAccess(rootPath, 'read');
    
    const buildTree = async (currentPath: string, depth: number): Promise<FileNode[]> => {
      if (depth > maxDepth) return [];

      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      const nodes: FileNode[] = [];

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        // Skip hidden files and directories
        if (entry.name.startsWith('.') && !this.shouldIncludeHidden(entry.name)) {
          continue;
        }

        const node: FileNode = {
          id: generateId(),
          name: entry.name,
          path: fullPath,
          type: entry.isDirectory() ? 'directory' : 'file',
          size: entry.isFile() ? (await fs.stat(fullPath)).size : undefined,
          children: entry.isDirectory() ? await buildTree(fullPath, depth + 1) : undefined
        };

        nodes.push(node);
      }

      return nodes.sort((a, b) => {
        // Directories first, then files
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    };

    return buildTree(rootPath, 0);
  }

  private async createBackup(filePath: string): Promise<void> {
    const backupDir = path.join(path.dirname(filePath), '.cursor-backups');
    await fs.ensureDir(backupDir);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${path.basename(filePath)}.${timestamp}.backup`);
    
    await fs.copy(filePath, backupPath);
  }

  private shouldIncludeHidden(filename: string): boolean {
    const importantHidden = ['.gitignore', '.env.example', '.cursorrules'];
    return importantHidden.includes(filename);
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## 🔒 Security Manager

### **Access Control & Validation**
```typescript
// src/main/services/security.manager.ts
export class SecurityManager {
  private allowedPaths: Set<string> = new Set();
  private blockedPatterns: RegExp[] = [];
  private commandWhitelist: Set<string> = new Set();

  constructor(private configManager: ConfigManager) {
    this.initializeSecurityRules();
  }

  async validateFileAccess(filePath: string, operation: 'read' | 'write' | 'delete'): Promise<void> {
    const resolvedPath = path.resolve(filePath);
    
    // Check if path is within allowed directories
    if (!this.isPathAllowed(resolvedPath)) {
      throw new SecurityError(`Access denied to path: ${filePath}`);
    }

    // Check for blocked patterns
    for (const pattern of this.blockedPatterns) {
      if (pattern.test(resolvedPath)) {
        throw new SecurityError(`Path matches blocked pattern: ${filePath}`);
      }
    }

    // Check file permissions
    try {
      const mode = operation === 'read' ? fs.constants.R_OK : fs.constants.W_OK;
      await fs.access(resolvedPath, mode);
    } catch (error) {
      throw new SecurityError(`Insufficient permissions for ${operation} on ${filePath}`);
    }

    // Additional checks for sensitive operations
    if (operation === 'delete' && this.isCriticalFile(resolvedPath)) {
      throw new SecurityError(`Cannot delete critical file: ${filePath}`);
    }
  }

  async validateCommand(command: string): Promise<CommandValidationResult> {
    const parts = command.trim().split(/\s+/);
    const baseCommand = parts[0];

    // Check whitelist if enabled
    if (this.commandWhitelist.size > 0 && !this.commandWhitelist.has(baseCommand)) {
      return {
        allowed: false,
        reason: 'Command not in whitelist',
        requiresConfirmation: false
      };
    }

    // Check for dangerous commands
    const dangerousCommands = ['rm', 'del', 'format', 'fdisk', 'dd'];
    if (dangerousCommands.includes(baseCommand)) {
      return {
        allowed: true,
        reason: 'Potentially dangerous command',
        requiresConfirmation: true
      };
    }

    // Check for system modification commands
    const systemCommands = ['sudo', 'su', 'chmod', 'chown', 'passwd'];
    if (systemCommands.includes(baseCommand)) {
      return {
        allowed: true,
        reason: 'System modification command',
        requiresConfirmation: true
      };
    }

    // Check command arguments for dangerous patterns
    const dangerousPatterns = [
      /--force/,
      /--recursive/,
      /-rf\b/,
      />\s*\/dev\//
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(command)) {
        return {
          allowed: true,
          reason: 'Command contains potentially dangerous flags',
          requiresConfirmation: true
        };
      }
    }

    return {
      allowed: true,
      reason: 'Command appears safe',
      requiresConfirmation: false
    };
  }

  sanitizeInput(input: string): string {
    // Remove or escape potentially dangerous characters
    return input
      .replace(/[<>"|&;$`\\]/g, '') // Remove shell special characters
      .replace(/\0/g, '') // Remove null bytes
      .trim();
  }

  encryptSensitiveData(data: string): string {
    const key = this.getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decryptSensitiveData(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const [ivHex, authTagHex, encrypted] = parts;
    const key = this.getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipher('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  private isPathAllowed(filePath: string): boolean {
    // Always allow access to files within allowed project directories
    for (const allowedPath of this.allowedPaths) {
      if (filePath.startsWith(allowedPath)) {
        return true;
      }
    }
    return false;
  }

  private isCriticalFile(filePath: string): boolean {
    const criticalFiles = [
      'package.json',
      'tsconfig.json',
      '.gitignore',
      'README.md'
    ];
    
    const fileName = path.basename(filePath);
    return criticalFiles.includes(fileName);
  }

  private getEncryptionKey(): string {
    // In production, this should come from a secure key management system
    return this.configManager.get('encryption.key') || 'default-key-change-in-production';
  }

  private initializeSecurityRules(): void {
    // Initialize blocked patterns
    this.blockedPatterns = [
      /\/\.ssh\//,
      /\/\.aws\//,
      /\/passwords?/i,
      /\/secrets?/i,
      /\.pem$/,
      /\.key$/,
      /\.p12$/
    ];

    // Initialize command whitelist (empty = allow all)
    const whitelistEnabled = this.configManager.get('security.command_whitelist_enabled', false);
    if (whitelistEnabled) {
      this.commandWhitelist = new Set([
        'ls', 'dir', 'pwd', 'cd',
        'cat', 'type', 'echo',
        'git', 'node', 'npm', 'yarn', 'pnpm',
        'python', 'pip',
        'java', 'javac',
        'gcc', 'g++', 'make',
        'curl', 'wget'
      ]);
    }
  }
}

class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}
```

---

## 🚀 Background Job System

### **Job Queue & Processing**
```typescript
// src/main/services/job.manager.ts
export class JobManager {
  private queue: PQueue;
  private jobs: Map<string, BackgroundJob> = new Map();
  private jobRepository: JobRepository;

  constructor(
    database: Database,
    private eventEmitter: EventEmitter
  ) {
    this.jobRepository = new JobRepository(database);
    this.queue = new PQueue({ 
      concurrency: 3,
      interval: 1000,
      intervalCap: 10
    });
    
    this.setupQueue();
    this.restorePendingJobs();
  }

  async scheduleJob<T>(
    type: JobType,
    payload: T,
    options: JobOptions = {}
  ): Promise<string> {
    const jobId = generateId();
    
    const job: BackgroundJob = {
      id: jobId,
      type,
      status: 'pending',
      priority: options.priority || 0,
      payload: JSON.stringify(payload),
      progress: 0,
      createdAt: new Date()
    };

    // Save to database
    await this.jobRepository.create(job);
    this.jobs.set(jobId, job);

    // Add to queue
    await this.queue.add(
      () => this.executeJob(jobId),
      { priority: job.priority }
    );

    this.emitJobUpdate(jobId, 'scheduled');
    return jobId;
  }

  async getJob(jobId: string): Promise<BackgroundJob | null> {
    return this.jobs.get(jobId) || null;
  }

  async cancelJob(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'pending') {
      return false;
    }

    job.status = 'cancelled';
    await this.jobRepository.update(jobId, { status: 'cancelled' });
    
    this.emitJobUpdate(jobId, 'cancelled');
    return true;
  }

  private async executeJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    try {
      job.status = 'running';
      job.startedAt = new Date();
      await this.jobRepository.update(jobId, { 
        status: 'running',
        started_at: job.startedAt.toISOString()
      });

      this.emitJobUpdate(jobId, 'started');

      const executor = this.getJobExecutor(job.type);
      const result = await executor.execute(
        JSON.parse(job.payload),
        (progress) => this.updateJobProgress(jobId, progress)
      );

      job.status = 'completed';
      job.result = JSON.stringify(result);
      job.progress = 1;
      job.completedAt = new Date();

      await this.jobRepository.update(jobId, {
        status: 'completed',
        result: job.result,
        progress: 1,
        completed_at: job.completedAt.toISOString()
      });

      this.emitJobUpdate(jobId, 'completed', result);
    } catch (error) {
      job.status = 'failed';
      job.error = error.message;
      job.completedAt = new Date();

      await this.jobRepository.update(jobId, {
        status: 'failed',
        error: job.error,
        completed_at: job.completedAt.toISOString()
      });

      this.emitJobUpdate(jobId, 'failed', null, error);
    }
  }

  private async updateJobProgress(jobId: string, progress: number): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.progress = Math.max(0, Math.min(1, progress));
    await this.jobRepository.update(jobId, { progress: job.progress });
    
    this.emitJobUpdate(jobId, 'progress');
  }

  private getJobExecutor(type: JobType): JobExecutor {
    switch (type) {
      case 'index_project':
        return new ProjectIndexingExecutor();
      case 'generate_embeddings':
        return new EmbeddingGenerationExecutor();
      case 'analyze_code':
        return new CodeAnalysisExecutor();
      case 'backup_project':
        return new ProjectBackupExecutor();
      default:
        throw new Error(`Unknown job type: ${type}`);
    }
  }

  private emitJobUpdate(
    jobId: string,
    event: string,
    result?: any,
    error?: Error
  ): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    this.eventEmitter.emit('job:update', {
      jobId,
      event,
      job: { ...job },
      result,
      error: error?.message
    });
  }

  private setupQueue(): void {
    this.queue.on('active', () => {
      console.log('Job started, queue size:', this.queue.size);
    });

    this.queue.on('idle', () => {
      console.log('Queue is idle');
    });
  }

  private async restorePendingJobs(): Promise<void> {
    const pendingJobs = await this.jobRepository.findByStatus('pending');
    
    for (const job of pendingJobs) {
      this.jobs.set(job.id, job);
      await this.queue.add(
        () => this.executeJob(job.id),
        { priority: job.priority }
      );
    }
  }
}

// Job Executors
abstract class JobExecutor<TPayload = any, TResult = any> {
  abstract execute(
    payload: TPayload,
    updateProgress: (progress: number) => void
  ): Promise<TResult>;
}

class ProjectIndexingExecutor extends JobExecutor<{ projectPath: string }, { filesIndexed: number }> {
  async execute(
    payload: { projectPath: string },
    updateProgress: (progress: number) => void
  ): Promise<{ filesIndexed: number }> {
    const files = await this.getAllCodeFiles(payload.projectPath);
    let processed = 0;

    for (const file of files) {
      await this.indexFile(file);
      processed++;
      updateProgress(processed / files.length);
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    return { filesIndexed: processed };
  }

  private async getAllCodeFiles(projectPath: string): Promise<string[]> {
    // Implementation to recursively find all code files
    // This is a simplified version
    const globPattern = path.join(projectPath, '**/*.{js,ts,jsx,tsx,py,java,cpp,c,h}');
    return glob.sync(globPattern, { ignore: ['**/node_modules/**', '**/.git/**'] });
  }

  private async indexFile(filePath: string): Promise<void> {
    // Implementation to analyze and index a single file
    // This would involve code parsing, symbol extraction, etc.
  }
}
```

---

## 📡 WebSocket & Real-time Communication

### **Real-time Event System**
```typescript
// src/main/services/event.manager.ts
export class EventManager {
  private eventBus: EventEmitter = new EventEmitter();
  private subscribers: Map<string, Set<BrowserWindow>> = new Map();

  subscribe(event: string, window: BrowserWindow): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    
    this.subscribers.get(event)!.add(window);
    
    // Clean up when window is closed
    window.on('closed', () => {
      this.unsubscribe(event, window);
    });
  }

  unsubscribe(event: string, window: BrowserWindow): void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.delete(window);
      if (subscribers.size === 0) {
        this.subscribers.delete(event);
      }
    }
  }

  emit(event: string, data: any): void {
    const subscribers = this.subscribers.get(event);
    if (!subscribers) return;

    for (const window of subscribers) {
      if (!window.isDestroyed()) {
        window.webContents.send(event, data);
      }
    }
  }

  // Specialized events for different subsystems
  emitFileChange(change: FileChangeEvent): void {
    this.emit('file:changed', change);
  }

  emitAgentUpdate(update: AgentUpdateEvent): void {
    this.emit('agent:update', update);
  }

  emitJobUpdate(update: JobUpdateEvent): void {
    this.emit('job:update', update);
  }

  emitTerminalOutput(output: TerminalOutputEvent): void {
    this.emit('terminal:output', output);
  }
}
```

---

## 🔧 Configuration Management

### **Config Manager**
```typescript
// src/main/services/config.manager.ts
export class ConfigManager {
  private config: Map<string, any> = new Map();
  private configPath: string;
  private watchers: Map<string, (value: any) => void> = new Map();

  constructor(configPath: string) {
    this.configPath = configPath;
    this.loadConfig();
    this.watchConfigFile();
  }

  get<T>(key: string, defaultValue?: T): T {
    const value = this.config.get(key);
    return value !== undefined ? value : defaultValue;
  }

  set(key: string, value: any): void {
    const oldValue = this.config.get(key);
    this.config.set(key, value);
    
    // Notify watchers
    const watcher = this.watchers.get(key);
    if (watcher && oldValue !== value) {
      watcher(value);
    }
    
    this.saveConfig();
  }

  watch(key: string, callback: (value: any) => void): () => void {
    this.watchers.set(key, callback);
    
    // Return unwatch function
    return () => {
      this.watchers.delete(key);
    };
  }

  has(key: string): boolean {
    return this.config.has(key);
  }

  delete(key: string): boolean {
    const deleted = this.config.delete(key);
    if (deleted) {
      this.saveConfig();
    }
    return deleted;
  }

  getAll(): Record<string, any> {
    return Object.fromEntries(this.config);
  }

  private async loadConfig(): Promise<void> {
    try {
      if (await fs.pathExists(this.configPath)) {
        const configData = await fs.readJson(this.configPath);
        this.config = new Map(Object.entries(configData));
      }
    } catch (error) {
      console.warn('Failed to load config:', error);
      this.setDefaults();
    }
  }

  private async saveConfig(): Promise<void> {
    try {
      const configData = Object.fromEntries(this.config);
      await fs.writeJson(this.configPath, configData, { spaces: 2 });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  private watchConfigFile(): void {
    if (fs.existsSync(this.configPath)) {
      fs.watchFile(this.configPath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
          this.loadConfig();
        }
      });
    }
  }

  private setDefaults(): void {
    const defaults = {
      'editor.theme': 'dark',
      'editor.fontSize': 14,
      'editor.fontFamily': 'JetBrains Mono',
      'ai.provider': 'openai',
      'ai.model': 'gpt-4',
      'security.command_whitelist_enabled': false,
      'backup.enabled': true,
      'backup.retention_days': 30,
      'indexing.auto_index': true,
      'indexing.max_file_size': 1024 * 1024, // 1MB
      'terminal.default_shell': process.platform === 'win32' ? 'powershell' : 'bash'
    };

    for (const [key, value] of Object.entries(defaults)) {
      this.config.set(key, value);
    }
  }
}
```

---

## 📊 Logging & Monitoring

### **Logger System**
```typescript
// src/main/services/logger.ts
export class Logger {
  private loggers: Map<string, winston.Logger> = new Map();
  private logDir: string;

  constructor(logDir: string) {
    this.logDir = logDir;
    this.ensureLogDirectory();
  }

  getLogger(name: string): winston.Logger {
    if (this.loggers.has(name)) {
      return this.loggers.get(name)!;
    }

    const logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: name },
      transports: [
        new winston.transports.File({
          filename: path.join(this.logDir, `${name}-error.log`),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),
        new winston.transports.File({
          filename: path.join(this.logDir, `${name}.log`),
          maxsize: 5242880, // 5MB
          maxFiles: 5
        })
      ]
    });

    // Add console transport in development
    if (process.env.NODE_ENV !== 'production') {
      logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }

    this.loggers.set(name, logger);
    return logger;
  }

  private async ensureLogDirectory(): Promise<void> {
    await fs.ensureDir(this.logDir);
  }
}

// Performance Monitor
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private logger: winston.Logger;

  constructor(logger: Logger) {
    this.logger = logger.getLogger('performance');
  }

  startTimer(name: string): () => number {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return duration;
    };
  }

  recordMetric(name: string, value: number, unit: string = 'ms'): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now()
    };

    const metrics = this.metrics.get(name)!;
    metrics.push(metric);

    // Keep only last 1000 metrics per name
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000);
    }

    // Log if value is above threshold
    if (this.isSlowOperation(name, value)) {
      this.logger.warn('Slow operation detected', { name, value, unit });
    }
  }

  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.get(name) || [];
  }

  getAverageMetric(name: string, timeWindow?: number): number {
    const metrics = this.getMetrics(name);
    
    if (timeWindow) {
      const cutoff = Date.now() - timeWindow;
      const recentMetrics = metrics.filter(m => m.timestamp > cutoff);
      if (recentMetrics.length === 0) return 0;
      
      return recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
    }

    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  private isSlowOperation(name: string, value: number): boolean {
    const thresholds: Record<string, number> = {
      'file:read': 100,
      'file:write': 200,
      'ai:completion': 5000,
      'code:analyze': 1000,
      'search:semantic': 500
    };

    return value > (thresholds[name] || 1000);
  }
}
```

---

هذا النظام الخلفي يوفر أساساً قوياً ومرناً لدعم جميع ميزات Cursor Agents مع التركيز على الأداء والأمان وقابلية التوسع. النظام مصمم ليكون modular وقابل للصيانة مع دعم شامل للمراقبة والتسجيل.