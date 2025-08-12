import React, { useState } from 'react';
import { useProvider, PROVIDERS, AGENT_MODES, Provider } from '../contexts/ProviderContext';
import { BackgroundAgentsPanel } from './BackgroundAgentsPanel';
import { ApiKeyManager } from './ApiKeyManager';
import { ProviderTestSuite } from './ProviderTestSuite';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import {
  ChevronDown,
  Settings,
  Key,
  Trash2,
  ExternalLink,
  Bot,
  Brain,
  Zap,
  Shield,
  Globe,
  Building,
  Sparkles,
} from 'lucide-react';

export function ProviderSelector() {
  const { state, dispatch, getSelectedProvider, getSelectedModel, hasValidApiKey } = useProvider();
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [selectedProviderForKey, setSelectedProviderForKey] = useState('');

  const selectedProvider = getSelectedProvider();
  const selectedModel = getSelectedModel();
  const selectedAgentMode = AGENT_MODES.find(mode => mode.id === state.agentMode);

  const handleProviderChange = (providerId: string) => {
    dispatch({ type: 'SET_PROVIDER', payload: providerId });
  };

  const handleModelChange = (modelId: string) => {
    dispatch({ type: 'SET_MODEL', payload: modelId });
  };

  const handleAgentModeChange = (modeId: string) => {
    dispatch({ type: 'SET_AGENT_MODE', payload: modeId });
  };

  const handleToolToggle = (tool: string) => {
    dispatch({ type: 'TOGGLE_TOOL', payload: tool });
  };

  const handleApiKeySubmit = () => {
    if (newApiKey.trim() && selectedProviderForKey) {
      dispatch({
        type: 'SET_API_KEY',
        payload: { provider: selectedProviderForKey, key: newApiKey.trim() }
      });
      setNewApiKey('');
      setSelectedProviderForKey('');
      setApiKeyDialogOpen(false);
    }
  };

  const handleRemoveApiKey = (provider: string) => {
    dispatch({ type: 'REMOVE_API_KEY', payload: provider });
  };

  const needsApiKey = selectedProvider?.requiresApiKey && !hasValidApiKey(selectedProvider.id);
  
  // Categorize providers
  const categorizeProviders = () => {
    const categories = {
      'Major Platforms': ['openai', 'anthropic', 'google'],
      'AI Startups': ['mistral', 'cohere', 'perplexity', 'xai'],
      'Open Source & Hosting': ['ollama', 'huggingface', 'together', 'fireworks'],
      'High Performance': ['groq', 'deepseek']
    };

    const categorized: { [key: string]: Provider[] } = {};
    
    Object.entries(categories).forEach(([category, providerIds]) => {
      categorized[category] = PROVIDERS.filter(p => providerIds.includes(p.id));
    });
    
    return categorized;
  };

  const categorizedProviders = categorizeProviders();
  
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Provider and Model Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 px-1 sm:px-2 text-xs ${needsApiKey ? 'text-amber-600 dark:text-amber-400' : ''}`}
          >
            <span className="mr-1">{selectedProvider?.icon}</span>
            <span className="max-w-16 sm:max-w-24 truncate">
              {selectedModel?.name || 'Model'}
            </span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[90vw] sm:w-72 md:w-80 max-h-[70vh] overflow-y-auto">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Provider & Model
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {Object.entries(categorizedProviders).map(([category, providers]) => (
            providers.length > 0 && (
              <div key={category}>
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                  {category}
                </DropdownMenuLabel>
                {providers.map((provider) => (
                  <DropdownMenuSub key={provider.id}>
                    <DropdownMenuSubTrigger className="px-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <span className="mr-2">{provider.icon}</span>
                          <span className="text-sm">{provider.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {provider.requiresApiKey && !hasValidApiKey(provider.id) && (
                            <Badge variant="outline" className="text-xs">
                              No Key
                            </Badge>
                          )}
                          {hasValidApiKey(provider.id) && (
                            <Badge variant="default" className="text-xs bg-green-500">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-64 max-h-60 overflow-y-auto">
                        {provider.models.map((model) => (
                          <DropdownMenuItem
                            key={model.id}
                            onClick={() => {
                              handleProviderChange(provider.id);
                              handleModelChange(model.id);
                            }}
                            className="flex items-start justify-between p-3"
                            disabled={provider.requiresApiKey && !hasValidApiKey(provider.id)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{model.name}</span>
                              {model.description && (
                                <span className="text-xs text-muted-foreground mt-0.5">
                                  {model.description}
                                </span>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                {model.contextLength && (
                                  <Badge variant="outline" className="text-xs">
                                    {(model.contextLength / 1000).toFixed(0)}K ctx
                                  </Badge>
                                )}
                                {model.vision && (
                                  <Badge variant="outline" className="text-xs">
                                    Vision
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {model.inputCost && (
                              <div className="text-right">
                                <Badge variant="secondary" className="text-xs">
                                  ${model.inputCost}/1M
                                </Badge>
                              </div>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ))}
                <DropdownMenuSeparator className="my-1" />
              </div>
            )
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Agent Mode Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-1 sm:px-2 text-xs">
            <span className="mr-1">{selectedAgentMode?.icon}</span>
            <span className="max-w-12 sm:max-w-16 truncate">{selectedAgentMode?.name}</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 sm:w-72">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agent Mode
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {AGENT_MODES.map((mode) => (
            <DropdownMenuItem
              key={mode.id}
              onClick={() => handleAgentModeChange(mode.id)}
              className="flex items-start gap-2 p-3"
            >
              <span className="mt-0.5">{mode.icon}</span>
              <div className="flex flex-col">
                <span className="font-medium">{mode.name}</span>
                <span className="text-xs text-muted-foreground">
                  {mode.description}
                </span>
                {mode.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mode.tools.map(tool => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Dialog */}
      <BackgroundAgentsPanel />
      
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              AI Provider Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Current Selection */}
            <div className="space-y-2">
              <Label>Current Selection</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span>{selectedProvider?.icon}</span>
                  <span className="font-medium">{selectedModel?.name}</span>
                  <Badge variant="secondary">{selectedProvider?.name}</Badge>
                </div>
                {selectedProvider?.requiresApiKey && (
                  <Badge variant={hasValidApiKey(selectedProvider.id) ? "default" : "destructive"}>
                    {hasValidApiKey(selectedProvider.id) ? "API Key Valid" : "No API Key"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Agent Mode & Tools */}
            <div className="space-y-4">
              <Label>Agent Mode & Tools</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{selectedAgentMode?.icon}</span>
                    <span className="font-medium">{selectedAgentMode?.name}</span>
                  </div>
                  <Badge variant="outline">{state.agentMode}</Badge>
                </div>
                
                {state.agentMode === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg">
                    {Object.entries({
                      docs: { label: 'Documentation', icon: '📚' },
                      web: { label: 'Web Search', icon: '🌐' },
                      symbols: { label: 'Code Symbols', icon: '🔍' },
                      terminal: { label: 'Terminal', icon: '💻' },
                      files: { label: 'File Editing', icon: '📝' },
                    }).map(([tool, config]) => (
                      <div key={tool} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{config.icon}</span>
                          <span className="text-sm">{config.label}</span>
                        </div>
                        <Switch
                          checked={state.tools[tool as keyof typeof state.tools]}
                          onCheckedChange={() => handleToolToggle(tool)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* API Keys Management */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Keys Management
              </Label>
              
              <div className="max-h-60 overflow-y-auto">
                <ApiKeyManager />
              </div>
            </div>

            {/* Provider Integration Tests */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Integration Testing
              </Label>
              
              <div className="max-h-60 overflow-y-auto">
                <ProviderTestSuite />
              </div>
            </div>

            {/* Background Agents */}
            <div className="space-y-4">
              <Label>Background Agents</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Enable Background Processing</span>
                  </div>
                  <Switch
                    checked={state.backgroundAgents.enabled}
                    onCheckedChange={(enabled) => 
                      dispatch({ type: 'SET_BACKGROUND_AGENTS', payload: { enabled } })
                    }
                  />
                </div>
                
                {state.backgroundAgents.enabled && (
                  <div className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max Concurrent Agents</span>
                      <Badge variant="outline">
                        {state.backgroundAgents.currentAgents}/{state.backgroundAgents.maxAgents}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status indicator */}
      {needsApiKey && (
        <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" 
             title="API key required" />
      )}
    </div>
  );
}