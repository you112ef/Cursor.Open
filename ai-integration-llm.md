# تكامل الذكاء الاصطناعي ونماذج LLM

## 🧠 معمارية نظام الذكاء الاصطناعي

### **البنية العامة لنظام AI**
```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Orchestrator                      │
│              (Request Routing & Context Management)        │
├─────────────────────────────────────────────────────────────┤
│                    LLM Service Layer                       │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │   OpenAI API    │  Anthropic API  │  Local Models   │   │
│  │   GPT-4, GPT-3  │     Claude      │   Ollama, etc   │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                   Context Management                       │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │  Vector Store   │ Code Analyzer   │ Memory System   │   │
│  │  (Embeddings)   │ (AST & Symbols) │ (Conversations) │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                     Tool Integration                       │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │  Code Tools     │  Search Tools   │  System Tools   │   │
│  │ (Edit, Analyze) │ (Files, Web)    │ (Terminal, Git) │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 LLM Provider Integration

### **Universal LLM Interface**
```typescript
// src/main/ai/providers/base.provider.ts
export interface LLMProvider {
  name: string;
  models: LLMModel[];
  capabilities: LLMCapabilities;
  
  generateCompletion(request: CompletionRequest): Promise<CompletionResponse>;
  generateStream(request: CompletionRequest): AsyncGenerator<StreamChunk>;
  generateEmbedding(text: string): Promise<number[]>;
  estimateTokens(text: string): number;
  validateApiKey(apiKey: string): Promise<boolean>;
}

export interface LLMModel {
  id: string;
  name: string;
  contextLength: number;
  inputTokenPrice: number; // per 1K tokens
  outputTokenPrice: number; // per 1K tokens
  capabilities: string[];
}

export interface LLMCapabilities {
  streaming: boolean;
  functionCalling: boolean;
  codeGeneration: boolean;
  multimodal: boolean;
  jsonMode: boolean;
}

export interface CompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  tools?: Tool[];
  toolChoice?: 'auto' | 'none' | string;
  stream?: boolean;
  jsonMode?: boolean;
}

export interface CompletionResponse {
  id: string;
  content: string;
  model: string;
  usage: TokenUsage;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
  toolCalls?: ToolCall[];
  metadata?: Record<string, any>;
}
```

### **OpenAI Provider Implementation**
```typescript
// src/main/ai/providers/openai.provider.ts
export class OpenAIProvider implements LLMProvider {
  name = 'openai';
  private client: OpenAI;
  
