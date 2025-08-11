# نظام أدوات Agent الشامل
# Comprehensive Agent Tools System

## المقدمة والنظرة العامة
### Introduction and Overview

هذا المستند يوضح التصميم والتطوير التفصيلي لنظام أدوات Agent، وهو القلب النابض في تطبيق Cursor Agents. هذه الأدوات تمكن الذكاء الاصطناعي من التفاعل مع الكود والبيئة بطريقة ذكية وفعالة.

## الأدوات الأساسية
### Core Tools Categories

### 1. أدوات البحث (Search Tools)
- **Semantic Search** - البحث الدلالي في الكود
- **Grep Search** - البحث النصي المتقدم
- **Web Search** - البحث في الويب للوثائق والمراجع
- **Symbol Search** - البحث في الرموز والتعريفات

### 2. أدوات التحرير (Edit Tools)  
- **Edit & Reapply** - تحرير وإعادة تطبيق التغييرات
- **Delete File** - حذف الملفات بأمان
- **Apply Changes** - تطبيق التغييرات المقترحة
- **Create File** - إنشاء ملفات جديدة

### 3. أدوات التشغيل (Run Tools)
- **Terminal Integration** - تكامل كامل مع Terminal
- **Command Execution** - تنفيذ الأوامر
- **Script Runner** - تشغيل السكريبت
- **Build Tools** - أدوات البناء والتجميع

### 4. نظام @Symbols
- **File References** - الإشارة للملفات (@file)
- **Library References** - الإشارة للمكتبات (@lib)
- **Image References** - الإشارة للصور (@image)
- **URL References** - الإشارة للروابط (@url)

## التصميم المعماري
### Architectural Design

### 1. Tool Manager Core
```typescript
interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'search' | 'edit' | 'run' | 'symbol';
  parameters: ToolParameter[];
  requiredPermissions: Permission[];
  examples: ToolExample[];
}

interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  default?: any;
  validation?: ValidationRule[];
}

interface ToolResult {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    executionTime: number;
    tokensUsed?: number;
    cacheHit?: boolean;
  };
}

class ToolManager {
  private tools: Map<string, Tool> = new Map();
  private executionQueue: ToolExecutionQueue;
  private permissionManager: PermissionManager;
  private resultCache: ToolResultCache;

  constructor() {
    this.executionQueue = new ToolExecutionQueue();
    this.permissionManager = new PermissionManager();
    this.resultCache = new ToolResultCache();
    this.registerDefaultTools();
  }

  async executeTool(
    toolId: string,
    parameters: Record<string, any>,
    context: ExecutionContext
  ): Promise<ToolResult> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      return {
        success: false,
        error: {
          code: 'TOOL_NOT_FOUND',
          message: `Tool with id "${toolId}" not found`
        }
      };
    }

    // Check permissions
    const hasPermission = await this.permissionManager.checkPermissions(
      tool.definition.requiredPermissions,
      context
    );

    if (!hasPermission) {
      return {
        success: false,
        error: {
          code: 'PERMISSION_DENIED',
          message: 'Insufficient permissions to execute this tool'
        }
      };
    }

    // Validate parameters
    const validation = this.validateParameters(tool.definition.parameters, parameters);
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: 'INVALID_PARAMETERS',
          message: 'Invalid parameters provided',
          details: validation.errors
        }
      };
    }

    // Check cache
    const cacheKey = this.generateCacheKey(toolId, parameters);
    const cachedResult = await this.resultCache.get(cacheKey);
    if (cachedResult && tool.definition.cacheable) {
      return {
        ...cachedResult,
        metadata: {
          ...cachedResult.metadata,
          cacheHit: true
        }
      };
    }

    // Execute tool
    const startTime = Date.now();
    try {
      const result = await this.executionQueue.execute(
        () => tool.execute(parameters, context)
      );

      const finalResult: ToolResult = {
        success: true,
        data: result,
        metadata: {
          executionTime: Date.now() - startTime,
          cacheHit: false
        }
      };

      // Cache result if applicable
      if (tool.definition.cacheable) {
        await this.resultCache.set(cacheKey, finalResult);
      }

      return finalResult;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: error.message,
          details: error
        },
        metadata: {
          executionTime: Date.now() - startTime
        }
      };
    }
  }

  registerTool(tool: Tool) {
    this.tools.set(tool.definition.id, tool);
  }

  getAvailableTools(context: ExecutionContext): ToolDefinition[] {
    return Array.from(this.tools.values())
      .map(tool => tool.definition)
      .filter(definition => 
        this.permissionManager.checkPermissionsSync(
          definition.requiredPermissions,
          context
        )
      );
  }
}
```

## أدوات البحث
### Search Tools

