import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Types
export interface Provider {
  id: string;
  name: string;
  icon: string;
  requiresApiKey: boolean;
  apiKeyName: string;
  website: string;
  models: Model[];
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  inputCost?: number;
  outputCost?: number;
  vision?: boolean;
  description?: string;
}

export interface ApiKey {
  provider: string;
  key: string;
  isValid: boolean;
}

export interface AgentMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  tools: string[];
}

interface ProviderState {
  selectedProvider: string;
  selectedModel: string;
  apiKeys: ApiKey[];
  agentMode: string;
  tools: {
    docs: boolean;
    web: boolean;
    symbols: boolean;
    terminal: boolean;
    files: boolean;
  };
  backgroundAgents: {
    enabled: boolean;
    maxAgents: number;
    currentAgents: number;
  };
}

// Actions
type ProviderAction =
  | { type: 'SET_PROVIDER'; payload: string }
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'SET_API_KEY'; payload: { provider: string; key: string } }
  | { type: 'REMOVE_API_KEY'; payload: string }
  | { type: 'SET_AGENT_MODE'; payload: string }
  | { type: 'TOGGLE_TOOL'; payload: string }
  | { type: 'SET_BACKGROUND_AGENTS'; payload: Partial<ProviderState['backgroundAgents']> }
  | { type: 'VALIDATE_API_KEY'; payload: { provider: string; isValid: boolean } };

