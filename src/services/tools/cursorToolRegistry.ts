// Comprehensive Cursor Tools Implementation
// Based on cursor.com/agents analysis

// Tool types and interfaces
export interface ToolResult {
  type: string;
  content: string;
  metadata?: Record<string, any>;
  success?: boolean;
  error?: string;
}

export interface ToolRequest {
  type: string;
  query: string;
  context?: Record<string, any>;
  params?: Record<string, any>;
}

export interface Tool {
  name: string;
  description: string;
  icon: string;
  category: 'search' | 'edit' | 'run' | 'mcp' | 'advanced';
  enabled: boolean;
  execute(request: ToolRequest): Promise<ToolResult>;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  type: 'file' | 'directory';
  lastModified: Date;
  content?: string;
}

export interface EditOperation {
  type: 'replace' | 'insert' | 'delete';
  startLine: number;
  endLine?: number;
  content?: string;
}

export interface TerminalCommand {
  command: string;
  workingDirectory?: string;
  environment?: Record<string, string>;
}

export interface ParsedMessage {
  originalText: string;
  cleanText: string;
  tools: {
    type: string;
    query: string;
    position: number;
  }[];
}

// Parse @ mentions from message text
export function parseToolMentions(text: string): ParsedMessage {
  const toolPattern = /@(read|list|codebase|grep|search|web|rules|edit|delete|terminal|mcp|apply|run|guard|fix)\s+([^@\n]+?)(?=\s@|$)/gi;
  const tools: ParsedMessage['tools'] = [];
  let cleanText = text;
  let match;

  while ((match = toolPattern.exec(text)) !== null) {
    tools.push({
      type: match[1].toLowerCase(),
      query: match[2].trim(),
      position: match.index,
    });
  }

  // Remove tool mentions from clean text
  cleanText = text.replace(toolPattern, '').replace(/\s+/g, ' ').trim();

  return {
    originalText: text,
    cleanText,
    tools,
  };
}

// Base tool class
export abstract class BaseTool implements Tool {
  abstract name: string;
  abstract description: string;
  abstract icon: string;
  abstract category: 'search' | 'edit' | 'run' | 'mcp' | 'advanced';
  enabled: boolean = true;
  
  abstract execute(request: ToolRequest): Promise<ToolResult>;

  protected createResult(content: string, metadata?: Record<string, any>, success: boolean = true): ToolResult {
    return {
      type: this.name,
      content,
      metadata,
      success,
    };
  }

  protected createError(error: string, metadata?: Record<string, any>): ToolResult {
    return {
      type: this.name,
      content: `Error: ${error}`,
      metadata,
      success: false,
      error,
    };
  }
}

// ==================== SEARCH TOOLS ====================

// Read File Tool
export class ReadFileTool extends BaseTool {
  name = 'read';
  description = 'Read contents of a specific file';
  icon = '📄';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const filePath = params?.path || query;
    
    try {
      // Simulate file reading
      const fileContent = await this.readFile(filePath);
      
      return this.createResult(fileContent, {
        filePath,
        lines: fileContent.split('\n').length,
        size: fileContent.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return this.createError(`Failed to read file: ${(error as Error).message}`);
    }
  }

  private async readFile(path: string): Promise<string> {
    // Simulate file reading
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (path.endsWith('.tsx') || path.endsWith('.ts')) {
      return `// ${path}
import React, { useState, useEffect } from 'react';
import { useProvider } from '@/contexts/ProviderContext';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  const [state, setState] = useState<string>('initial');
  const { currentProvider } = useProvider();

  useEffect(() => {
    // Component initialization
    console.log('Component mounted:', title);
  }, [title]);

  const handleClick = () => {
    setState('clicked');
    onAction?.();
  };

  return (
    <div className="component-container">
      <h2>{title}</h2>
      <p>Provider: {currentProvider?.name}</p>
      <button onClick={handleClick}>
        Action
      </button>
    </div>
  );
};

export default Component;`;
    }
    
    if (path.endsWith('.json')) {
      return `{
  "name": "cursor-web-editor",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "typescript": "^5.8.3"
  }
}`;
    }
    
    return `File content for: ${path}\n\nThis is the content of the requested file.\nIt contains implementation details and source code.`;
  }
}

// List Directory Tool
export class ListDirectoryTool extends BaseTool {
  name = 'list';
  description = 'List files and directories in a path';
  icon = '📁';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const dirPath = params?.path || query || '.';
    