### 1. Semantic Search Tool
```typescript
class SemanticSearchTool implements Tool {
  definition: ToolDefinition = {
    id: 'semantic_search',
    name: 'Semantic Search',
    description: 'Search through code using semantic understanding',
    category: 'search',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'Natural language search query',
        required: true
      },
      {
        name: 'scope',
        type: 'array',
        description: 'File paths or directories to search in',
        required: false,
        default: ['.']
      },
      {
        name: 'language',
        type: 'string',
        description: 'Programming language filter',
        required: false
      },
      {
        name: 'limit',
        type: 'number',
        description: 'Maximum number of results',
        required: false,
        default: 20
      }
    ],
    requiredPermissions: ['read_files'],
    examples: [
      {
        description: 'Find authentication functions',
        parameters: {
          query: 'user authentication login function',
          scope: ['src/'],
          language: 'typescript'
        }
      }
    ]
  };

  private vectorStore: VectorStore;
  private embeddingModel: EmbeddingModel;

  constructor(vectorStore: VectorStore, embeddingModel: EmbeddingModel) {
    this.vectorStore = vectorStore;
    this.embeddingModel = embeddingModel;
  }

  async execute(
    parameters: {
      query: string;
      scope?: string[];
      language?: string;
      limit?: number;
    },
    context: ExecutionContext
  ): Promise<SearchResult[]> {
    const { query, scope = ['.'], language, limit = 20 } = parameters;

    // Generate query embedding
    const queryEmbedding = await this.embeddingModel.embed(query);

    // Search in vector store
    const searchResults = await this.vectorStore.search(queryEmbedding, {
      k: limit * 2, // Get more results for filtering
      filter: {
        scope,
        language
      }
    });

    // Re-rank results using semantic similarity
    const rerankedResults = await this.reranks(query, searchResults);

    // Format results
    return rerankedResults.slice(0, limit).map(result => ({
      filePath: result.metadata.filePath,
      startLine: result.metadata.startLine,
      endLine: result.metadata.endLine,
      content: result.content,
      score: result.score,
      context: result.metadata.context,
      symbols: result.metadata.symbols
    }));
  }

  private async reranks(query: string, results: VectorSearchResult[]): Promise<VectorSearchResult[]> {
    // Use cross-encoder for more accurate ranking
    const pairs = results.map(result => ({
      query,
      passage: result.content
    }));

    const scores = await this.embeddingModel.rerank(pairs);
    
    return results
      .map((result, index) => ({
        ...result,
        score: scores[index]
      }))
      .sort((a, b) => b.score - a.score);
  }
}
```

### 2. Grep Search Tool
```typescript
class GrepSearchTool implements Tool {
  definition: ToolDefinition = {
    id: 'grep_search',
    name: 'Grep Search',
    description: 'Search for text patterns using regex',
    category: 'search',
    parameters: [
      {
        name: 'pattern',
        type: 'string',
        description: 'Regular expression pattern to search for',
        required: true
      },
      {
        name: 'paths',
        type: 'array',
        description: 'Paths to search in',
        required: false,
        default: ['.']
      },
      {
        name: 'flags',
        type: 'string',
        description: 'Regex flags (i, g, m, s)',
        required: false,
        default: 'gi'
      },
      {
        name: 'includeFiles',
        type: 'array',
        description: 'File patterns to include',
        required: false
      },
      {
        name: 'excludeFiles',
        type: 'array',
        description: 'File patterns to exclude',
        required: false,
        default: ['node_modules/**', '.git/**', '*.log']
      },
      {
        name: 'contextLines',
        type: 'number',
        description: 'Number of context lines around matches',
        required: false,
        default: 3
      }
    ],
    requiredPermissions: ['read_files'],
    examples: [
      {
        description: 'Find all TODO comments',
        parameters: {
          pattern: 'TODO:|FIXME:|HACK:',
          paths: ['src/'],
          contextLines: 2
        }
      }
    ]
  };

  async execute(
    parameters: {
      pattern: string;
      paths?: string[];
      flags?: string;
      includeFiles?: string[];
      excludeFiles?: string[];
      contextLines?: number;
    },
    context: ExecutionContext
  ): Promise<GrepResult[]> {
    const {
      pattern,
      paths = ['.'],
      flags = 'gi',
      includeFiles,
      excludeFiles = ['node_modules/**', '.git/**', '*.log'],
      contextLines = 3
    } = parameters;

    const regex = new RegExp(pattern, flags);
    const results: GrepResult[] = [];

    // Get all files to search
    const filesToSearch = await this.getFilesToSearch(paths, includeFiles, excludeFiles);

    // Search in each file
    for (const filePath of filesToSearch) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');
        
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          const line = lines[lineIndex];
          const matches = [...line.matchAll(regex)];
          
          for (const match of matches) {
            const startLine = Math.max(0, lineIndex - contextLines);
            const endLine = Math.min(lines.length - 1, lineIndex + contextLines);
            const contextContent = lines.slice(startLine, endLine + 1).join('\n');
            
            results.push({
              filePath,
              lineNumber: lineIndex + 1,
              columnNumber: match.index! + 1,
              matchText: match[0],
              contextContent,
              fullMatch: match
            });
          }
        }
      } catch (error) {
        // Skip files that cannot be read
        continue;
      }
    }

    return results.sort((a, b) => {
      // Sort by file path first, then by line number
      if (a.filePath !== b.filePath) {
        return a.filePath.localeCompare(b.filePath);
      }
      return a.lineNumber - b.lineNumber;
    });
  }

  private async getFilesToSearch(
    paths: string[],
    includePatterns?: string[],
    excludePatterns?: string[]
  ): Promise<string[]> {
    const allFiles: string[] = [];

    for (const path of paths) {
      const files = await this.globFiles(path, includePatterns, excludePatterns);
      allFiles.push(...files);
    }

    return [...new Set(allFiles)]; // Remove duplicates
  }

  private async globFiles(
    basePath: string,
    includePatterns?: string[],
    excludePatterns?: string[]
  ): Promise<string[]> {
    // Implementation using a glob library like 'fast-glob'
    const { glob } = await import('fast-glob');
    
    const defaultInclude = includePatterns || ['**/*'];
    const defaultExclude = excludePatterns || [];

    return await glob(defaultInclude, {
      cwd: basePath,
      ignore: defaultExclude,
      onlyFiles: true,
      absolute: true
    });
  }
}
```