  models: LLMModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      contextLength: 8192,
      inputTokenPrice: 0.03,
      outputTokenPrice: 0.06,
      capabilities: ['streaming', 'functionCalling', 'codeGeneration']
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      contextLength: 128000,
      inputTokenPrice: 0.01,
      outputTokenPrice: 0.03,
      capabilities: ['streaming', 'functionCalling', 'codeGeneration', 'multimodal']
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      contextLength: 16384,
      inputTokenPrice: 0.001,
      outputTokenPrice: 0.002,
      capabilities: ['streaming', 'functionCalling', 'codeGeneration']
    }
  ];

  capabilities: LLMCapabilities = {
    streaming: true,
    functionCalling: true,
    codeGeneration: true,
    multimodal: true,
    jsonMode: true
  };

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens,
        tools: request.tools,
        tool_choice: request.toolChoice,
        response_format: request.jsonMode ? { type: 'json_object' } : undefined
      });

      const choice = completion.choices[0];
      
      return {
        id: completion.id,
        content: choice.message.content || '',
        model: completion.model,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0
        },
        finishReason: choice.finish_reason as any,
        toolCalls: choice.message.tool_calls?.map(tc => ({
          id: tc.id,
          type: tc.type,
          function: {
            name: tc.function.name,
            arguments: JSON.parse(tc.function.arguments)
          }
        }))
      };
    } catch (error) {
      throw new LLMError(`OpenAI API error: ${error.message}`, 'openai', error);
    }
  }

  async *generateStream(request: CompletionRequest): AsyncGenerator<StreamChunk> {
    const stream = await this.client.chat.completions.create({
      ...request,
      stream: true
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      
      if (delta?.content) {
        yield {
          type: 'content',
          content: delta.content,
          metadata: { model: chunk.model }
        };
      }

      if (delta?.tool_calls) {
        yield {
          type: 'tool_call',
          toolCall: delta.tool_calls[0],
          metadata: { model: chunk.model }
        };
      }

      if (chunk.choices[0]?.finish_reason) {
        yield {
          type: 'done',
          finishReason: chunk.choices[0].finish_reason,
          metadata: { model: chunk.model }
        };
      }
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });

    return response.data[0].embedding;
  }

  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English
    return Math.ceil(text.length / 4);
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const testClient = new OpenAI({ apiKey });
      await testClient.models.list();
      return true;
    } catch {
      return false;
    }
  }
}
```

### **Anthropic Claude Provider**
```typescript
// src/main/ai/providers/anthropic.provider.ts
export class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  private client: Anthropic;

  models: LLMModel[] = [
    {
      id: 'claude-3-sonnet-20240229',
      name: 'Claude 3 Sonnet',
      contextLength: 200000,
      inputTokenPrice: 0.003,
      outputTokenPrice: 0.015,
      capabilities: ['streaming', 'functionCalling', 'codeGeneration', 'multimodal']
    },
    {
      id: 'claude-3-opus-20240229',
      name: 'Claude 3 Opus',
      contextLength: 200000,
      inputTokenPrice: 0.015,
      outputTokenPrice: 0.075,
      capabilities: ['streaming', 'functionCalling', 'codeGeneration', 'multimodal']
    }
  ];

  capabilities: LLMCapabilities = {
    streaming: true,
    functionCalling: true,
    codeGeneration: true,
    multimodal: true,
    jsonMode: false
  };

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    const systemMessage = request.messages.find(m => m.role === 'system');
    const messages = request.messages.filter(m => m.role !== 'system');

    const response = await this.client.messages.create({
      model: request.model,
      max_tokens: request.maxTokens || 4000,
      temperature: request.temperature,
      system: systemMessage?.content,
      messages: messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      tools: request.tools as any
    });

    return {
      id: response.id,
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      model: response.model,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      },
      finishReason: response.stop_reason as any,
      toolCalls: response.content
        .filter(c => c.type === 'tool_use')
        .map(c => ({
          id: c.id,
          type: 'function',
          function: {
            name: c.name,
            arguments: c.input
          }
        }))
    };
  }
}
```

---

## 🧠 Context Management System

### **Context Builder**
```typescript
// src/main/ai/context/context.builder.ts
export class ContextBuilder {
  constructor(
    private vectorStore: VectorStore,
    private codeAnalyzer: CodeAnalyzer,
    private fileManager: FileManager
  ) {}

  async buildContext(request: ContextRequest): Promise<ChatContext> {
    const context: ChatContext = {
      messages: [],
      files: [],
      codeSymbols: [],
      projectInfo: null,
      relevantDocs: [],
      searchResults: []
    };

    // Add conversation history
    if (request.conversationId) {
      context.messages = await this.getConversationHistory(request.conversationId);
    }

    // Add explicitly referenced files
    for (const filePath of request.referencedFiles || []) {
      const fileContent = await this.fileManager.readFile(filePath);
      const analysis = await this.codeAnalyzer.analyzeFile(filePath);
      
      context.files.push({
        path: filePath,
        content: fileContent,
        language: analysis.language,
        symbols: analysis.symbols,
        summary: analysis.summary
      });
    }

    // Add semantic search results
    if (request.query) {
      const searchResults = await this.vectorStore.searchSimilar(
        request.query,
        request.maxResults || 5
      );
      
      context.searchResults = searchResults;
      
      // Add top search results as files
      for (const result of searchResults.slice(0, 3)) {
        if (!context.files.some(f => f.path === result.filePath)) {
          const fileContent = await this.fileManager.readFile(result.filePath);
          context.files.push({
            path: result.filePath,
            content: fileContent,
            relevanceScore: result.score
          });
        }
      }
    }

    // Add project information
    if (request.projectPath) {
      context.projectInfo = await this.buildProjectInfo(request.projectPath);
    }

    // Add current selection context
    if (request.currentSelection) {
      context.currentSelection = {
        filePath: request.currentSelection.filePath,
        content: request.currentSelection.content,
        startLine: request.currentSelection.startLine,
        endLine: request.currentSelection.endLine,
        surroundingContext: await this.getSurroundingContext(
          request.currentSelection.filePath,
          request.currentSelection.startLine,
          request.currentSelection.endLine
        )
      };
    }

    return context;
  }

  private async buildProjectInfo(projectPath: string): Promise<ProjectInfo> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    let packageInfo = null;
    