// Available providers and models
export const PROVIDERS: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    requiresApiKey: true,
    apiKeyName: 'OPENAI_API_KEY',
    website: 'https://openai.com',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        contextLength: 128000,
        inputCost: 2.5,
        outputCost: 10,
        vision: true,
        description: 'Most capable GPT-4 model with vision'
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai',
        contextLength: 128000,
        inputCost: 0.15,
        outputCost: 0.6,
        vision: true,
        description: 'Faster and cheaper GPT-4 model'
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        contextLength: 16384,
        inputCost: 0.5,
        outputCost: 1.5,
        description: 'Fast and efficient model'
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🔮',
    requiresApiKey: true,
    apiKeyName: 'ANTHROPIC_API_KEY',
    website: 'https://anthropic.com',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        contextLength: 200000,
        inputCost: 3,
        outputCost: 15,
        vision: true,
        description: 'Most intelligent Claude model'
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        contextLength: 200000,
        inputCost: 0.25,
        outputCost: 1.25,
        vision: true,
        description: 'Fastest Claude model'
      }
    ]
  },
  {
    id: 'google',
    name: 'Google',
    icon: '🌟',
    requiresApiKey: true,
    apiKeyName: 'GOOGLE_API_KEY',
    website: 'https://ai.google.dev',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        contextLength: 2000000,
        inputCost: 1.25,
        outputCost: 5,
        vision: true,
        description: 'Large context window model'
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        contextLength: 1000000,
        inputCost: 0.075,
        outputCost: 0.3,
        vision: true,
        description: 'Fast and efficient model'
      }
    ]
  },
  {
    id: 'ollama',
    name: 'Ollama',
    icon: '🦙',
    requiresApiKey: false,
    apiKeyName: '',
    website: 'https://ollama.ai',
    models: [
      {
        id: 'llama3.2',
        name: 'Llama 3.2',
        provider: 'ollama',
        contextLength: 8192,
        description: 'Local Llama model'
      },
      {
        id: 'codestral',
        name: 'Codestral',
        provider: 'ollama',
        contextLength: 32768,
        description: 'Code-specialized model'
      },
      {
        id: 'qwen2.5-coder',
        name: 'Qwen 2.5 Coder',
        provider: 'ollama',
        contextLength: 32768,
        description: 'Advanced coding model'
      }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🎯',
    requiresApiKey: true,
    apiKeyName: 'DEEPSEEK_API_KEY',
    website: 'https://deepseek.com',
    models: [
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        provider: 'deepseek',
        contextLength: 16384,
        inputCost: 0.14,
        outputCost: 0.28,
        description: 'Specialized coding model'
      },
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        contextLength: 32768,
        inputCost: 0.14,
        outputCost: 0.28,
        description: 'General purpose model'
      }
    ]
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: '⚡',
    requiresApiKey: true,
    apiKeyName: 'GROQ_API_KEY',
    website: 'https://groq.com',
    models: [
      {
        id: 'llama-3.1-70b-versatile',
        name: 'Llama 3.1 70B',
        provider: 'groq',
        contextLength: 32768,
        inputCost: 0.59,
        outputCost: 0.79,
        description: 'Ultra-fast inference'
      },
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B',
        provider: 'groq',
        contextLength: 32768,
        inputCost: 0.05,
        outputCost: 0.08,
        description: 'Lightning fast model'
      }
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🧠',
    requiresApiKey: true,
    apiKeyName: 'COHERE_API_KEY',
    website: 'https://cohere.com',
    models: [
      {
        id: 'command-r-plus',
        name: 'Command R+',
        provider: 'cohere',
        contextLength: 128000,
        inputCost: 3.0,
        outputCost: 15.0,
        description: 'Most capable Command model'
      },
      {
        id: 'command-r',
        name: 'Command R',
        provider: 'cohere',
        contextLength: 128000,
        inputCost: 0.5,
        outputCost: 1.5,
        description: 'Balanced performance and cost'
      },
      {
        id: 'command-light',
        name: 'Command Light',
        provider: 'cohere',
        contextLength: 4096,
        inputCost: 0.3,
        outputCost: 0.6,
        description: 'Fast and lightweight'
      }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: '🌪️',
    requiresApiKey: true,
    apiKeyName: 'MISTRAL_API_KEY',
    website: 'https://mistral.ai',
    models: [
      {
        id: 'mistral-large-latest',
        name: 'Mistral Large',
        provider: 'mistral',
        contextLength: 32768,
        inputCost: 4.0,
        outputCost: 12.0,
        description: 'Most capable Mistral model'
      },
      {
        id: 'mistral-medium-latest',
        name: 'Mistral Medium',
        provider: 'mistral',
        contextLength: 32768,
        inputCost: 2.7,
        outputCost: 8.1,
        description: 'Balanced performance'
      },
      {
        id: 'mistral-small-latest',
        name: 'Mistral Small',
        provider: 'mistral',
        contextLength: 32768,
        inputCost: 1.0,
        outputCost: 3.0,
        description: 'Cost-effective option'
      }
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: '🔍',
    requiresApiKey: true,
    apiKeyName: 'PERPLEXITY_API_KEY',
    website: 'https://perplexity.ai',
    models: [
      {
        id: 'llama-3.1-sonar-large-128k-online',
        name: 'Sonar Large Online',
        provider: 'perplexity',
        contextLength: 127072,
        inputCost: 1.0,
        outputCost: 1.0,
        description: 'Online search capabilities'
      },
      {
        id: 'llama-3.1-sonar-small-128k-online',
        name: 'Sonar Small Online',
        provider: 'perplexity',
        contextLength: 127072,
        inputCost: 0.2,
        outputCost: 0.2,
        description: 'Fast online search'
      },
      {
        id: 'llama-3.1-70b-instruct',
        name: 'Llama 3.1 70B Instruct',
        provider: 'perplexity',
        contextLength: 131072,
        inputCost: 1.0,
        outputCost: 1.0,
        description: 'Offline instruction following'
      }
    ]
  },
  {
    id: 'xai',
    name: 'xAI',
    icon: '✨',
    requiresApiKey: true,
    apiKeyName: 'XAI_API_KEY',
    website: 'https://x.ai',
    models: [
      {
        id: 'grok-beta',
        name: 'Grok Beta',
        provider: 'xai',
        contextLength: 131072,
        inputCost: 5.0,
        outputCost: 15.0,
        description: 'Grok conversational AI'
      }
    ]
  },
  {
    id: 'together',
    name: 'Together AI',
    icon: '🤝',
    requiresApiKey: true,
    apiKeyName: 'TOGETHER_API_KEY',
    website: 'https://together.ai',
    models: [
      {
        id: 'meta-llama/Llama-3-70b-chat-hf',
        name: 'Llama 3 70B',
        provider: 'together',
        contextLength: 8192,
        inputCost: 0.9,
        outputCost: 0.9,
        description: 'Open source Llama model'
      },
      {
        id: 'meta-llama/Llama-3-8b-chat-hf',
        name: 'Llama 3 8B',
        provider: 'together',
        contextLength: 8192,
        inputCost: 0.2,
        outputCost: 0.2,
        description: 'Smaller Llama variant'
      },
      {
        id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        name: 'Mixtral 8x7B',
        provider: 'together',
        contextLength: 32768,
        inputCost: 0.6,
        outputCost: 0.6,
        description: 'Mixture of experts model'
      }
    ]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: '🤗',
    requiresApiKey: true,
    apiKeyName: 'HUGGINGFACE_API_KEY',
    website: 'https://huggingface.co',
    models: [
      {
        id: 'microsoft/DialoGPT-large',
        name: 'DialoGPT Large',
        provider: 'huggingface',
        contextLength: 1024,
        description: 'Conversational AI model'
      },
      {
        id: 'facebook/blenderbot-400M-distill',
        name: 'BlenderBot 400M',
        provider: 'huggingface',
        contextLength: 512,
        description: 'Distilled conversation model'
      },
      {
        id: 'microsoft/DialoGPT-medium',
        name: 'DialoGPT Medium',
        provider: 'huggingface',
        contextLength: 1024,
        description: 'Medium-sized dialogue model'
      }
    ]
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    icon: '🎆',
    requiresApiKey: true,
    apiKeyName: 'FIREWORKS_API_KEY',
    website: 'https://fireworks.ai',
    models: [
      {
        id: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
        name: 'Llama 3.1 70B',
        provider: 'fireworks',
        contextLength: 131072,
        inputCost: 0.9,
        outputCost: 0.9,
        description: 'High-performance Llama model'
      },
      {
        id: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
        name: 'Llama 3.1 8B',
        provider: 'fireworks',
        contextLength: 131072,
        inputCost: 0.2,
        outputCost: 0.2,
        description: 'Fast Llama variant'
      },
      {
        id: 'accounts/fireworks/models/mixtral-8x7b-instruct',
        name: 'Mixtral 8x7B',
        provider: 'fireworks',
        contextLength: 32768,
        inputCost: 0.5,
        outputCost: 0.5,
        description: 'Efficient mixture model'
      }
    ]
  }
];