### 3. Web Search Tool
```typescript
class WebSearchTool implements Tool {
  definition: ToolDefinition = {
    id: 'web_search',
    name: 'Web Search',
    description: 'Search the web for documentation and references',
    category: 'search',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'Search query',
        required: true
      },
      {
        name: 'site',
        type: 'string',
        description: 'Specific site to search (e.g., stackoverflow.com)',
        required: false
      },
      {
        name: 'language',
        type: 'string',
        description: 'Programming language context',
        required: false
      },
      {
        name: 'maxResults',
        type: 'number',
        description: 'Maximum number of results',
        required: false,
        default: 10
      }
    ],
    requiredPermissions: ['web_access'],
    examples: [
      {
        description: 'Search for React hooks documentation',
        parameters: {
          query: 'React useEffect hook',
          site: 'reactjs.org',
          language: 'javascript'
        }
      }
    ]
  };

  private searchEngine: SearchEngine;

  constructor(searchEngine: SearchEngine) {
    this.searchEngine = searchEngine;
  }

  async execute(
    parameters: {
      query: string;
      site?: string;
      language?: string;
      maxResults?: number;
    },
    context: ExecutionContext
  ): Promise<WebSearchResult[]> {
    const { query, site, language, maxResults = 10 } = parameters;

    // Build search query
    let searchQuery = query;
    if (site) {
      searchQuery += ` site:${site}`;
    }
    if (language) {
      searchQuery += ` ${language}`;
    }

    // Perform search
    const results = await this.searchEngine.search(searchQuery, {
      maxResults,
      language: context.language || 'en'
    });

    // Extract and summarize content
    const enrichedResults: WebSearchResult[] = [];
    
    for (const result of results) {
      try {
        const content = await this.extractContent(result.url);
        const summary = await this.generateSummary(content, query);
        
        enrichedResults.push({
          title: result.title,
          url: result.url,
          snippet: result.snippet,
          content: content.substring(0, 5000), // Limit content size
          summary,
          relevanceScore: result.score
        });
      } catch (error) {
        // If content extraction fails, still include the basic result
        enrichedResults.push({
          title: result.title,
          url: result.url,
          snippet: result.snippet,
          relevanceScore: result.score
        });
      }
    }

    return enrichedResults;
  }

  private async extractContent(url: string): Promise<string> {
    // Use a web scraping library like Puppeteer or Cheerio
    const response = await fetch(url);
    const html = await response.text();
    
    // Extract text content (implementation would use a library like Readability.js)
    const textContent = this.htmlToText(html);
    return textContent;
  }

  private async generateSummary(content: string, query: string): Promise<string> {
    if (content.length < 500) return content;

    // Use AI to generate a summary focused on the query
    const prompt = `
Summarize the following content in relation to the query: "${query}"

Content:
${content.substring(0, 2000)}

Provide a concise summary (2-3 sentences) that highlights the most relevant information for the query.
    `;

    return await this.aiManager.generateSummary(prompt);
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion (would use a proper library in production)
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
```

## أدوات التحرير
### Edit Tools

### 1. Edit & Reapply Tool
```typescript
class EditReapplyTool implements Tool {
  definition: ToolDefinition = {
    id: 'edit_reapply',
    name: 'Edit & Reapply',
    description: 'Edit code and reapply changes intelligently',
    category: 'edit',
    parameters: [
      {
        name: 'filePath',
        type: 'string',
        description: 'Path to the file to edit',
        required: true
      },
      {
        name: 'changes',
        type: 'array',
        description: 'Array of changes to apply',
        required: true
      },
      {
        name: 'mode',
        type: 'string',
        description: 'Edit mode: replace, insert, delete, transform',
        required: false,
        default: 'replace'
      },
      {
        name: 'backup',
        type: 'boolean',
        description: 'Create backup before editing',
        required: false,
        default: true
      },
      {
        name: 'validateSyntax',
        type: 'boolean',
        description: 'Validate syntax after changes',
        required: false,
        default: true
      }
    ],
    requiredPermissions: ['write_files'],
    examples: [
      {
        description: 'Replace a function implementation',
        parameters: {
          filePath: 'src/utils.ts',
          changes: [
            {
              startLine: 10,
              endLine: 15,
              newContent: 'export function newImplementation() { return true; }'
            }
          ]
        }
      }
    ]
  };

  private backupManager: BackupManager;
  private syntaxValidator: SyntaxValidator;

  constructor(backupManager: BackupManager, syntaxValidator: SyntaxValidator) {
    this.backupManager = backupManager;
    this.syntaxValidator = syntaxValidator;
  }

  async execute(
    parameters: {
      filePath: string;
      changes: EditChange[];
      mode?: EditMode;
      backup?: boolean;
      validateSyntax?: boolean;
    },
    context: ExecutionContext
  ): Promise<EditResult> {
    const {
      filePath,
      changes,
      mode = 'replace',
      backup = true,
      validateSyntax = true
    } = parameters;

    // Validate file exists and is readable
    if (!await fs.pathExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Create backup if requested
    let backupPath: string | undefined;
    if (backup) {
      backupPath = await this.backupManager.createBackup(filePath);
    }

    try {
      // Read current content
      const originalContent = await fs.readFile(filePath, 'utf-8');
      const lines = originalContent.split('\n');

      // Apply changes
      const modifiedLines = await this.applyChanges(lines, changes, mode);
      const newContent = modifiedLines.join('\n');

      // Validate syntax if requested
      if (validateSyntax) {
        const validation = await this.syntaxValidator.validate(newContent, filePath);
        if (!validation.valid) {
          throw new Error(`Syntax errors after changes: ${validation.errors.join(', ')}`);
        }
      }

      // Write new content
      await fs.writeFile(filePath, newContent, 'utf-8');

      // Generate diff
      const diff = this.generateDiff(originalContent, newContent);

      return {
        success: true,
        filePath,
        backupPath,
        changesApplied: changes.length,
        diff,
        newContent: newContent.length <= 10000 ? newContent : undefined // Include content only for small files
      };
    } catch (error) {
      // Restore backup if something went wrong
      if (backupPath) {
        await this.backupManager.restoreBackup(backupPath, filePath);
      }
      throw error;
    }
  }

  private async applyChanges(
    lines: string[],
    changes: EditChange[],
    mode: EditMode
  ): Promise<string[]> {
    // Sort changes by line number (descending) to avoid line number shifts
    const sortedChanges = [...changes].sort((a, b) => b.startLine - a.startLine);

    let modifiedLines = [...lines];

    for (const change of sortedChanges) {
      switch (mode) {
        case 'replace':
          modifiedLines = this.applyReplaceChange(modifiedLines, change);
          break;
        case 'insert':
          modifiedLines = this.applyInsertChange(modifiedLines, change);
          break;
        case 'delete':
          modifiedLines = this.applyDeleteChange(modifiedLines, change);
          break;
        case 'transform':
          modifiedLines = await this.applyTransformChange(modifiedLines, change);
          break;
      }
    }

    return modifiedLines;
  }

  private applyReplaceChange(lines: string[], change: EditChange): string[] {
    const { startLine, endLine, newContent } = change;
    const newLines = newContent.split('\n');
    
    // Replace lines from startLine to endLine with newContent
    const before = lines.slice(0, startLine - 1);
    const after = lines.slice(endLine);
    
    return [...before, ...newLines, ...after];
  }

  private async applyTransformChange(lines: string[], change: EditChange): Promise<string[]> {
    const { startLine, endLine, transformation } = change;
    const originalContent = lines.slice(startLine - 1, endLine).join('\n');
    
    // Apply AI transformation
    const transformedContent = await this.aiManager.transformCode(
      originalContent,
      transformation!
    );
    
    const transformedLines = transformedContent.split('\n');
    const before = lines.slice(0, startLine - 1);
    const after = lines.slice(endLine);
    
    return [...before, ...transformedLines, ...after];
  }

  private generateDiff(original: string, modified: string): string {
    // Use a diff library like 'diff' to generate unified diff
    const { createPatch } = require('diff');
    return createPatch('file', original, modified, '', '');
  }
}
```