    if (await this.fileManager.fileExists(packageJsonPath)) {
      const packageContent = await this.fileManager.readFile(packageJsonPath);
      packageInfo = JSON.parse(packageContent);
    }

    const gitInfo = await this.getGitInfo(projectPath);
    const mainFiles = await this.getMainProjectFiles(projectPath);

    return {
      path: projectPath,
      name: packageInfo?.name || path.basename(projectPath),
      description: packageInfo?.description,
      dependencies: packageInfo?.dependencies,
      scripts: packageInfo?.scripts,
      gitInfo,
      mainFiles,
      frameworks: this.detectFrameworks(packageInfo)
    };
  }

  private async getSurroundingContext(
    filePath: string,
    startLine: number,
    endLine: number
  ): Promise<string> {
    const fileContent = await this.fileManager.readFile(filePath);
    const lines = fileContent.split('\n');
    
    const contextStart = Math.max(0, startLine - 10);
    const contextEnd = Math.min(lines.length, endLine + 10);
    
    return lines.slice(contextStart, contextEnd).join('\n');
  }

  private detectFrameworks(packageInfo: any): string[] {
    if (!packageInfo?.dependencies) return [];
    
    const frameworks = [];
    const deps = { ...packageInfo.dependencies, ...packageInfo.devDependencies };
    
    if (deps.react) frameworks.push('React');
    if (deps.vue) frameworks.push('Vue');
    if (deps.angular) frameworks.push('Angular');
    if (deps.next) frameworks.push('Next.js');
    if (deps.nuxt) frameworks.push('Nuxt.js');
    if (deps.express) frameworks.push('Express');
    if (deps.fastify) frameworks.push('Fastify');
    if (deps.typescript) frameworks.push('TypeScript');
    
    return frameworks;
  }
}
```

### **Vector Store for Semantic Search**
```typescript
// src/main/ai/vector/vector.store.ts
export class VectorStore {
  private index: HNSWLib.HierarchicalNSW;
  private documents: Map<number, DocumentMetadata> = new Map();
  private embeddingCache: Map<string, number[]> = new Map();

  constructor(
    private llmProvider: LLMProvider,
    private dimension: number = 1536 // OpenAI embedding dimension
  ) {
    this.index = new HNSWLib.HierarchicalNSW('cosine', dimension);
  }

  async addDocument(doc: CodeDocument): Promise<void> {
    const chunks = await this.chunkDocument(doc);
    
    for (const chunk of chunks) {
      const embedding = await this.getEmbedding(chunk.content);
      const id = this.documents.size;
      
      this.documents.set(id, {
        filePath: doc.filePath,
        chunkIndex: chunk.index,
        content: chunk.content,
        startLine: chunk.startLine,
        endLine: chunk.endLine,
        symbols: chunk.symbols,
        language: doc.language
      });
      
      this.index.addPoint(embedding, id);
    }
  }

  async searchSimilar(query: string, k: number = 5): Promise<SearchResult[]> {
    const queryEmbedding = await this.getEmbedding(query);
    const results = this.index.searchKnn(queryEmbedding, k);
    
    return results.neighbors.map((id, index) => {
      const doc = this.documents.get(id)!;
      return {
        filePath: doc.filePath,
        content: doc.content,
        startLine: doc.startLine,
        endLine: doc.endLine,
        score: 1 - results.distances[index], // Convert distance to similarity
        symbols: doc.symbols,
        language: doc.language
      };
    });
  }

  async removeDocument(filePath: string): Promise<void> {
    const idsToRemove: number[] = [];
    
    for (const [id, doc] of this.documents) {
      if (doc.filePath === filePath) {
        idsToRemove.push(id);
      }
    }
    
    for (const id of idsToRemove) {
      this.documents.delete(id);
      // Note: HNSW doesn't support deletion, would need to rebuild index
    }
  }