// Agent modes
export const AGENT_MODES: AgentMode[] = [
  {
    id: 'agent',
    name: 'Agent',
    description: 'AI agent with full autonomy to edit files and run commands',
    icon: '🤖',
    tools: ['files', 'terminal', 'web', 'docs', 'symbols']
  },
  {
    id: 'ask',
    name: 'Ask',
    description: 'AI provides suggestions and guidance without direct changes',
    icon: '💭',
    tools: ['docs', 'web', 'symbols']
  },
  {
    id: 'manual',
    name: 'Manual',
    description: 'Traditional chat mode - AI responds only to direct questions',
    icon: '✋',
    tools: []
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Customize which tools the AI can use',
    icon: '⚙️',
    tools: []
  }
];

// Initial state
const initialState: ProviderState = {
  selectedProvider: 'anthropic',
  selectedModel: 'claude-3-5-sonnet-20241022',
  apiKeys: [],
  agentMode: 'ask',
  tools: {
    docs: true,
    web: true,
    symbols: true,
    terminal: false,
    files: false,
  },
  backgroundAgents: {
    enabled: false,
    maxAgents: 3,
    currentAgents: 0,
  },
};

// Load from localStorage
function loadStateFromStorage(): ProviderState {
  try {
    const saved = localStorage.getItem('cursor-provider-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialState, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load provider state from storage:', error);
  }
  return initialState;
}