### 2. File Operations Tool
```typescript
class FileOperationsTool implements Tool {
  definition: ToolDefinition = {
    id: 'file_operations',
    name: 'File Operations',
    description: 'Create, delete, move, and copy files',
    category: 'edit',
    parameters: [
      {
        name: 'operation',
        type: 'string',
        description: 'Operation type: create, delete, move, copy',
        required: true
      },
      {
        name: 'sourcePath',
        type: 'string',
        description: 'Source file path',
        required: true
      },
      {
        name: 'targetPath',
        type: 'string',
        description: 'Target file path (for move/copy)',
        required: false
      },
      {
        name: 'content',
        type: 'string',
        description: 'File content (for create operation)',
        required: false
      },
      {
        name: 'overwrite',
        type: 'boolean',
        description: 'Overwrite existing files',
        required: false,
        default: false
      }
    ],
    requiredPermissions: ['write_files', 'delete_files'],
    examples: [
      {
        description: 'Create a new TypeScript component',
        parameters: {
          operation: 'create',
          sourcePath: 'src/components/NewComponent.tsx',
          content: 'import React from "react";\n\nexport const NewComponent = () => {\n  return <div>New Component</div>;\n};'
        }
      }
    ]
  };

  async execute(
    parameters: {
      operation: 'create' | 'delete' | 'move' | 'copy';
      sourcePath: string;
      targetPath?: string;
      content?: string;
      overwrite?: boolean;
    },
    context: ExecutionContext
  ): Promise<FileOperationResult> {
    const { operation, sourcePath, targetPath, content, overwrite = false } = parameters;

    switch (operation) {
      case 'create':
        return await this.createFile(sourcePath, content || '', overwrite);
      
      case 'delete':
        return await this.deleteFile(sourcePath);
      
      case 'move':
        if (!targetPath) throw new Error('targetPath is required for move operation');
        return await this.moveFile(sourcePath, targetPath, overwrite);
      
      case 'copy':
        if (!targetPath) throw new Error('targetPath is required for copy operation');
        return await this.copyFile(sourcePath, targetPath, overwrite);
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async createFile(filePath: string, content: string, overwrite: boolean): Promise<FileOperationResult> {
    if (await fs.pathExists(filePath) && !overwrite) {
      throw new Error(`File already exists: ${filePath}`);
    }

    // Ensure directory exists
    await fs.ensureDir(path.dirname(filePath));

    // Write file
    await fs.writeFile(filePath, content, 'utf-8');

    return {
      success: true,
      operation: 'create',
      sourcePath: filePath,
      message: `File created: ${filePath}`
    };
  }

  private async deleteFile(filePath: string): Promise<FileOperationResult> {
    if (!await fs.pathExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Create backup before deletion
    const backupPath = await this.backupManager.createBackup(filePath);

    // Delete file
    await fs.remove(filePath);

    return {
      success: true,
      operation: 'delete',
      sourcePath: filePath,
      backupPath,
      message: `File deleted: ${filePath}`
    };
  }

  private async moveFile(sourcePath: string, targetPath: string, overwrite: boolean): Promise<FileOperationResult> {
    if (!await fs.pathExists(sourcePath)) {
      throw new Error(`Source file not found: ${sourcePath}`);
    }

    if (await fs.pathExists(targetPath) && !overwrite) {
      throw new Error(`Target file already exists: ${targetPath}`);
    }

    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetPath));

    // Move file
    await fs.move(sourcePath, targetPath, { overwrite });

    return {
      success: true,
      operation: 'move',
      sourcePath,
      targetPath,
      message: `File moved from ${sourcePath} to ${targetPath}`
    };
  }

  private async copyFile(sourcePath: string, targetPath: string, overwrite: boolean): Promise<FileOperationResult> {
    if (!await fs.pathExists(sourcePath)) {
      throw new Error(`Source file not found: ${sourcePath}`);
    }

    if (await fs.pathExists(targetPath) && !overwrite) {
      throw new Error(`Target file already exists: ${targetPath}`);
    }

    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetPath));

    // Copy file
    await fs.copy(sourcePath, targetPath, { overwrite });

    return {
      success: true,
      operation: 'copy',
      sourcePath,
      targetPath,
      message: `File copied from ${sourcePath} to ${targetPath}`
    };
  }
}
```