  private async chunkDocument(doc: CodeDocument): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];
    
    if (doc.language === 'typescript' || doc.language === 'javascript') {
      // Use AST-based chunking for better semantic boundaries
      chunks.push(...await this.chunkByAST(doc));
    } else {
      // Fallback to line-based chunking
      chunks.push(...await this.chunkByLines(doc));
    }
    
    return chunks;
  }

  private async chunkByAST(doc: CodeDocument): Promise<DocumentChunk[]> {
    const ast = await this.parseAST(doc.content, doc.language);
    const chunks: DocumentChunk[] = [];
    
    // Extract functions, classes, and other top-level constructs
    for (const node of ast.body) {
      if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
        const startLine = node.loc.start.line;
        const endLine = node.loc.end.line;
        const content = this.extractNodeContent(doc.content, node);
        
        chunks.push({
          index: chunks.length,
          content,
          startLine,
          endLine,
          symbols: this.extractSymbols(node)
        });
      }
    }
    
    return chunks;
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const cacheKey = this.hashText(text);
    
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey)!;
    }
    
    const embedding = await this.llmProvider.generateEmbedding(text);
    this.embeddingCache.set(cacheKey, embedding);
    
    return embedding;
  }

  private hashText(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}
```

---

## 🛠️ Tool Integration System

### **Tool Definition & Execution**
```typescript
// src/main/ai/tools/tool.manager.ts
export class ToolManager {
  private tools: Map<string, Tool> = new Map();
  private toolExecutors: Map<string, ToolExecutor> = new Map();

  constructor(
    private fileManager: FileManager,
    private terminalManager: TerminalManager,
    private codeAnalyzer: CodeAnalyzer,
    private securityManager: SecurityManager
  ) {
    this.registerDefaultTools();
  }

  registerTool(tool: Tool, executor: ToolExecutor): void {
    this.tools.set(tool.name, tool);
    this.toolExecutors.set(tool.name, executor);
  }

  async executeTool(
    toolName: string, 
    parameters: Record<string, any>,
    context: ExecutionContext
  ): Promise<ToolResult> {
    const tool = this.tools.get(toolName);
    const executor = this.toolExecutors.get(toolName);

    if (!tool || !executor) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    // Validate parameters
    const validation = await this.validateToolParameters(tool, parameters);
    if (!validation.valid) {
      throw new Error(`Invalid parameters: ${validation.errors.join(', ')}`);
    }

    // Security check
    const securityCheck = await this.securityManager.validateToolExecution(
      toolName, 
      parameters, 
      context
    );
    if (!securityCheck.allowed) {
      throw new Error(`Security check failed: ${securityCheck.reason}`);
    }

    // Execute tool
    try {
      const result = await executor.execute(parameters, context);
      return {
        success: true,
        data: result,
        metadata: {
          toolName,
          executionTime: Date.now() - context.startTime,
          tokensUsed: this.estimateTokensUsed(parameters, result)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          toolName,
          executionTime: Date.now() - context.startTime
        }
      };
    }
  }

  getToolsForMode(mode: AgentMode): Tool[] {
    const allTools = Array.from(this.tools.values());
    
    switch (mode) {
      case 'agent':
        return allTools; // All tools available
      case 'ask':
        return allTools.filter(t => t.category === 'search' || t.category === 'analyze');
      case 'manual':
        return allTools.filter(t => t.category === 'edit');
      default:
        return allTools;
    }
  }

  private registerDefaultTools(): void {
    // File operations
    this.registerTool(
      {
        name: 'read_file',
        description: 'Read the contents of a file',
        category: 'file',
        parameters: {
          type: 'object',
          properties: {
            file_path: { type: 'string', description: 'Path to the file to read' },
            max_lines: { type: 'number', description: 'Maximum number of lines to read' }
          },
          required: ['file_path']
        }
      },
      new FileReadExecutor(this.fileManager)
    );

    this.registerTool(
      {
        name: 'write_file',
        description: 'Write content to a file',
        category: 'edit',
        parameters: {
          type: 'object',
          properties: {
            file_path: { type: 'string', description: 'Path to the file to write' },
            content: { type: 'string', description: 'Content to write to the file' }
          },
          required: ['file_path', 'content']
        }
      },
      new FileWriteExecutor(this.fileManager)
    );

    // Code analysis
    this.registerTool(
      {
        name: 'analyze_code',
        description: 'Analyze code structure and extract symbols',
        category: 'analyze',
        parameters: {
          type: 'object',
          properties: {
            file_path: { type: 'string', description: 'Path to the code file to analyze' }
          },
          required: ['file_path']
        }
      },
      new CodeAnalysisExecutor(this.codeAnalyzer)
    );

    // Search operations
    this.registerTool(
      {
        name: 'search_files',
        description: 'Search for files by name or pattern',
        category: 'search',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query or pattern' },
            directory: { type: 'string', description: 'Directory to search in' },
            file_types: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'File extensions to include'
            }
          },
          required: ['query']
        }
      },
      new FileSearchExecutor(this.fileManager)
    );

    // Terminal operations
    this.registerTool(
      {
        name: 'run_command',
        description: 'Execute a terminal command',
        category: 'system',
        parameters: {
          type: 'object',
          properties: {
            command: { type: 'string', description: 'Command to execute' },
            working_directory: { type: 'string', description: 'Working directory for the command' },
            timeout: { type: 'number', description: 'Timeout in seconds' }
          },
          required: ['command']
        }
      },
      new CommandExecutor(this.terminalManager)
    );
  }
}