// Save to localStorage
function saveStateToStorage(state: ProviderState) {
  try {
    localStorage.setItem('cursor-provider-state', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save provider state to storage:', error);
  }
}

// Reducer
function providerReducer(state: ProviderState, action: ProviderAction): ProviderState {
  let newState: ProviderState;
  
  switch (action.type) {
    case 'SET_PROVIDER':
      const provider = PROVIDERS.find(p => p.id === action.payload);
      const firstModel = provider?.models[0]?.id || '';
      newState = { 
        ...state, 
        selectedProvider: action.payload,
        selectedModel: firstModel
      };
      break;
      
    case 'SET_MODEL':
      newState = { ...state, selectedModel: action.payload };
      break;
      
    case 'SET_API_KEY':
      const existingKeyIndex = state.apiKeys.findIndex(key => key.provider === action.payload.provider);
      const updatedKeys = [...state.apiKeys];
      
      if (existingKeyIndex >= 0) {
        updatedKeys[existingKeyIndex] = {
          ...updatedKeys[existingKeyIndex],
          key: action.payload.key,
          isValid: true // Will be validated separately
        };
      } else {
        updatedKeys.push({
          provider: action.payload.provider,
          key: action.payload.key,
          isValid: true
        });
      }
      
      newState = { ...state, apiKeys: updatedKeys };
      break;
      
    case 'REMOVE_API_KEY':
      newState = {
        ...state,
        apiKeys: state.apiKeys.filter(key => key.provider !== action.payload)
      };
      break;
      
    case 'VALIDATE_API_KEY':
      newState = {
        ...state,
        apiKeys: state.apiKeys.map(key =>
          key.provider === action.payload.provider
            ? { ...key, isValid: action.payload.isValid }
            : key
        )
      };
      break;
      
    case 'SET_AGENT_MODE':
      const mode = AGENT_MODES.find(m => m.id === action.payload);
      if (mode && mode.id !== 'custom') {
        const tools = {
          docs: mode.tools.includes('docs'),
          web: mode.tools.includes('web'),
          symbols: mode.tools.includes('symbols'),
          terminal: mode.tools.includes('terminal'),
          files: mode.tools.includes('files'),
        };
        newState = { ...state, agentMode: action.payload, tools };
      } else {
        newState = { ...state, agentMode: action.payload };
      }
      break;
      
    case 'TOGGLE_TOOL':
      newState = {
        ...state,
        tools: {
          ...state.tools,
          [action.payload]: !state.tools[action.payload as keyof typeof state.tools]
        },
        agentMode: 'custom' // Switch to custom mode when manually toggling tools
      };
      break;
      
    case 'SET_BACKGROUND_AGENTS':
      newState = {
        ...state,
        backgroundAgents: { ...state.backgroundAgents, ...action.payload }
      };
      break;
      
    default:
      return state;
  }
  
  saveStateToStorage(newState);
  return newState;
}

// Context
const ProviderContext = createContext<{
  state: ProviderState;
  dispatch: React.Dispatch<ProviderAction>;
  getSelectedProvider: () => Provider | null;
  getSelectedModel: () => Model | null;
  getApiKey: (provider: string) => ApiKey | null;
  hasValidApiKey: (provider: string) => boolean;
}>({
  state: initialState,
  dispatch: () => null,
  getSelectedProvider: () => null,
  getSelectedModel: () => null,
  getApiKey: () => null,
  hasValidApiKey: () => false,
});

// Provider
export function ProviderContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(providerReducer, initialState, loadStateFromStorage);

  const getSelectedProvider = () => {
    return PROVIDERS.find(p => p.id === state.selectedProvider) || null;
  };

  const getSelectedModel = () => {
    const provider = getSelectedProvider();
    if (!provider) return null;
    return provider.models.find(m => m.id === state.selectedModel) || null;
  };

  const getApiKey = (provider: string) => {
    return state.apiKeys.find(key => key.provider === provider) || null;
  };

  const hasValidApiKey = (provider: string) => {
    const apiKey = getApiKey(provider);
    return apiKey ? apiKey.isValid : false;
  };

  // Save state changes to localStorage
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  return (
    <ProviderContext.Provider value={{
      state,
      dispatch,
      getSelectedProvider,
      getSelectedModel,
      getApiKey,
      hasValidApiKey,
    }}>
      {children}
    </ProviderContext.Provider>
  );
}

// Hook
export function useProvider() {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within a ProviderContextProvider');
  }
  return context;
}