## أدوات التشغيل
### Run Tools

### 1. Terminal Integration Tool
```typescript
class TerminalTool implements Tool {
  definition: ToolDefinition = {
    id: 'terminal',
    name: 'Terminal',
    description: 'Execute commands in terminal',
    category: 'run',
    parameters: [
      {
        name: 'command',
        type: 'string',
        description: 'Command to execute',
        required: true
      },
      {
        name: 'workingDirectory',
        type: 'string',
        description: 'Working directory for command execution',
        required: false
      },
      {
        name: 'timeout',
        type: 'number',
        description: 'Command timeout in seconds',
        required: false,
        default: 30
      },
      {
        name: 'shell',
        type: 'string',
        description: 'Shell to use (bash, zsh, cmd, powershell)',
        required: false
      },
      {
        name: 'environment',
        type: 'object',
        description: 'Environment variables',
        required: false
      }
    ],
    requiredPermissions: ['execute_commands'],
    examples: [
      {
        description: 'Install npm dependencies',
        parameters: {
          command: 'npm install',
          workingDirectory: './my-project',
          timeout: 120
        }
      }
    ]
  };

  private terminalSessions: Map<string, TerminalSession> = new Map();

  async execute(
    parameters: {
      command: string;
      workingDirectory?: string;
      timeout?: number;
      shell?: string;
      environment?: Record<string, string>;
    },
    context: ExecutionContext
  ): Promise<TerminalResult> {
    const {
      command,
      workingDirectory = process.cwd(),
      timeout = 30,
      shell,
      environment = {}
    } = parameters;

    // Validate command safety
    await this.validateCommandSafety(command);

    // Get or create terminal session
    const sessionId = this.getSessionId(workingDirectory, shell);
    let session = this.terminalSessions.get(sessionId);
    
    if (!session) {
      session = await this.createTerminalSession({
        workingDirectory,
        shell,
        environment: { ...process.env, ...environment }
      });
      this.terminalSessions.set(sessionId, session);
    }

    // Execute command
    const result = await this.executeCommand(session, command, timeout);

    return {
      success: result.exitCode === 0,
      command,
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
      executionTime: result.executionTime,
      workingDirectory: session.workingDirectory,
      sessionId
    };
  }

  private async validateCommandSafety(command: string): Promise<void> {
    // List of dangerous commands to block
    const dangerousCommands = [
      /rm\s+-rf\s+\//, // rm -rf /
      /format\s+c:/, // format c:
      /del\s+\/s\s+\/q/, // del /s /q
      /shutdown/, // shutdown commands
      /reboot/, // reboot commands
      /mkfs/, // filesystem formatting
      /dd\s+if=.*of=\/dev/, // disk operations
    ];

    for (const pattern of dangerousCommands) {
      if (pattern.test(command.toLowerCase())) {
        throw new Error(`Command blocked for safety: ${command}`);
      }
    }

    // Additional validation for file system operations
    if (command.includes('..') && (command.includes('rm') || command.includes('del'))) {
      throw new Error('Directory traversal in destructive command blocked');
    }
  }

  private async createTerminalSession(config: {
    workingDirectory: string;
    shell?: string;
    environment: Record<string, string>;
  }): Promise<TerminalSession> {
    const { spawn } = require('child_process');
    
    const shell = config.shell || (process.platform === 'win32' ? 'cmd' : 'bash');
    const shellArgs = process.platform === 'win32' ? ['/c'] : ['-c'];

    return {
      id: `session_${Date.now()}`,
      workingDirectory: config.workingDirectory,
      shell,
      environment: config.environment,
      isActive: true,
      createdAt: new Date()
    };
  }

  private async executeCommand(
    session: TerminalSession,
    command: string,
    timeout: number
  ): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';

      const childProcess = spawn(session.shell, ['-c', command], {
        cwd: session.workingDirectory,
        env: session.environment,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Set timeout
      const timeoutHandle = setTimeout(() => {
        childProcess.kill('SIGTERM');
        reject(new Error(`Command timed out after ${timeout} seconds`));
      }, timeout * 1000);

      // Collect output
      childProcess.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      childProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      // Handle completion
      childProcess.on('close', (exitCode) => {
        clearTimeout(timeoutHandle);
        resolve({
          exitCode: exitCode || 0,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          executionTime: Date.now() - startTime
        });
      });

      childProcess.on('error', (error) => {
        clearTimeout(timeoutHandle);
        reject(error);
      });
    });
  }

  private getSessionId(workingDirectory: string, shell?: string): string {
    return `${workingDirectory}_${shell || 'default'}`;
  }

  // Clean up inactive sessions
  cleanupSessions(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes

    for (const [sessionId, session] of this.terminalSessions) {
      if (now - session.createdAt.getTime() > maxAge) {
        this.terminalSessions.delete(sessionId);
      }
    }
  }
}
```

