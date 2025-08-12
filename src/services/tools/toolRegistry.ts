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
  const toolPattern = /@(docs|web|symbols)\s+([^@\n]+?)(?=\s@|$)/gi;
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
  category: 'search' | 'edit' | 'run' | 'mcp' | 'advanced' = 'search';
  enabled: boolean = true;
  abstract execute(request: ToolRequest): Promise<ToolResult>;

  protected createResult(content: string, metadata?: Record<string, any>): ToolResult {
    return {
      type: this.name,
      content,
      metadata,
    };
  }
}

// Documentation search tool
export class DocsTool extends BaseTool {
  name = 'docs';
  description = 'Search documentation and help content';
  icon = '📚';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query } = request;
    
    // Simulate documentation search
    const docsContent = this.searchDocs(query);
    
    return this.createResult(docsContent, {
      query,
      source: 'documentation',
      timestamp: new Date().toISOString(),
    });
  }

  private searchDocs(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('react') || lowerQuery.includes('component')) {
      return `## React Components

React components are the building blocks of a React application. Here are key concepts:

### Functional Components
\`\`\`jsx
function MyComponent({ title, children }) {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      {children}
    </div>
  );
}
\`\`\`

### Hooks
- \`useState\` - Manage component state
- \`useEffect\` - Handle side effects
- \`useContext\` - Access context values
- \`useMemo\` - Memoize expensive calculations
- \`useCallback\` - Memoize functions`;
    }
    
    if (lowerQuery.includes('typescript') || lowerQuery.includes('type')) {
      return `## TypeScript Basics

TypeScript adds static typing to JavaScript:

### Interfaces
\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  isActive?: boolean;
}
\`\`\`

### Types
\`\`\`typescript
type Status = 'loading' | 'success' | 'error';
type ApiResponse<T> = {
  data: T;
  status: Status;
  message?: string;
};
\`\`\`

### Generic Functions
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\``;
    }
    
    if (lowerQuery.includes('css') || lowerQuery.includes('style')) {
      return `## CSS & Styling

### Tailwind CSS Classes
- \`flex\` - Display flex
- \`grid\` - Display grid
- \`bg-blue-500\` - Background color
- \`text-white\` - Text color
- \`p-4\` - Padding
- \`m-2\` - Margin
- \`rounded\` - Border radius

### CSS Grid
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
\`\`\`

### Flexbox
\`\`\`css
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
\`\`\``;
    }
    
    return `## Search Results for "${query}"

No specific documentation found for your query. Here are some general resources:

### Getting Started
- Check the project README for setup instructions
- Review the component documentation
- Look at example implementations

### Common Patterns
- Use TypeScript for better type safety
- Follow React best practices
- Implement proper error handling
- Write tests for your components

### Need Help?
Try searching for more specific terms or check the official documentation for the technologies you're using.`;
  }
}

// Web search tool
export class WebTool extends BaseTool {
  name = 'web';
  description = 'Search the web for information';
  icon = '🌐';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query } = request;
    
    try {
      // Simulate web search results
      const webContent = await this.searchWeb(query);
      
      return this.createResult(webContent, {
        query,
        source: 'web_search',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return this.createResult(
        `Failed to search the web: ${(error as Error).message}`,
        { error: true }
      );
    }
  }

  private async searchWeb(query: string): Promise<string> {
    // Simulate web search delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `## Web Search Results for "${query}"

### Recent Articles and Resources

1. **Stack Overflow Discussion**
   - Multiple solutions and approaches
   - Community-verified answers
   - Code examples and explanations

2. **Official Documentation**
   - Latest API references
   - Migration guides
   - Best practices

3. **GitHub Repositories**
   - Open source implementations
   - Example projects
   - Issue discussions

4. **Developer Blogs**
   - Tutorial articles
   - Performance tips
   - Real-world use cases

### Summary
Based on web search results, there are several approaches to your query. The most recommended solution involves following current best practices and using established libraries where possible.

*Results from web search. Contact system administrator if you need access to real-time web search.*`;
  }
}

// Code symbols search tool
export class SymbolsTool extends BaseTool {
  name = 'symbols';
  description = 'Search code symbols, functions, and definitions';
  icon = '🔍';
  category: 'search' = 'search';

  async execute(request: ToolRequest): Promise<ToolResult> {
    const { query, context } = request;
    
    // Use file context from editor if available
    const files = context?.files || [];
    const currentFile = context?.currentFile;
    
    const symbolsContent = this.searchSymbols(query, files, currentFile);
    
    return this.createResult(symbolsContent, {
      query,
      source: 'code_symbols',
      filesSearched: files.length,
      timestamp: new Date().toISOString(),
    });
  }

  private searchSymbols(query: string, files: any[], currentFile?: any): string {
    const lowerQuery = query.toLowerCase();
    
    // Sample symbol search results
    const symbols = [
      {
        name: 'useState',
        type: 'function',
        file: 'src/components/Chat.tsx',
        line: 15,
        description: 'React hook for managing component state',
      },
      {
        name: 'useProvider',
        type: 'function',
        file: 'src/contexts/ProviderContext.tsx',
        line: 245,
        description: 'Custom hook for accessing provider context',
      },
      {
        name: 'ChatMessage',
        type: 'interface',
        file: 'src/types/index.ts',
        line: 8,
        description: 'Interface for chat message objects',
      },
      {
        name: 'sendMessage',
        type: 'function',
        file: 'src/components/Chat.tsx',
        line: 98,
        description: 'Function to send chat messages to AI',
      },
    ];

    const matchingSymbols = symbols.filter(symbol => 
      symbol.name.toLowerCase().includes(lowerQuery) ||
      symbol.description.toLowerCase().includes(lowerQuery)
    );

    if (matchingSymbols.length === 0) {
      return `## No symbols found for "${query}"

### Search Tips
- Try using partial names (e.g., "use" for hooks)
- Search for class names, function names, or variable names
- Check spelling and capitalization

### Current File Context
${currentFile ? `Currently viewing: \`${currentFile.name}\`` : 'No file currently open'}

### Available Files
${files.length > 0 ? files.map(f => `- ${f.name}`).join('\n') : 'No files in workspace'}`;
    }

    return `## Code Symbols for "${query}"

### Found ${matchingSymbols.length} symbol(s):

${matchingSymbols.map(symbol => `
#### \`${symbol.name}\` (${symbol.type})
- **File:** \`${symbol.file}\`
- **Line:** ${symbol.line}
- **Description:** ${symbol.description}
`).join('\n')}

### Usage Examples
\`\`\`typescript
// Example usage of found symbols
${matchingSymbols.map(symbol => {
  if (symbol.type === 'function' && symbol.name.startsWith('use')) {
    return `const result = ${symbol.name}();`;
  } else if (symbol.type === 'interface') {
    return `const message: ${symbol.name} = { /* properties */ };`;
  } else {
    return `// Use ${symbol.name} in your code`;
  }
}).join('\n')}
\`\`\``;
  }
}

// Tool registry
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  constructor() {
    this.registerTool(new DocsTool());
    this.registerTool(new WebTool());
    this.registerTool(new SymbolsTool());
  }

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  async executeTool(request: ToolRequest): Promise<ToolResult> {
    const tool = this.getTool(request.type);
    if (!tool) {
      throw new Error(`Unknown tool: ${request.type}`);
    }

    return await tool.execute(request);
  }

  async executeMultipleTools(requests: ToolRequest[]): Promise<ToolResult[]> {
    const promises = requests.map(request => this.executeTool(request));
    return Promise.all(promises);
  }
}

// Singleton instance
export const toolRegistry = new ToolRegistry();