    try {
      const files = await this.listDirectory(dirPath);
      
      const content = `## Directory: ${dirPath}

### Files and Directories (${files.length} items):

${files.map(file => 
  `${file.type === 'directory' ? '📁' : '📄'} **${file.name}**
  - Path: \`${file.path}\`
  - Size: ${file.size} bytes
  - Modified: ${file.lastModified.toLocaleDateString()}`
).join('\n\n')}`;

      return this.createResult(content, {
        path: dirPath,
        count: files.length,
        files: files.map(f => ({ name: f.name, type: f.type })),
      });
    } catch (error) {
      return this.createError(`Failed to list directory: ${(error as Error).message}`);
    }
  }

  private async listDirectory(path: string): Promise<FileInfo[]> {
    // Simulate directory listing
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockFiles: FileInfo[] = [
      {
        name: 'src',
        path: `${path}/src`,
        size: 0,
        type: 'directory',
        lastModified: new Date(),
      },
      {
        name: 'package.json',
        path: `${path}/package.json`,
        size: 1524,
        type: 'file',
        lastModified: new Date(),
      },
      {
        name: 'App.tsx',
        path: `${path}/App.tsx`,
        size: 3247,
        type: 'file',
        lastModified: new Date(),
      },
      {
        name: 'components',
        path: `${path}/components`,
        size: 0,
        type: 'directory',
        lastModified: new Date(),
      },
      {
        name: 'services',
        path: `${path}/services`,
        size: 0,
        type: 'directory',
        lastModified: new Date(),
      },
    ];
    
    return mockFiles;
  }
}

// Codebase Search Tool
export class CodebaseTool extends BaseTool {
  name = 'codebase';
  description = 'Search across entire codebase';
  icon = '🔍';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query } = request;
    
    try {
      const results = await this.searchCodebase(query);
      
      const content = `## Codebase Search: "${query}"

### Found ${results.length} matches across the codebase:

${results.map((result, index) => 
  `#### ${index + 1}. \`${result.file}\` (Line ${result.line})
\`\`\`${result.language}
${result.context}
\`\`\`
*Match: ${result.match}*`
).join('\n\n')}`;

      return this.createResult(content, {
        query,
        matches: results.length,
        files: [...new Set(results.map(r => r.file))],
      });
    } catch (error) {
      return this.createError(`Codebase search failed: ${(error as Error).message}`);
    }
  }

  private async searchCodebase(query: string): Promise<any[]> {
    // Simulate codebase search
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockResults = [
      {
        file: 'src/components/Chat.tsx',
        line: 45,
        match: `const ${query}Provider = useProvider();`,
        context: `const handleSend = async () => {\n  const ${query}Provider = useProvider();\n  // Send message logic\n};`,
        language: 'typescript',
      },
      {
        file: 'src/services/ai/providers.ts',
        line: 120,
        match: `export class ${query}Provider implements AIProvider`,
        context: `// Provider implementation\nexport class ${query}Provider implements AIProvider {\n  async chat(messages: Message[]) {\n    // Implementation\n  }\n}`,
        language: 'typescript',
      },
      {
        file: 'src/contexts/ProviderContext.tsx',
        line: 78,
        match: `${query}: 'gpt-4'`,
        context: `const defaultModels = {\n  openai: 'gpt-4',\n  ${query}: 'claude-3',\n  google: 'gemini-pro'\n};`,
        language: 'typescript',
      },
    ];
    
    return mockResults.filter(result => 
      result.match.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Grep Tool
export class GrepTool extends BaseTool {
  name = 'grep';
  description = 'Search for patterns in files using regex';
  icon = '🔎';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const pattern = params?.pattern || query;
    const files = params?.files || ['**/*.ts', '**/*.tsx'];
    
    try {
      const matches = await this.grepSearch(pattern, files);
      
      const content = `## Grep Search: \`${pattern}\`

### Pattern matches in ${matches.length} locations:

${matches.map(match => 
  `**${match.file}:${match.line}**
\`\`\`
${match.lineContent}
\`\`\`
${match.highlighted && `*Highlighted: ${match.highlighted}*`}`
).join('\n\n')}`;

      return this.createResult(content, {
        pattern,
        matches: matches.length,
        files: [...new Set(matches.map(m => m.file))],
      });
    } catch (error) {
      return this.createError(`Grep search failed: ${(error as Error).message}`);
    }
  }

  private async grepSearch(pattern: string, files: string[]): Promise<any[]> {
    // Simulate grep search
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const mockMatches = [
      {
        file: 'src/App.tsx',
        line: 12,
        lineContent: `import { ${pattern}Context } from './contexts';`,
        highlighted: pattern,
      },
      {
        file: 'src/components/Chat.tsx',
        line: 89,
        lineContent: `const result = await ${pattern}Service.process(data);`,
        highlighted: `${pattern}Service`,
      },
      {
        file: 'src/services/ai/aiService.ts',
        line: 156,
        lineContent: `// ${pattern} implementation details`,
        highlighted: pattern,
      },
    ];
    
    return mockMatches.filter(match => 
      match.lineContent.toLowerCase().includes(pattern.toLowerCase())
    );
  }
}