### 2. Script Runner Tool
```typescript
class ScriptRunnerTool implements Tool {
  definition: ToolDefinition = {
    id: 'script_runner',
    name: 'Script Runner',
    description: 'Run scripts and build commands',
    category: 'run',
    parameters: [
      {
        name: 'scriptType',
        type: 'string',
        description: 'Type of script: npm, yarn, python, node, shell',
        required: true
      },
      {
        name: 'script',
        type: 'string',
        description: 'Script name or content to run',
        required: true
      },
      {
        name: 'args',
        type: 'array',
        description: 'Arguments to pass to the script',
        required: false
      },
      {
        name: 'workingDirectory',
        type: 'string',
        description: 'Working directory',
        required: false
      }
    ],
    requiredPermissions: ['execute_commands'],
    examples: [
      {
        description: 'Run npm build script',
        parameters: {
          scriptType: 'npm',
          script: 'build',
          workingDirectory: './my-project'
        }
      }
    ]
  };

  async execute(
    parameters: {
      scriptType: 'npm' | 'yarn' | 'python' | 'node' | 'shell';
      script: string;
      args?: string[];
      workingDirectory?: string;
    },
    context: ExecutionContext
  ): Promise<ScriptResult> {
    const { scriptType, script, args = [], workingDirectory = process.cwd() } = parameters;

    const command = this.buildCommand(scriptType, script, args);
    
    // Use terminal tool to execute
    const terminalTool = new TerminalTool();
    const result = await terminalTool.execute({
      command,
      workingDirectory,
      timeout: 300 // 5 minutes default timeout for scripts
    }, context);

    return {
      ...result,
      scriptType,
      script,
      args
    };
  }

  private buildCommand(
    scriptType: string,
    script: string,
    args: string[]
  ): string {
    const quotedArgs = args.map(arg => `"${arg}"`).join(' ');

    switch (scriptType) {
      case 'npm':
        return `npm run ${script} ${quotedArgs}`.trim();
      
      case 'yarn':
        return `yarn ${script} ${quotedArgs}`.trim();
      
      case 'python':
        return `python ${script} ${quotedArgs}`.trim();
      
      case 'node':
        return `node ${script} ${quotedArgs}`.trim();
      
      case 'shell':
        return `${script} ${quotedArgs}`.trim();
      
      default:
        throw new Error(`Unknown script type: ${scriptType}`);
    }
  }
}
```

## نظام @Symbols
### @Symbols System

### 1. Symbol Reference Manager
```typescript
interface SymbolReference {
  type: 'file' | 'library' | 'image' | 'url' | 'function' | 'class' | 'variable';
  name: string;
  path?: string;
  description?: string;
  metadata?: Record<string, any>;
}

class SymbolReferenceManager {
  private symbols: Map<string, SymbolReference> = new Map();
  private symbolPattern = /@(\w+)(?::([^@\s]+))?/g;

  // Register built-in symbols
  constructor() {
    this.registerBuiltInSymbols();
  }

  private registerBuiltInSymbols() {
    // File system symbols
    this.registerSymbol({
      type: 'file',
      name: 'file',
      description: 'Reference to a file in the project'
    });

    // Library symbols  
    this.registerSymbol({
      type: 'library',
      name: 'lib',
      description: 'Reference to an external library or dependency'
    });

    // Image symbols
    this.registerSymbol({
      type: 'image', 
      name: 'image',
      description: 'Reference to an image file'
    });

    // URL symbols
    this.registerSymbol({
      type: 'url',
      name: 'url',
      description: 'Reference to a web URL'
    });
  }

  registerSymbol(symbol: SymbolReference) {
    this.symbols.set(symbol.name, symbol);
  }

  parseSymbols(text: string): ParsedSymbol[] {
    const matches: ParsedSymbol[] = [];
    let match;

    this.symbolPattern.lastIndex = 0; // Reset regex
    
    while ((match = this.symbolPattern.exec(text)) !== null) {
      const symbolName = match[1];
      const symbolPath = match[2];
      const symbolDef = this.symbols.get(symbolName);

      if (symbolDef) {
        matches.push({
          full: match[0],
          type: symbolDef.type,
          name: symbolName,
          path: symbolPath,
          start: match.index,
          end: match.index + match[0].length,
          definition: symbolDef
        });
      }
    }

    return matches;
  }

  async resolveSymbol(parsedSymbol: ParsedSymbol): Promise<ResolvedSymbol> {
    switch (parsedSymbol.type) {
      case 'file':
        return await this.resolveFileSymbol(parsedSymbol);
      
      case 'library':
        return await this.resolveLibrarySymbol(parsedSymbol);
      
      case 'image':
        return await this.resolveImageSymbol(parsedSymbol);
      
      case 'url':
        return await this.resolveUrlSymbol(parsedSymbol);
      
      default:
        throw new Error(`Unknown symbol type: ${parsedSymbol.type}`);
    }
  }

  private async resolveFileSymbol(symbol: ParsedSymbol): Promise<ResolvedSymbol> {
    if (!symbol.path) {
      throw new Error('File symbol requires a path');
    }

    const filePath = path.resolve(symbol.path);
    
    if (!await fs.pathExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const stats = await fs.stat(filePath);
    const content = stats.size < 100 * 1024 ? await fs.readFile(filePath, 'utf-8') : null;

    return {
      ...symbol,
      resolvedPath: filePath,
      exists: true,
      metadata: {
        size: stats.size,
        modified: stats.mtime,
        isDirectory: stats.isDirectory(),
        extension: path.extname(filePath)
      },
      content: content || undefined
    };
  }

  private async resolveLibrarySymbol(symbol: ParsedSymbol): Promise<ResolvedSymbol> {
    if (!symbol.path) {
      throw new Error('Library symbol requires a library name');
    }

    // Check if it's a known npm package
    const packageInfo = await this.getPackageInfo(symbol.path);

    return {
      ...symbol,
      resolvedPath: symbol.path,
      exists: !!packageInfo,
      metadata: packageInfo ? {
        version: packageInfo.version,
        description: packageInfo.description,
        homepage: packageInfo.homepage,
        repository: packageInfo.repository
      } : undefined
    };
  }

  private async resolveImageSymbol(symbol: ParsedSymbol): Promise<ResolvedSymbol> {
    if (!symbol.path) {
      throw new Error('Image symbol requires a path');
    }

    const imagePath = path.resolve(symbol.path);
    
    if (!await fs.pathExists(imagePath)) {
      throw new Error(`Image not found: ${imagePath}`);
    }

    const stats = await fs.stat(imagePath);
    const dimensions = await this.getImageDimensions(imagePath);

    return {
      ...symbol,
      resolvedPath: imagePath,
      exists: true,
      metadata: {
        size: stats.size,
        modified: stats.mtime,
        dimensions,
        format: path.extname(imagePath).toLowerCase()
      }
    };
  }

  private async resolveUrlSymbol(symbol: ParsedSymbol): Promise<ResolvedSymbol> {
    if (!symbol.path) {
      throw new Error('URL symbol requires a URL');
    }

    try {
      const response = await fetch(symbol.path, { method: 'HEAD' });
      
      return {
        ...symbol,
        resolvedPath: symbol.path,
        exists: response.ok,
        metadata: {
          status: response.status,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length')
        }
      };
    } catch (error) {
      return {
        ...symbol,
        resolvedPath: symbol.path,
        exists: false,
        metadata: {
          error: error.message
        }
      };
    }
  }

  private async getPackageInfo(packageName: string): Promise<any> {
    try {
      // Check local package.json first
      const packageJsonPath = path.resolve('package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        const dependencies = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        };
        
        if (dependencies[packageName]) {
          return {
            name: packageName,
            version: dependencies[packageName],
            description: `Local dependency: ${packageName}`
          };
        }
      }

      // Fetch from npm registry
      const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Package not found or error occurred
    }

    return null;
  }

  private async getImageDimensions(imagePath: string): Promise<{ width: number; height: number } | null> {
    try {
      // Use image-size library or similar
      const sizeOf = require('image-size');
      const dimensions = sizeOf(imagePath);
      return {
        width: dimensions.width,
        height: dimensions.height
      };
    } catch (error) {
      return null;
    }
  }
}
```