// Tool Executors
class FileReadExecutor implements ToolExecutor {
  constructor(private fileManager: FileManager) {}

  async execute(
    parameters: { file_path: string; max_lines?: number },
    context: ExecutionContext
  ): Promise<any> {
    const content = await this.fileManager.readFile(parameters.file_path);
    
    if (parameters.max_lines) {
      const lines = content.split('\n');
      return {
        content: lines.slice(0, parameters.max_lines).join('\n'),
        total_lines: lines.length,
        truncated: lines.length > parameters.max_lines
      };
    }
    
    return { content, total_lines: content.split('\n').length };
  }
}

class CodeAnalysisExecutor implements ToolExecutor {
  constructor(private codeAnalyzer: CodeAnalyzer) {}

  async execute(
    parameters: { file_path: string },
    context: ExecutionContext
  ): Promise<any> {
    const analysis = await this.codeAnalyzer.analyzeFile(parameters.file_path);
    
    return {
      language: analysis.language,
      symbols: analysis.symbols,
      imports: analysis.imports,
      exports: analysis.exports,
      dependencies: analysis.dependencies,
      complexity: analysis.complexity,
      issues: analysis.issues
    };
  }
}
```

---

## 🎯 Agent Modes & Specialized Behaviors

### **Agent Mode Manager**
```typescript
// src/main/ai/agents/mode.manager.ts
export class AgentModeManager {
  private modes: Map<AgentMode, ModeConfig> = new Map();

  constructor() {
    this.initializeModes();
  }

  getModeConfig(mode: AgentMode): ModeConfig {
    return this.modes.get(mode) || this.modes.get('agent')!;
  }

  async processRequest(
    request: AgentRequest,
    mode: AgentMode
  ): Promise<AgentResponse> {
    const config = this.getModeConfig(mode);
    const processor = this.createProcessor(config);
    
    return processor.process(request);
  }

  private initializeModes(): void {
    // Agent Mode - Full autonomy
    this.modes.set('agent', {
      name: 'Agent',
      description: 'Full autonomous mode with all tools enabled',
      systemPrompt: `You are an expert software developer AI assistant. You can:
- Read, write, and edit code files
- Analyze code structure and dependencies
- Execute terminal commands
- Search for information
- Make complex changes across multiple files

Always explain your reasoning and ask for confirmation before making significant changes.`,
      enabledTools: ['all'],
      autoExecute: true,
      requireConfirmation: ['delete_file', 'run_command'],
      maxTokens: 4000,
      temperature: 0.1
    });

    // Ask Mode - Questions and learning
    this.modes.set('ask', {
      name: 'Ask',
      description: 'Question and answer mode for learning and exploration',
      systemPrompt: `You are a helpful coding mentor and teacher. Focus on:
- Explaining concepts clearly
- Providing educational examples
- Helping users learn and understand code
- Answering questions about programming

You can search and read files but cannot make changes.`,
      enabledTools: ['read_file', 'search_files', 'analyze_code', 'search_web'],
      autoExecute: false,
      requireConfirmation: [],
      maxTokens: 2000,
      temperature: 0.3
    });

    // Manual Mode - Precise control
    this.modes.set('manual', {
      name: 'Manual',
      description: 'Manual mode for precise, controlled edits',
      systemPrompt: `You are a precise code editor. Focus on:
- Making exact changes as requested
- Showing clear diffs
- Being explicit about modifications
- Following instructions precisely

Only edit files when explicitly asked.`,
      enabledTools: ['read_file', 'write_file', 'analyze_code'],
      autoExecute: false,
      requireConfirmation: ['write_file'],
      maxTokens: 3000,
      temperature: 0.0
    });
  }