// Search Files Tool
export class SearchFilesTool extends BaseTool {
  name = 'search';
  description = 'Search for files by name or extension';
  icon = '📋';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const searchTerm = params?.term || query;
    const extension = params?.extension;
    
    try {
      const files = await this.searchFiles(searchTerm, extension);
      
      const content = `## File Search: "${searchTerm}"${extension ? ` (*.${extension})` : ''}

### Found ${files.length} matching files:

${files.map(file => 
  `📄 **${file.name}**
  - Path: \`${file.path}\`
  - Size: ${(file.size / 1024).toFixed(1)}KB
  - Modified: ${file.lastModified.toLocaleDateString()}`
).join('\n\n')}`;

      return this.createResult(content, {
        searchTerm,
        extension,
        count: files.length,
        files: files.map(f => f.path),
      });
    } catch (error) {
      return this.createError(`File search failed: ${(error as Error).message}`);
    }
  }

  private async searchFiles(term: string, extension?: string): Promise<FileInfo[]> {
    // Simulate file search
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allFiles: FileInfo[] = [
      {
        name: 'Chat.tsx',
        path: 'src/components/Chat.tsx',
        size: 4567,
        type: 'file',
        lastModified: new Date(),
      },
      {
        name: 'ProviderContext.tsx',
        path: 'src/contexts/ProviderContext.tsx',
        size: 2890,
        type: 'file',
        lastModified: new Date(),
      },
      {
        name: 'aiService.ts',
        path: 'src/services/ai/aiService.ts',
        size: 6123,
        type: 'file',
        lastModified: new Date(),
      },
      {
        name: 'providers.ts',
        path: 'src/services/ai/providers.ts',
        size: 8945,
        type: 'file',
        lastModified: new Date(),
      },
    ];
    
    return allFiles.filter(file => {
      const nameMatch = file.name.toLowerCase().includes(term.toLowerCase());
      const extensionMatch = !extension || file.name.endsWith(`.${extension}`);
      return nameMatch && extensionMatch;
    });
  }
}

// Web Search Tool (Enhanced)
export class WebSearchTool extends BaseTool {
  name = 'web';
  description = 'Search the web for information and documentation';
  icon = '🌐';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query } = request;
    
    try {
      const results = await this.searchWeb(query);
      
      const content = `## Web Search: "${query}"

### Top Results:

${results.map((result, index) => 
  `#### ${index + 1}. [${result.title}](${result.url})
  
${result.description}

*Source: ${result.domain} • ${result.date}*`
).join('\n\n')}

### Summary
${results.length > 0 ? 'Multiple resources found with relevant information. Check the links above for detailed documentation and examples.' : 'No specific results found. Try refining your search terms.'}`;

      return this.createResult(content, {
        query,
        resultsCount: results.length,
        sources: results.map(r => r.domain),
      });
    } catch (error) {
      return this.createError(`Web search failed: ${(error as Error).message}`);
    }
  }

  private async searchWeb(query: string): Promise<any[]> {
    // Simulate web search
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        title: `${query} - Official Documentation`,
        url: `https://docs.example.com/${query.toLowerCase()}`,
        description: `Official documentation and API reference for ${query}. Includes setup guides, examples, and best practices.`,
        domain: 'docs.example.com',
        date: new Date().toLocaleDateString(),
      },
      {
        title: `How to use ${query} - Stack Overflow`,
        url: `https://stackoverflow.com/questions/${query}`,
        description: `Community discussions and solutions related to ${query}. Multiple answers with code examples and explanations.`,
        domain: 'stackoverflow.com',
        date: new Date().toLocaleDateString(),
      },
      {
        title: `${query} Examples - GitHub`,
        url: `https://github.com/search?q=${query}`,
        description: `Open source projects and examples using ${query}. Real-world implementations and code samples.`,
        domain: 'github.com',
        date: new Date().toLocaleDateString(),
      },
    ];
  }
}

// Fetch Rules Tool
export class FetchRulesTool extends BaseTool {
  name = 'rules';
  description = 'Fetch and apply coding rules and standards';
  icon = '📜';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const ruleType = params?.type || query || 'general';
    