### 2. Symbol Integration in Tools
```typescript
class SymbolAwareTool {
  protected symbolManager: SymbolReferenceManager;

  constructor(symbolManager: SymbolReferenceManager) {
    this.symbolManager = symbolManager;
  }

  protected async processSymbols(text: string): Promise<{
    processedText: string;
    resolvedSymbols: ResolvedSymbol[];
  }> {
    const symbols = this.symbolManager.parseSymbols(text);
    const resolvedSymbols: ResolvedSymbol[] = [];
    let processedText = text;

    // Resolve symbols in reverse order to maintain string positions
    for (let i = symbols.length - 1; i >= 0; i--) {
      const symbol = symbols[i];
      
      try {
        const resolved = await this.symbolManager.resolveSymbol(symbol);
        resolvedSymbols.unshift(resolved);

        // Replace symbol with resolved content or path
        const replacement = this.getSymbolReplacement(resolved);
        processedText = processedText.substring(0, symbol.start) +
                      replacement +
                      processedText.substring(symbol.end);
      } catch (error) {
        // Keep original symbol if resolution fails
        resolvedSymbols.unshift({
          ...symbol,
          exists: false,
          metadata: { error: error.message }
        });
      }
    }

    return { processedText, resolvedSymbols };
  }

  private getSymbolReplacement(resolved: ResolvedSymbol): string {
    switch (resolved.type) {
      case 'file':
        return resolved.content ? `\n\`\`\`\n${resolved.content}\n\`\`\`\n` : `[File: ${resolved.resolvedPath}]`;
      
      case 'library':
        return `[Library: ${resolved.path}${resolved.metadata?.version ? ` v${resolved.metadata.version}` : ''}]`;
      
      case 'image':
        return `[Image: ${resolved.resolvedPath}${resolved.metadata?.dimensions ? ` (${resolved.metadata.dimensions.width}x${resolved.metadata.dimensions.height})` : ''}]`;
      
      case 'url':
        return `[URL: ${resolved.path}${resolved.exists ? ' (accessible)' : ' (not accessible)'}]`;
      
      default:
        return resolved.full;
    }
  }
}

// Example usage in AI prompts
class AIPromptBuilder extends SymbolAwareTool {
  async buildPromptWithSymbols(template: string, context: any): Promise<string> {
    const { processedText, resolvedSymbols } = await this.processSymbols(template);
    
    // Add symbol metadata to context
    const symbolContext = resolvedSymbols.map(symbol => ({
      type: symbol.type,
      name: symbol.name,
      path: symbol.path,
      exists: symbol.exists,
      metadata: symbol.metadata
    }));

    return `${processedText}\n\nReferenced symbols:\n${JSON.stringify(symbolContext, null, 2)}`;
  }
}
```

## تكامل النظام والأداء
### System Integration and Performance

### 1. Tool Execution Pipeline
```typescript
class ToolExecutionPipeline {
  private middleware: ToolMiddleware[] = [];
  private cache: ToolResultCache;
  private analytics: ToolAnalytics;

  constructor() {
    this.cache = new ToolResultCache();
    this.analytics = new ToolAnalytics();
    this.setupDefaultMiddleware();
  }

  private setupDefaultMiddleware() {
    // Logging middleware
    this.middleware.push(new LoggingMiddleware());
    
    // Performance monitoring
    this.middleware.push(new PerformanceMiddleware());
    
    // Security validation
    this.middleware.push(new SecurityMiddleware());
    
    // Rate limiting
    this.middleware.push(new RateLimitingMiddleware());
    
    // Symbol processing
    this.middleware.push(new SymbolProcessingMiddleware());
  }