  private createProcessor(config: ModeConfig): AgentProcessor {
    switch (config.name) {
      case 'Agent':
        return new AutonomousAgentProcessor(config);
      case 'Ask':
        return new QuestionAnswerProcessor(config);
      case 'Manual':
        return new ManualEditProcessor(config);
      default:
        return new AutonomousAgentProcessor(config);
    }
  }
}

// Specialized Processors
class AutonomousAgentProcessor implements AgentProcessor {
  constructor(private config: ModeConfig) {}

  async process(request: AgentRequest): Promise<AgentResponse> {
    // 1. Analyze the request to determine required tools
    const requiredTools = await this.analyzeRequiredTools(request);
    
    // 2. Create execution plan
    const plan = await this.createExecutionPlan(request, requiredTools);
    
    // 3. Execute plan step by step
    const results = [];
    for (const step of plan.steps) {
      const result = await this.executeStep(step, request.context);
      results.push(result);
      
      // Check if we need user confirmation
      if (this.config.requireConfirmation.includes(step.tool)) {
        const confirmation = await this.requestConfirmation(step);
        if (!confirmation) {
          break;
        }
      }
    }
    
    // 4. Generate final response
    return this.generateResponse(request, results);
  }

  private async analyzeRequiredTools(request: AgentRequest): Promise<string[]> {
    // Analyze the request to determine which tools are needed
    const tools = [];
    
    if (request.message.includes('read') || request.message.includes('show')) {
      tools.push('read_file');
    }
    
    if (request.message.includes('edit') || request.message.includes('change')) {
      tools.push('write_file');
    }
    
    if (request.message.includes('run') || request.message.includes('execute')) {
      tools.push('run_command');
    }
    
    if (request.message.includes('search') || request.message.includes('find')) {
      tools.push('search_files');
    }
    
    return tools;
  }
}
```

---

## 📊 Token Management & Optimization

### **Token Manager**
```typescript
// src/main/ai/token/token.manager.ts
export class TokenManager {
  private readonly MAX_CONTEXT_TOKENS = {
    'gpt-4': 8192,
    'gpt-4-turbo': 128000,
    'gpt-3.5-turbo': 16384,
    'claude-3-sonnet': 200000,
    'claude-3-opus': 200000
  };

  constructor(private llmProvider: LLMProvider) {}

  async optimizeContext(
    messages: ChatMessage[],
    model: string,
    reserveTokens: number = 1000
  ): Promise<ChatMessage[]> {
    const maxTokens = this.MAX_CONTEXT_TOKENS[model] || 4000;
    const targetTokens = maxTokens - reserveTokens;
    
    let totalTokens = 0;
    const optimizedMessages: ChatMessage[] = [];
    
    // Always keep the system message
    const systemMessage = messages.find(m => m.role === 'system');
    if (systemMessage) {
      optimizedMessages.push(systemMessage);
      totalTokens += this.estimateTokens(systemMessage.content);
    }
    
    // Keep recent messages, working backwards
    const nonSystemMessages = messages.filter(m => m.role !== 'system').reverse();
    
    for (const message of nonSystemMessages) {
      const messageTokens = this.estimateTokens(message.content);
      
      if (totalTokens + messageTokens > targetTokens) {
        // Try to truncate the message if it's too long
        if (message.content.length > 1000) {
          const truncated = this.truncateMessage(message, targetTokens - totalTokens);
          if (truncated) {
            optimizedMessages.unshift(truncated);
          }
        }
        break;
      }
      
      optimizedMessages.unshift(message);
      totalTokens += messageTokens;
    }
    
    return optimizedMessages;
  }

  async estimateUsage(request: CompletionRequest): Promise<TokenUsage> {
    const promptTokens = request.messages.reduce(
      (sum, msg) => sum + this.estimateTokens(msg.content),
      0
    );
    
    // Estimate output tokens based on max_tokens or model default
    const estimatedOutputTokens = request.maxTokens || 1000;
    
    return {
      promptTokens,
      completionTokens: estimatedOutputTokens,
      totalTokens: promptTokens + estimatedOutputTokens
    };
  }

  calculateCost(usage: TokenUsage, model: string): number {
    const modelInfo = this.llmProvider.models.find(m => m.id === model);
    if (!modelInfo) return 0;
    
    const inputCost = (usage.promptTokens / 1000) * modelInfo.inputTokenPrice;
    const outputCost = (usage.completionTokens / 1000) * modelInfo.outputTokenPrice;
    
    return inputCost + outputCost;
  }