    try {
      const rules = await this.fetchRules(ruleType);
      
      const content = `## Coding Rules: ${ruleType}

### Active Rules and Standards:

${rules.map(rule => 
  `#### ${rule.title}
  
**Description:** ${rule.description}

**Example:**
\`\`\`${rule.language || 'typescript'}
${rule.example}
\`\`\`

**Severity:** ${rule.severity} • **Category:** ${rule.category}`
).join('\n\n')}`;

      return this.createResult(content, {
        ruleType,
        count: rules.length,
        categories: [...new Set(rules.map(r => r.category))],
      });
    } catch (error) {
      return this.createError(`Failed to fetch rules: ${(error as Error).message}`);
    }
  }

  private async fetchRules(type: string): Promise<any[]> {
    // Simulate rule fetching
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const rules = [
      {
        title: 'No console.log in production',
        description: 'Remove all console.log statements before deploying to production',
        example: '// ❌ Bad\nconsole.log("Debug info");\n\n// ✅ Good\nif (process.env.NODE_ENV === "development") {\n  console.log("Debug info");\n}',
        severity: 'warning',
        category: 'best-practices',
        language: 'typescript',
      },
      {
        title: 'Use TypeScript interfaces',
        description: 'Define proper TypeScript interfaces for all data structures',
        example: '// ❌ Bad\nfunction processUser(user: any) { }\n\n// ✅ Good\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nfunction processUser(user: User) { }',
        severity: 'error',
        category: 'typescript',
        language: 'typescript',
      },
      {
        title: 'React key props',
        description: 'Always provide unique key props when rendering lists',
        example: '// ❌ Bad\n{items.map(item => <Item />)}\n\n// ✅ Good\n{items.map(item => <Item key={item.id} />)}',
        severity: 'error',
        category: 'react',
        language: 'jsx',
      },
    ];
    
    return rules.filter(rule => 
      type === 'general' || rule.category.includes(type.toLowerCase())
    );
  }
}

// ==================== EDIT TOOLS ====================

// Edit & Reapply Tool
export class EditReapplyTool extends BaseTool {
  name = 'edit';
  description = 'Edit files and reapply changes automatically';
  icon = '✏️';
  category: 'edit' = 'edit';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const filePath = params?.file || '';
    const operations = params?.operations || [];
    
    try {
      const result = await this.editAndReapply(filePath, operations, query);
      
      const content = `## File Edit: ${filePath}

### Applied ${operations.length} edit operation(s):

${operations.map((op: EditOperation, index: number) => 
  `#### Operation ${index + 1}: ${op.type}
  - **Lines:** ${op.startLine}${op.endLine ? `-${op.endLine}` : ''}
  - **Action:** ${op.type.charAt(0).toUpperCase() + op.type.slice(1)}
  ${op.content ? `- **Content:**\n\`\`\`\n${op.content}\n\`\`\`` : ''}`
).join('\n\n')}

### Result:
${result.success ? '✅ Edit applied successfully' : '❌ Edit failed'}
${result.message && `\n**Message:** ${result.message}`}`;

      return this.createResult(content, {
        filePath,
        operations: operations.length,
        success: result.success,
        backup: result.backupPath,
      });
    } catch (error) {
      return this.createError(`Edit operation failed: ${(error as Error).message}`);
    }
  }

  private async editAndReapply(filePath: string, operations: EditOperation[], query: string): Promise<any> {
    // Simulate edit operation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: `Successfully applied ${operations.length} edit(s) to ${filePath}`,
      backupPath: `${filePath}.backup.${Date.now()}`,
      linesChanged: operations.reduce((sum, op) => sum + (op.endLine || op.startLine) - op.startLine + 1, 0),
    };
  }
}

// Delete File Tool
export class DeleteFileTool extends BaseTool {
  name = 'delete';
  description = 'Safely delete files with backup';
  icon = '🗑️';
  category: 'edit' = 'edit';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const filePath = params?.path || query;
    const createBackup = params?.backup !== false;
    
