// Base types for AI service
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model: string;
  provider: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  message: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
}

export interface StreamResponse {
  delta: string;
  finished: boolean;
  usage?: ChatResponse['usage'];
}

// Error types
export class AIServiceError extends Error {
  constructor(
    message: string, 
    public provider: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

// Provider interface
export interface AIProvider {
  name: string;
  chat(request: ChatRequest): Promise<ChatResponse>;
  stream?(request: ChatRequest): AsyncGenerator<StreamResponse>;
  validateApiKey(apiKey: string): Promise<boolean>;
}

// Base provider class
export abstract class BaseProvider implements AIProvider {
  abstract name: string;
  abstract chat(request: ChatRequest): Promise<ChatResponse>;
  abstract validateApiKey(apiKey: string): Promise<boolean>;

  protected handleError(error: any, context: string): never {
    console.error(`${this.name} Error (${context}):`, error);
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        throw new AIServiceError('Invalid API key', this.name, status, error);
      } else if (status === 429) {
        throw new AIServiceError('Rate limit exceeded', this.name, status, error);
      } else if (status === 403) {
        throw new AIServiceError('Access forbidden', this.name, status, error);
      } else if (status >= 500) {
        throw new AIServiceError('Server error', this.name, status, error);
      } else {
        throw new AIServiceError(
          data?.error?.message || `HTTP ${status} error`, 
          this.name, 
          status, 
          error
        );
      }
    } else if (error.code === 'NETWORK_ERROR') {
      throw new AIServiceError('Network connection failed', this.name, undefined, error);
    } else {
      throw new AIServiceError(
        error.message || 'Unknown error occurred', 
        this.name, 
        undefined, 
        error
      );
    }
  }

  protected createHeaders(apiKey: string, additionalHeaders: Record<string, string> = {}) {
    return {
      'Content-Type': 'application/json',
      ...additionalHeaders,
      ...this.getAuthHeaders(apiKey),
    };
  }

  protected abstract getAuthHeaders(apiKey: string): Record<string, string>;
}

// OpenAI Provider
export class OpenAIProvider extends BaseProvider {
  name = 'openai';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Anthropic Provider
export class AnthropicProvider extends BaseProvider {
  name = 'anthropic';
  
  protected getAuthHeaders(apiKey: string) {
    return { 
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          messages: request.messages
            .filter(msg => msg.role !== 'system')
            .map(msg => ({
              role: msg.role,
              content: msg.content
            })),
          max_tokens: request.maxTokens ?? 2000,
          temperature: request.temperature ?? 0.7,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.content[0].text,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: this.createHeaders(apiKey),
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 1,
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Google Provider
export class GoogleProvider extends BaseProvider {
  name = 'google';
  
  protected getAuthHeaders(apiKey: string) {
    return {};
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${request.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: request.messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens ?? 2000,
          },
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.candidates[0].content.parts[0].text,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0,
        },
        model: request.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Ollama Provider (for local models)
export class OllamaProvider extends BaseProvider {
  name = 'ollama';
  
  protected getAuthHeaders(_apiKey: string) {
    return {};
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.message.content,
          timestamp: new Date(),
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(_apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      return response.ok;
    } catch {
      return false;
    }
  }
}

// DeepSeek Provider
export class DeepSeekProvider extends BaseProvider {
  name = 'deepseek';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.deepseek.com/v1/models', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Groq Provider
export class GroqProvider extends BaseProvider {
  name = 'groq';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Cohere Provider
export class CohereProvider extends BaseProvider {
  name = 'cohere';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          message: request.messages[request.messages.length - 1].content,
          chat_history: request.messages.slice(0, -1).map(msg => ({
            role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
            message: msg.content
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.text,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.meta?.billed_units?.input_tokens || 0,
          completionTokens: data.meta?.billed_units?.output_tokens || 0,
          totalTokens: (data.meta?.billed_units?.input_tokens || 0) + (data.meta?.billed_units?.output_tokens || 0),
        },
        model: request.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.cohere.ai/v1/models', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Mistral Provider
export class MistralProvider extends BaseProvider {
  name = 'mistral';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.mistral.ai/v1/models', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Perplexity Provider
export class PerplexityProvider extends BaseProvider {
  name = 'perplexity';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.perplexity.ai/models', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// xAI Provider (Grok)
export class XaiProvider extends BaseProvider {
  name = 'xai';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.x.ai/v1/models', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Together AI Provider
export class TogetherProvider extends BaseProvider {
  name = 'together';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.together.xyz/v1/models', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Hugging Face Provider
export class HuggingFaceProvider extends BaseProvider {
  name = 'huggingface';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${request.model}`, {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          inputs: request.messages.map(msg => `${msg.role}: ${msg.content}`).join('\n'),
          parameters: {
            temperature: request.temperature ?? 0.7,
            max_new_tokens: request.maxTokens ?? 2000,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || '',
          timestamp: new Date(),
        },
        model: request.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://huggingface.co/api/whoami', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Fireworks Provider
export class FireworksProvider extends BaseProvider {
  name = 'fireworks';
  
  protected getAuthHeaders(apiKey: string) {
    return { 'Authorization': `Bearer ${apiKey}` };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: this.createHeaders(request.apiKey!),
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000,
        }),
      });

      if (!response.ok) {
        throw { response: { status: response.status, data: await response.json() } };
      }

      const data = await response.json();
      
      return {
        message: {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        model: data.model,
        provider: this.name,
      };
    } catch (error) {
      this.handleError(error, 'chat');
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.fireworks.ai/inference/v1/models', {
        headers: this.createHeaders(apiKey),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}