import {
  AIProvider,
  ChatRequest,
  ChatResponse,
  StreamResponse,
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

// Provider registry
const providerRegistry = new Map<string, AIProvider>();

// Initialize all providers
function initializeProviders() {
  const providers = [
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

  providers.forEach(provider => {
    providerRegistry.set(provider.name, provider);
  });

  console.log('Initialized AI providers:', Array.from(providerRegistry.keys()));
}

// Provider Manager Class
export class ProviderManager {
  private static instance: ProviderManager;
  private initialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  private initialize() {
    if (!this.initialized) {
      initializeProviders();
      this.initialized = true;
    }
  }

  public getProvider(name: string): AIProvider | null {
    return providerRegistry.get(name) || null;
  }

  public getAllProviders(): string[] {
    return Array.from(providerRegistry.keys());
  }

  public async chat(request: ChatRequest): Promise<ChatResponse> {
    const provider = this.getProvider(request.provider);
    
    if (!provider) {
      throw new AIServiceError(
        `Provider '${request.provider}' not found`,
        request.provider
      );
    }

    // Validate API key if required
    if (request.apiKey && provider.validateApiKey) {
      const isValid = await provider.validateApiKey(request.apiKey);
      if (!isValid) {
        throw new AIServiceError(
          'Invalid API key provided',
          request.provider,
          401
        );
      }
    }

    return await provider.chat(request);
  }

  public async *stream(request: ChatRequest): AsyncGenerator<StreamResponse> {
    const provider = this.getProvider(request.provider);
    
    if (!provider) {
      throw new AIServiceError(
        `Provider '${request.provider}' not found`,
        request.provider
      );
    }

    if (!provider.stream) {
      throw new AIServiceError(
        `Provider '${request.provider}' does not support streaming`,
        request.provider
      );
    }

    // Validate API key if required
    if (request.apiKey && provider.validateApiKey) {
      const isValid = await provider.validateApiKey(request.apiKey);
      if (!isValid) {
        throw new AIServiceError(
          'Invalid API key provided',
          request.provider,
          401
        );
      }
    }

    yield* provider.stream(request);
  }

  public async validateApiKey(provider: string, apiKey: string): Promise<boolean> {
    const providerInstance = this.getProvider(provider);
    
    if (!providerInstance) {
      console.warn(`Provider '${provider}' not found for API key validation`);
      return false;
    }

    try {
      return await providerInstance.validateApiKey(apiKey);
    } catch (error) {
      console.error(`Error validating API key for ${provider}:`, error);
      return false;
    }
  }

  public async testProvider(provider: string, apiKey: string): Promise<{
    success: boolean;
    error?: string;
    latency?: number;
  }> {
    const startTime = Date.now();
    
    try {
      const testRequest: ChatRequest = {
        provider,
        model: this.getDefaultModel(provider),
        apiKey,
        messages: [
          {
            role: 'user',
            content: 'Hello! Please respond with just "Hello" to test the connection.'
          }
        ],
        maxTokens: 10,
        temperature: 0
      };

      const response = await this.chat(testRequest);
      const latency = Date.now() - startTime;

      return {
        success: true,
        latency
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private getDefaultModel(provider: string): string {
    const defaultModels: { [key: string]: string } = {
      'openai': 'gpt-4o-mini',
      'anthropic': 'claude-3-haiku-20240307',
      'google': 'gemini-1.5-flash',
      'ollama': 'llama3.2',
      'deepseek': 'deepseek-chat',
      'groq': 'llama-3.1-8b-instant',
      'cohere': 'command-light',
      'mistral': 'mistral-small-latest',
      'perplexity': 'llama-3.1-sonar-small-128k-online',
      'xai': 'grok-beta',
      'together': 'meta-llama/Llama-3-8b-chat-hf',
      'huggingface': 'microsoft/DialoGPT-medium',
      'fireworks': 'accounts/fireworks/models/llama-v3p1-8b-instruct'
    };

    return defaultModels[provider] || 'default';
  }

  public getProviderInfo(provider: string): {
    name: string;
    supportsStreaming: boolean;
    requiresApiKey: boolean;
  } | null {
    const providerInstance = this.getProvider(provider);
    
    if (!providerInstance) {
      return null;
    }

    return {
      name: providerInstance.name,
      supportsStreaming: typeof providerInstance.stream === 'function',
      requiresApiKey: provider !== 'ollama' // Ollama is the only local provider
    };
  }
}

// Export singleton instance
export const providerManager = ProviderManager.getInstance();

// Utility functions
export async function chatWithProvider(request: ChatRequest): Promise<ChatResponse> {
  return await providerManager.chat(request);
}

export async function* streamWithProvider(request: ChatRequest): AsyncGenerator<StreamResponse> {
  yield* providerManager.stream(request);
}

export async function validateProviderApiKey(provider: string, apiKey: string): Promise<boolean> {
  return await providerManager.validateApiKey(provider, apiKey);
}

export async function testProviderConnection(provider: string, apiKey: string) {
  return await providerManager.testProvider(provider, apiKey);
}