    try {
      const result = await this.deleteFile(filePath, createBackup);
      
      const content = `## File Deletion: ${filePath}

### Operation Details:
- **File:** \`${filePath}\`
- **Backup Created:** ${createBackup ? '✅ Yes' : '❌ No'}
- **Status:** ${result.success ? '✅ Deleted' : '❌ Failed'}

${result.backupPath && `**Backup Location:** \`${result.backupPath}\``}

### Summary:
${result.message}`;

      return this.createResult(content, {
        filePath,
        deleted: result.success,
        backupPath: result.backupPath,
        size: result.fileSize,
      });
    } catch (error) {
      return this.createError(`Delete operation failed: ${(error as Error).message}`);
    }
  }

  private async deleteFile(path: string, backup: boolean): Promise<any> {
    // Simulate file deletion
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      message: `File ${path} has been successfully deleted${backup ? ' (backup created)' : ''}`,
      backupPath: backup ? `${path}.deleted.${Date.now()}` : null,
      fileSize: Math.floor(Math.random() * 10000) + 1000,
    };
  }
}

// ==================== RUN TOOLS ====================

// Terminal Tool
export class TerminalTool extends BaseTool {
  name = 'terminal';
  description = 'Execute terminal commands and scripts';
  icon = '💻';
  category: 'run' = 'run';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const command = params?.command || query;
    const workingDir = params?.cwd || process.cwd();
    
    try {
      const result = await this.executeCommand(command, workingDir);
      
      const content = `## Terminal Execution

### Command:
\`\`\`bash
${command}
\`\`\`

### Working Directory:
\`${workingDir}\`

### Output:
\`\`\`
${result.stdout}
\`\`\`

${result.stderr && `### Errors:
\`\`\`
${result.stderr}
\`\`\``}

### Exit Code: ${result.exitCode}
### Duration: ${result.duration}ms`;

      return this.createResult(content, {
        command,
        exitCode: result.exitCode,
        duration: result.duration,
        success: result.exitCode === 0,
      });
    } catch (error) {
      return this.createError(`Command execution failed: ${(error as Error).message}`);
    }
  }

  private async executeCommand(command: string, cwd: string): Promise<any> {
    // Simulate command execution
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const duration = Date.now() - startTime;
    
    // Mock command results
    if (command.includes('ls') || command.includes('dir')) {
      return {
        stdout: 'src/\npackage.json\nREADME.md\nnode_modules/\ndist/',
        stderr: '',
        exitCode: 0,
        duration,
      };
    }
    
    if (command.includes('npm') || command.includes('bun')) {
      return {
        stdout: 'Dependencies installed successfully\n✨ Done in 2.3s',
        stderr: '',
        exitCode: 0,
        duration,
      };
    }
    
    return {
      stdout: `Command "${command}" executed successfully`,
      stderr: '',
      exitCode: 0,
      duration,
    };
  }
}

// ==================== MCP TOOLS ====================

// MCP Server Toggle Tool
export class MCPToggleTool extends BaseTool {
  name = 'mcp';
  description = 'Toggle MCP (Model Context Protocol) servers';
  icon = '🔗';
  category: 'mcp' = 'mcp';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const action = params?.action || query;
    const serverName = params?.server;
    
