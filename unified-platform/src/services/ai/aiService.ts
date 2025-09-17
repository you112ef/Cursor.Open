import {
  AIProvider,
  ChatRequest,
  ChatResponse,
  AIServiceError,
  OpenAIProvider,
  AnthropicProvider,
  GoogleProvider,
  OllamaProvider,
  DeepSeekProvider,
  GroqProvider,
  CohereProvider,
  MistralProvider,
  PerplexityProvider,
  XaiProvider,
  TogetherProvider,
  HuggingFaceProvider,
  FireworksProvider
} from './providers';
import { PROVIDERS } from '../../contexts/ProviderContext';
import { providerManager, chatWithProvider, validateProviderApiKey } from './provider-manager';

export class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private apiKeys: Map<string, string> = new Map();

  constructor() {
    // Initialize all providers using the new provider manager
    this.initializeProviders();
  }

  private initializeProviders() {
    // Get all providers from provider manager
    const allProviders = [
      new OpenAIProvider(),
      new AnthropicProvider(),
      new GoogleProvider(),
      new OllamaProvider(),
      new DeepSeekProvider(),
      new GroqProvider(),
      new CohereProvider(),
      new MistralProvider(),
      new PerplexityProvider(),
      new XaiProvider(),
      new TogetherProvider(),
      new HuggingFaceProvider(),
      new FireworksProvider()
    ];

    allProviders.forEach(provider => {
      this.providers.set(provider.name, provider);
    });

    console.log('Initialized AI providers:', Array.from(this.providers.keys()));
  }

  // Set API key for a provider
  setApiKey(provider: string, apiKey: string): void {
    this.apiKeys.set(provider, apiKey);
  }

  // Remove API key for a provider
  removeApiKey(provider: string): void {
    this.apiKeys.delete(provider);
  }

  // Get API key for a provider
  getApiKey(provider: string): string | undefined {
    return this.apiKeys.get(provider);
  }

  // Validate API key for a provider
  async validateApiKey(provider: string, apiKey: string): Promise<boolean> {
    try {
      // Use the new provider manager for validation
      const isValid = await validateProviderApiKey(provider, apiKey);
      if (isValid) {
        this.setApiKey(provider, apiKey);
      }
      return isValid;
    } catch (error) {
      console.error(`Failed to validate API key for ${provider}:`, error);
      return false;
    }
  }

  // Check if provider requires API key
  requiresApiKey(provider: string): boolean {
    const providerConfig = PROVIDERS.find(p => p.id === provider);
    return providerConfig?.requiresApiKey ?? false;
  }

  // Check if we have a valid API key for a provider
  hasValidApiKey(provider: string): boolean {
    return this.apiKeys.has(provider);
  }

  // Get available models for a provider
  getProviderModels(provider: string) {
    const providerConfig = PROVIDERS.find(p => p.id === provider);
    return providerConfig?.models ?? [];
  }

  // Send chat request
  async chat(request: ChatRequest): Promise<ChatResponse> {
    // Check if provider requires API key
    if (this.requiresApiKey(request.provider)) {
      const apiKey = this.getApiKey(request.provider) || request.apiKey;
      if (!apiKey) {
        throw new AIServiceError(
          `API key required for ${request.provider}`, 
          request.provider, 
          401
        );
      }
      request.apiKey = apiKey;
    }

    // Validate model exists for provider
    const models = this.getProviderModels(request.provider);
    const modelExists = models.some(m => m.id === request.model);
    if (!modelExists) {
      throw new AIServiceError(
        `Model ${request.model} not available for provider ${request.provider}`,
        request.provider,
        400
      );
    }

    try {
      // Use the new provider manager for chat requests
      const response = await chatWithProvider(request);
      return response;
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw error;
      } else {
        throw new AIServiceError(
          `Failed to send chat request: ${(error as Error).message || 'Unknown error'}`,
          request.provider,
          undefined,
          error
        );
      }
    }
  }

  // Test provider connection
  async testProvider(provider: string, apiKey: string): Promise<{
    success: boolean;
    error?: string;
    latency?: number;
  }> {
    return await providerManager.testProvider(provider, apiKey);
  }

  // Get system prompt based on agent mode and tools
  getSystemPrompt(agentMode: string, tools: Record<string, boolean>): string {
    const basePrompt = "You are an AI assistant integrated into Cursor Open, a web-based code editor.";
    
    switch (agentMode) {
      case 'agent':
        return `${basePrompt} You have full autonomy to edit files, run commands, and use all available tools to help users with their coding tasks. Be proactive and make changes when appropriate.`;
        
      case 'ask':
        return `${basePrompt} You should provide guidance and suggestions without making direct changes to files or running commands. Ask for permission before taking any actions.`;
        
      case 'manual':
        return `${basePrompt} You are in manual mode. Only respond to direct questions and do not suggest actions unless explicitly asked.`;
        
      case 'custom':
        const enabledTools = Object.entries(tools)
          .filter(([_, enabled]) => enabled)
          .map(([tool, _]) => tool);
        
        return `${basePrompt} You can use the following tools: ${enabledTools.join(', ')}. Use these tools appropriately to assist users with their coding tasks.`;
        
      default:
        return basePrompt;
    }
  }

  // Get all available providers
  getAllProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  // Get provider information
  getProviderInfo(provider: string) {
    return providerManager.getProviderInfo(provider);
  }

  // Format chat context for AI
  formatChatContext(
    messages: any[], 
    agentMode: string, 
    tools: Record<string, boolean>,
    activeFile?: string,
    fileContent?: string
  ) {
    const contextMessages: { role: string; content: string }[] = [];
    
    // Add system prompt
    contextMessages.push({
      role: 'system',
      content: this.getSystemPrompt(agentMode, tools),
    });

    // Add file context if available
    if (activeFile && fileContent) {
      contextMessages.push({
        role: 'system',
        content: `Current file: ${activeFile}\n\nContent:\n\`\`\`\n${fileContent}\n\`\`\``,
      });
    }

    // Add conversation history
    contextMessages.push(...messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })));

    return contextMessages;
  }
}

// Singleton instance
export const aiService = new AIService();

// Export types for use in components
export type { ChatRequest, ChatResponse, AIServiceError } from './providers';