  async executeToolChain(
    tools: ToolExecution[],
    context: ExecutionContext
  ): Promise<ToolChainResult> {
    const results: ToolResult[] = [];
    const executionId = `exec_${Date.now()}`;

    try {
      for (const toolExecution of tools) {
        // Process through middleware pipeline
        const processedExecution = await this.processMiddleware(
          toolExecution,
          context,
          'before'
        );

        // Execute tool
        const result = await this.executeToolWithMiddleware(
          processedExecution,
          context
        );

        // Process result through middleware
        const processedResult = await this.processMiddleware(
          result,
          context,
          'after'
        );

        results.push(processedResult);

        // Stop execution if tool failed and is critical
        if (!result.success && toolExecution.critical) {
          break;
        }
      }

      return {
        success: results.every(r => r.success || !r.critical),
        executionId,
        results,
        totalExecutionTime: results.reduce((sum, r) => sum + (r.metadata?.executionTime || 0), 0)
      };
    } catch (error) {
      return {
        success: false,
        executionId,
        results,
        error: error.message
      };
    }
  }

  private async processMiddleware(
    input: any,
    context: ExecutionContext,
    phase: 'before' | 'after'
  ): Promise<any> {
    let processed = input;

    for (const middleware of this.middleware) {
      if (phase === 'before' && middleware.beforeExecution) {
        processed = await middleware.beforeExecution(processed, context);
      } else if (phase === 'after' && middleware.afterExecution) {
        processed = await middleware.afterExecution(processed, context);
      }
    }

    return processed;
  }
}
```

### 2. Performance Optimization
```typescript
class ToolPerformanceOptimizer {
  private executionMetrics: Map<string, ToolMetrics> = new Map();
  private cacheStrategy: CacheStrategy;

  constructor() {
    this.cacheStrategy = new AdaptiveCacheStrategy();
  }

  async optimizeExecution(
    tools: ToolExecution[],
    context: ExecutionContext
  ): Promise<ToolExecution[]> {
    // Analyze tool dependencies
    const dependencyGraph = this.analyzeDependencies(tools);
    
    // Optimize execution order
    const optimizedOrder = this.optimizeExecutionOrder(dependencyGraph);
    
    // Identify parallelizable tools
    const parallelGroups = this.identifyParallelGroups(optimizedOrder);
    
    // Apply caching strategies
    const cachedOptimizations = await this.applyCachingStrategies(parallelGroups);

    return cachedOptimizations;
  }

  private analyzeDependencies(tools: ToolExecution[]): DependencyGraph {
    const graph = new DependencyGraph();

    for (const tool of tools) {
      graph.addNode(tool.id, tool);

      // Analyze parameter dependencies
      for (const param of Object.values(tool.parameters)) {
        if (typeof param === 'string' && param.startsWith('$output:')) {
          const dependencyId = param.replace('$output:', '');
          graph.addEdge(dependencyId, tool.id);
        }
      }
    }

    return graph;
  }

  private identifyParallelGroups(tools: ToolExecution[]): ParallelGroup[] {
    const groups: ParallelGroup[] = [];
    const processed = new Set<string>();

    for (const tool of tools) {
      if (processed.has(tool.id)) continue;

      const group = this.findParallelizableTools(tool, tools, processed);
      groups.push(group);
      
      group.tools.forEach(t => processed.add(t.id));
    }

    return groups;
  }

  private async applyCachingStrategies(
    groups: ParallelGroup[]
  ): Promise<ToolExecution[]> {
    const optimized: ToolExecution[] = [];

    for (const group of groups) {
      const cachedTools = await Promise.all(
        group.tools.map(tool => this.applyCaching(tool))
      );
      optimized.push(...cachedTools);
    }

    return optimized;
  }

  private async applyCaching(tool: ToolExecution): Promise<ToolExecution> {
    const cacheKey = this.generateCacheKey(tool);
    const cacheConfig = this.cacheStrategy.getCacheConfig(tool);

    return {
      ...tool,
      cacheKey,
      cacheConfig
    };
  }
}
```

## الخلاصة والخطوات التالية
### Summary and Next Steps

تم تصميم نظام أدوات Agent بشكل شامل ومتقدم يشمل:

### الأدوات المكتملة:
1. **أدوات البحث المتقدمة**:
   - Semantic Search مع Vector Store
   - Grep Search مع تصفية ذكية  
   - Web Search مع استخراج المحتوى
   - Symbol Search للرموز والتعريفات

2. **أدوات التحرير القوية**:
   - Edit & Reapply مع النسخ الاحتياطية
   - File Operations (إنشاء، حذف، نقل، نسخ)
   - Apply Changes مع التحقق من الصيغة
   - تكامل الـ Diff والمعاينة

3. **أدوات التشغيل المتكاملة**:
   - Terminal Integration مع جلسات متعددة
   - Script Runner لجميع أنواع السكريبت
   - Command Execution مع الحماية الأمنية
   - Build Tools وادارة البيئات

4. **نظام @Symbols المتطور**:
   - مراجع الملفات (@file:path)
   - مراجع المكتبات (@lib:package)
   - مراجع الصور (@image:path)
   - مراجع الروابط (@url:link)

### الميزات التقنية المتقدمة:
- **Tool Manager** شامل مع pipeline execution
- **إدارة الصلاحيات** والأمان
- **نظام التخزين المؤقت** الذكي
- **تحليل الأداء** والتحسين
- **معالجة الأخطاء** المتقدمة
- **Middleware System** قابل للتوسع

### الخطوة التالية:
المكون التالي هو **تكامل Terminal وتنفيذ الأوامر** والذي سيتضمن:
- واجهة Terminal متقدمة مع عدة تبويبات
- تكامل مع أدوات التطوير (Git, npm, docker)
- مراقبة العمليات وإدارة الجلسات
- تكامل مع AI لتوليد الأوامر واستكشاف الأخطاء

هذا النظام يوفر مجموعة أدوات شاملة وقوية تمكن الذكاء الاصطناعي من التفاعل بفعالية مع البيئة التطويرية والكود.