    try {
      const result = await this.toggleMCPServer(action, serverName);
      
      const content = `## MCP Server Management

### Action: ${action}
${serverName && `### Server: ${serverName}`}

### Current MCP Servers:

${result.servers.map((server: any) => 
  `#### ${server.name}
  - **Status:** ${server.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
  - **URL:** \`${server.url}\`
  - **Version:** ${server.version}
  - **Last Connected:** ${server.lastConnected}
  ${server.description && `- **Description:** ${server.description}`}`
).join('\n\n')}

### Summary:
${result.message}`;

      return this.createResult(content, {
        action,
        serverName,
        activeServers: result.servers.filter((s: any) => s.status === 'active').length,
        totalServers: result.servers.length,
      });
    } catch (error) {
      return this.createError(`MCP operation failed: ${(error as Error).message}`);
    }
  }

  private async toggleMCPServer(action: string, serverName?: string): Promise<any> {
    // Simulate MCP server management
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockServers = [
      {
        name: 'Claude-MCP',
        status: action === 'enable' ? 'active' : 'inactive',
        url: 'mcp://claude-server:8080',
        version: '1.2.0',
        lastConnected: new Date().toISOString(),
        description: 'Anthropic Claude MCP server for enhanced AI interactions',
      },
      {
        name: 'GPT-MCP',
        status: 'active',
        url: 'mcp://openai-server:8081',
        version: '2.1.0',
        lastConnected: new Date().toISOString(),
        description: 'OpenAI GPT MCP server for language model operations',
      },
      {
        name: 'Local-Tools',
        status: 'inactive',
        url: 'mcp://localhost:8082',
        version: '0.9.5',
        lastConnected: new Date(Date.now() - 86400000).toISOString(),
        description: 'Local development tools MCP server',
      },
    ];
    
    return {
      servers: mockServers,
      message: action === 'enable' 
        ? `MCP server ${serverName || 'services'} enabled successfully`
        : action === 'disable'
        ? `MCP server ${serverName || 'services'} disabled successfully`
        : 'MCP server status retrieved',
    };
  }
}

// ==================== ADVANCED TOOLS ====================

// Auto-apply Edits Tool
export class AutoApplyTool extends BaseTool {
  name = 'apply';
  description = 'Automatically apply suggested edits';
  icon = '🔄';
  category: 'advanced' = 'advanced';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const enabled = params?.enabled !== false;
    const scope = params?.scope || 'current';
    
    try {
      const result = await this.configureAutoApply(enabled, scope, query);
      
      const content = `## Auto-Apply Configuration

### Status: ${enabled ? '🟢 Enabled' : '🔴 Disabled'}
### Scope: ${scope}

### Configuration Details:
- **Auto-apply edits:** ${result.autoApply ? 'Yes' : 'No'}
- **File scope:** ${result.scope}
- **Safety checks:** ${result.safetyChecks ? 'Enabled' : 'Disabled'}
- **Backup creation:** ${result.createBackups ? 'Yes' : 'No'}

### Rules:
${result.rules.map((rule: string) => `- ${rule}`).join('\n')}

### Summary:
${result.message}`;

      return this.createResult(content, {
        enabled,
        scope,
        rulesCount: result.rules.length,
        safetyEnabled: result.safetyChecks,
      });
    } catch (error) {
      return this.createError(`Auto-apply configuration failed: ${(error as Error).message}`);
    }
  }

  private async configureAutoApply(enabled: boolean, scope: string, query: string): Promise<any> {
    // Simulate auto-apply configuration
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      autoApply: enabled,
      scope,
      safetyChecks: true,
      createBackups: true,
      rules: [
        'Only apply edits to files in current workspace',
        'Create backup before any modification',
        'Skip auto-apply for critical system files',
        'Require confirmation for large changes',
        'Maintain edit history for rollback',
      ],
      message: enabled 
        ? `Auto-apply enabled for ${scope} scope with safety checks`
        : 'Auto-apply disabled - all edits require manual confirmation',
    };
  }
}

// Auto-run Tool
export class AutoRunTool extends BaseTool {
  name = 'run';
  description = 'Automatically run code and tests';
  icon = '▶️';
  category: 'advanced' = 'advanced';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const enabled = params?.enabled !== false;
    const tests = params?.tests !== false;
    
    try {
      const result = await this.configureAutoRun(enabled, tests, query);
      
      const content = `## Auto-Run Configuration

### Status: ${enabled ? '🟢 Enabled' : '🔴 Disabled'}
### Include Tests: ${tests ? '✅ Yes' : '❌ No'}

### Execution Pipeline:
${result.pipeline.map((step: any, index: number) => 
  `${index + 1}. **${step.name}**
   - Command: \`${step.command}\`
   - Status: ${step.enabled ? '🟢' : '🔴'}
   - Duration: ~${step.estimatedTime}s`
).join('\n\n')}

### Configuration:
- **Auto-run on save:** ${result.onSave ? 'Yes' : 'No'}
- **Run tests:** ${result.runTests ? 'Yes' : 'No'}
- **Error handling:** ${result.errorHandling}
- **Timeout:** ${result.timeout}s

### Summary:
${result.message}`;

      return this.createResult(content, {
        enabled,
        tests,
        pipelineSteps: result.pipeline.length,
        estimatedDuration: result.pipeline.reduce((sum: number, step: any) => sum + step.estimatedTime, 0),
      });
    } catch (error) {
      return this.createError(`Auto-run configuration failed: ${(error as Error).message}`);
    }
  }

  private async configureAutoRun(enabled: boolean, tests: boolean, query: string): Promise<any> {
    // Simulate auto-run configuration
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const pipeline = [
      {
        name: 'TypeScript Check',
        command: 'tsc --noEmit',
        enabled: true,
        estimatedTime: 3,
      },
      {
        name: 'ESLint',
        command: 'eslint src/',
        enabled: true,
        estimatedTime: 2,
      },
      {
        name: 'Unit Tests',
        command: 'npm test',
        enabled: tests,
        estimatedTime: 5,
      },
      {
        name: 'Build',
        command: 'npm run build',
        enabled: enabled,
        estimatedTime: 8,
      },
    ];
    
    return {
      pipeline,
      onSave: enabled,
      runTests: tests,
      errorHandling: 'stop-on-error',
      timeout: 300,
      message: enabled 
        ? `Auto-run enabled with ${pipeline.filter(p => p.enabled).length} active steps`
        : 'Auto-run disabled - manual execution required',
    };
  }
}

// Guardrails Tool
export class GuardrailsTool extends BaseTool {
  name = 'guard';
  description = 'Configure safety guardrails and constraints';
  icon = '🛡️';
  category: 'advanced' = 'advanced';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const level = params?.level || 'medium';
    const enabled = params?.enabled !== false;
    
    try {
      const result = await this.configureGuardrails(level, enabled, query);
      
      const content = `## Guardrails Configuration

### Protection Level: ${level.toUpperCase()}
### Status: ${enabled ? '🟢 Active' : '🔴 Inactive'}

### Active Guardrails:

${result.guardrails.map((guard: any) => 
  `#### ${guard.name}
  - **Level:** ${guard.level}
  - **Status:** ${guard.enabled ? '🟢 Active' : '🔴 Inactive'}
  - **Description:** ${guard.description}
  - **Actions:** ${guard.actions.join(', ')}`
).join('\n\n')}

### Security Policies:
${result.policies.map((policy: string) => `- ${policy}`).join('\n')}

### Summary:
${result.message}`;

      return this.createResult(content, {
        level,
        enabled,
        activeGuardrails: result.guardrails.filter((g: any) => g.enabled).length,
        totalGuardrails: result.guardrails.length,
      });
    } catch (error) {
      return this.createError(`Guardrails configuration failed: ${(error as Error).message}`);
    }
  }

  private async configureGuardrails(level: string, enabled: boolean, query: string): Promise<any> {
    // Simulate guardrails configuration
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const guardrails = [
      {
        name: 'File System Protection',
        level: 'high',
        enabled: enabled && (level === 'high' || level === 'medium'),
        description: 'Prevents unauthorized file system modifications',
        actions: ['block', 'log', 'notify'],
      },
      {
        name: 'Code Injection Prevention',
        level: 'critical',
        enabled: enabled,
        description: 'Blocks potentially dangerous code injection attempts',
        actions: ['block', 'quarantine', 'alert'],
      },
      {
        name: 'API Rate Limiting',
        level: 'medium',
        enabled: enabled,
        description: 'Limits API calls to prevent abuse',
        actions: ['throttle', 'log'],
      },
      {
        name: 'Memory Usage Monitor',
        level: 'low',
        enabled: enabled && level !== 'low',
        description: 'Monitors and limits memory consumption',
        actions: ['warn', 'log'],
      },
    ];
    
    const policies = [
      'No execution of system-level commands without approval',
      'All file modifications require backup creation',
      'API keys and secrets must be properly secured',
      'External network access is logged and monitored',
      'Code changes are subject to safety analysis',
    ];
    
    return {
      guardrails,
      policies,
      message: enabled 
        ? `Guardrails active at ${level} level with ${guardrails.filter(g => g.enabled).length} protections`
        : 'All guardrails disabled - use caution',
    };
  }
}

// Auto-fix Errors Tool
export class AutoFixTool extends BaseTool {
  name = 'fix';
  description = 'Automatically detect and fix common errors';
  icon = '🔧';
  category: 'advanced' = 'advanced';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, params } = request;
    const enabled = params?.enabled !== false;
    const scope = params?.scope || 'syntax';
    
    try {
      const result = await this.runAutoFix(enabled, scope, query);
      
      const content = `## Auto-Fix Results

### Scan Summary:
- **Files Scanned:** ${result.filesScanned}
- **Errors Detected:** ${result.errorsFound}
- **Fixes Applied:** ${result.fixesApplied}
- **Success Rate:** ${((result.fixesApplied / result.errorsFound) * 100).toFixed(1)}%

### Issues Fixed:

${result.fixes.map((fix: any, index: number) => 
  `#### ${index + 1}. ${fix.type} in \`${fix.file}\`
  
**Problem:**
\`\`\`${fix.language}
${fix.before}
\`\`\`

**Fixed:**
\`\`\`${fix.language}
${fix.after}
\`\`\`

**Description:** ${fix.description}`
).join('\n\n')}

### Summary:
${result.message}`;

      return this.createResult(content, {
        enabled,
        scope,
        filesScanned: result.filesScanned,
        errorsFound: result.errorsFound,
        fixesApplied: result.fixesApplied,
      });
    } catch (error) {
      return this.createError(`Auto-fix operation failed: ${(error as Error).message}`);
    }
  }

  private async runAutoFix(enabled: boolean, scope: string, query: string): Promise<any> {
    // Simulate auto-fix operation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockFixes = [
      {
        type: 'Missing semicolon',
        file: 'src/components/Chat.tsx',
        language: 'typescript',
        before: 'const message = "Hello"',
        after: 'const message = "Hello";',
        description: 'Added missing semicolon for consistency',
      },
      {
        type: 'Unused import',
        file: 'src/services/ai/providers.ts',
        language: 'typescript',
        before: 'import React, { useState } from "react";\nimport { useEffect } from "react";',
        after: 'import React, { useState, useEffect } from "react";',
        description: 'Consolidated React imports for better organization',
      },
      {
        type: 'Type annotation',
        file: 'src/contexts/ProviderContext.tsx',
        language: 'typescript',
        before: 'const handleProvider = (provider) => {',
        after: 'const handleProvider = (provider: AIProvider) => {',
        description: 'Added missing type annotation for better type safety',
      },
    ];
    
    return {
      filesScanned: 15,
      errorsFound: 8,
      fixesApplied: 6,
      fixes: mockFixes,
      message: enabled 
        ? `Auto-fix completed: ${mockFixes.length} issues resolved automatically`
        : 'Auto-fix disabled - errors require manual intervention',
    };
  }
}

// ==================== TOOL REGISTRY ====================

export class CursorToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private settings: Map<string, any> = new Map();

  constructor() {
    this.initializeTools();
    this.loadSettings();
  }

  private initializeTools(): void {
    // Search Tools
    this.registerTool(new ReadFileTool());
    this.registerTool(new ListDirectoryTool());
    this.registerTool(new CodebaseTool());
    this.registerTool(new GrepTool());
    this.registerTool(new SearchFilesTool());
    this.registerTool(new WebSearchTool());
    this.registerTool(new FetchRulesTool());

    // Edit Tools
    this.registerTool(new EditReapplyTool());
    this.registerTool(new DeleteFileTool());

    // Run Tools
    this.registerTool(new TerminalTool());

    // MCP Tools
    this.registerTool(new MCPToggleTool());

    // Advanced Tools
    this.registerTool(new AutoApplyTool());
    this.registerTool(new AutoRunTool());
    this.registerTool(new GuardrailsTool());
    this.registerTool(new AutoFixTool());
  }

  private loadSettings(): void {
    // Load default settings
    this.settings.set('autoApply', { enabled: false, scope: 'current' });
    this.settings.set('autoRun', { enabled: true, tests: true });
    this.settings.set('guardrails', { level: 'medium', enabled: true });
    this.settings.set('autoFix', { enabled: true, scope: 'syntax' });
  }

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getToolsByCategory(category: Tool['category']): Tool[] {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getEnabledTools(): Tool[] {
    return Array.from(this.tools.values()).filter(tool => tool.enabled);
  }

  toggleTool(name: string, enabled?: boolean): boolean {
    const tool = this.tools.get(name);
    if (!tool) return false;
    
    tool.enabled = enabled !== undefined ? enabled : !tool.enabled;
    return tool.enabled;
  }

  async executeTool(request: ToolRequest): Promise<ToolResult> {
    const tool = this.getTool(request.type);
    if (!tool) {
      throw new Error(`Unknown tool: ${request.type}`);
    }

    if (!tool.enabled) {
      throw new Error(`Tool "${request.type}" is disabled`);
    }

    try {
      return await tool.execute(request);
    } catch (error) {
      return {
        type: request.type,
        content: `Tool execution failed: ${(error as Error).message}`,
        success: false,
        error: (error as Error).message,
      };
    }
  }

  async executeMultipleTools(requests: ToolRequest[]): Promise<ToolResult[]> {
    const promises = requests.map(request => this.executeTool(request));
    return Promise.all(promises);
  }

  getToolStatistics(): any {
    const tools = this.getAllTools();
    const categories = ['search', 'edit', 'run', 'mcp', 'advanced'] as const;
    
    return {
      total: tools.length,
      enabled: tools.filter(t => t.enabled).length,
      disabled: tools.filter(t => !t.enabled).length,
      byCategory: categories.reduce((acc, category) => {
        const categoryTools = this.getToolsByCategory(category);
        acc[category] = {
          total: categoryTools.length,
          enabled: categoryTools.filter(t => t.enabled).length,
        };
        return acc;
      }, {} as Record<string, any>),
    };
  }

  updateSettings(key: string, value: any): void {
    this.settings.set(key, value);
  }

  getSettings(key?: string): any {
    if (key) {
      return this.settings.get(key);
    }
    return Object.fromEntries(this.settings.entries());
  }
}

// Singleton instance
export const cursorToolRegistry = new CursorToolRegistry();

// Export for backward compatibility
export const toolRegistry = cursorToolRegistry;