  private estimateTokens(text: string): number {
    return this.llmProvider.estimateTokens(text);
  }

  private truncateMessage(
    message: ChatMessage, 
    maxTokens: number
  ): ChatMessage | null {
    const targetLength = Math.floor(message.content.length * (maxTokens / this.estimateTokens(message.content)));
    
    if (targetLength < 100) return null; // Too small to be useful
    
    return {
      ...message,
      content: message.content.substring(0, targetLength) + '... [truncated]'
    };
  }
}
```

---

## 🔄 Conversation Memory System

### **Memory Manager**
```typescript
// src/main/ai/memory/memory.manager.ts
export class MemoryManager {
  private shortTermMemory: Map<string, ConversationMemory> = new Map();
  private longTermMemory: ConversationRepository;

  constructor(database: Database) {
    this.longTermMemory = new ConversationRepository(database);
  }

  async getConversationMemory(conversationId: string): Promise<ConversationMemory> {
    // Check short-term memory first
    if (this.shortTermMemory.has(conversationId)) {
      return this.shortTermMemory.get(conversationId)!;
    }

    // Load from long-term memory
    const conversation = await this.longTermMemory.findWithMessages(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const memory: ConversationMemory = {
      id: conversationId,
      messages: conversation.messages,
      context: this.extractContext(conversation.messages),
      preferences: this.extractPreferences(conversation.messages),
      codePatterns: this.extractCodePatterns(conversation.messages)
    };

    // Cache in short-term memory
    this.shortTermMemory.set(conversationId, memory);
    
    return memory;
  }

  async updateMemory(
    conversationId: string,
    newMessage: ChatMessage,
    context?: Record<string, any>
  ): Promise<void> {
    const memory = await this.getConversationMemory(conversationId);
    
    memory.messages.push(newMessage);
    
    // Update extracted information
    memory.context = { ...memory.context, ...context };
    this.updatePreferences(memory, newMessage);
    this.updateCodePatterns(memory, newMessage);
    
    // Persist to database
    await this.longTermMemory.addMessage(conversationId, newMessage);
    
    // Update cache
    this.shortTermMemory.set(conversationId, memory);
  }

  private extractContext(messages: ChatMessage[]): Record<string, any> {
    const context: Record<string, any> = {};
    
    for (const message of messages) {
      // Extract file references
      const fileReferences = this.extractFileReferences(message.content);
      if (fileReferences.length > 0) {
        context.referencedFiles = [
          ...(context.referencedFiles || []),
          ...fileReferences
        ];
      }
      
      // Extract mentioned technologies
      const technologies = this.extractTechnologies(message.content);
      if (technologies.length > 0) {
        context.technologies = [
          ...(context.technologies || []),
          ...technologies
        ];
      }
    }
    
    return context;
  }

  private extractPreferences(messages: ChatMessage[]): UserPreferences {
    const preferences: UserPreferences = {
      codingStyle: 'standard',
      verbosity: 'medium',
      explainSteps: true,
      preferredLanguages: []
    };
    
    // Analyze user messages to extract preferences
    const userMessages = messages.filter(m => m.role === 'user');
    
    for (const message of userMessages) {
      // Detect preferred coding style
      if (message.content.includes('semicolon')) {
        preferences.codingStyle = 'semicolons';
      } else if (message.content.includes('no semicolon')) {
        preferences.codingStyle = 'no-semicolons';
      }
      
      // Detect verbosity preference
      if (message.content.includes('brief') || message.content.includes('short')) {
        preferences.verbosity = 'low';
      } else if (message.content.includes('detailed') || message.content.includes('explain')) {
        preferences.verbosity = 'high';
      }
    }
    
    return preferences;
  }

  private extractCodePatterns(messages: ChatMessage[]): CodePattern[] {
    const patterns: CodePattern[] = [];
    
    for (const message of messages) {
      if (message.role === 'assistant' && message.content.includes('```')) {
        const codeBlocks = this.extractCodeBlocks(message.content);
        
        for (const block of codeBlocks) {
          patterns.push({
            language: block.language,
            pattern: this.identifyPattern(block.code),
            frequency: 1,
            lastUsed: new Date()
          });
        }
      }
    }
    
    return patterns;
  }
}
```

هذا النظام الشامل لتكامل الذكاء الاصطناعي يوفر أساساً قوياً ومرناً لجميع ميزات AI في التطبيق، مع التركيز على الأداء والدقة وسهولة الاستخدام.