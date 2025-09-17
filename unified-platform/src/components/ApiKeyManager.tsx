import React, { useState, useEffect } from 'react';
import { useProvider, PROVIDERS, Provider } from '../contexts/ProviderContext';
import { aiService } from '../services/ai/aiService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Key,
  Check,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Zap,
  Shield,
  Info,
} from 'lucide-react';

interface ApiKeyStatus {
  provider: string;
  isValid: boolean;
  isValidating: boolean;
  error?: string;
  latency?: number;
}

export function ApiKeyManager() {
  const { state, dispatch, hasValidApiKey, getApiKey } = useProvider();
  const [newApiKey, setNewApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [apiKeyStatuses, setApiKeyStatuses] = useState<{ [key: string]: ApiKeyStatus }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Group providers by category
  const categorizeProviders = () => {
    const categories = {
      'Major AI Platforms': ['openai', 'anthropic', 'google'],
      'Specialized AI': ['mistral', 'cohere', 'perplexity', 'xai'],
      'Open Source & Hosting': ['together', 'huggingface', 'fireworks'],
      'High Performance': ['groq', 'deepseek'],
      'Local Models': ['ollama']
    };

    const categorized: { [key: string]: Provider[] } = {};
    
    Object.entries(categories).forEach(([category, providerIds]) => {
      categorized[category] = PROVIDERS.filter(p => 
        providerIds.includes(p.id) && p.requiresApiKey
      );
    });
    
    return categorized;
  };

  // Initialize API key statuses
  useEffect(() => {
    const initialStatuses: { [key: string]: ApiKeyStatus } = {};
    PROVIDERS.filter(p => p.requiresApiKey).forEach(provider => {
      const hasKey = hasValidApiKey(provider.id);
      initialStatuses[provider.id] = {
        provider: provider.id,
        isValid: hasKey,
        isValidating: false,
      };
    });
    setApiKeyStatuses(initialStatuses);
  }, [hasValidApiKey]);

  // Validate API key
  const validateApiKey = async (providerId: string, apiKey: string) => {
    setApiKeyStatuses(prev => ({
      ...prev,
      [providerId]: { ...prev[providerId], isValidating: true, error: undefined }
    }));

    try {
      const testResult = await aiService.testProvider(providerId, apiKey);
      
      if (testResult.success) {
        // Save API key if valid
        dispatch({
          type: 'SET_API_KEY',
          payload: { provider: providerId, key: apiKey }
        });
        
        dispatch({
          type: 'VALIDATE_API_KEY',
          payload: { provider: providerId, isValid: true }
        });

        setApiKeyStatuses(prev => ({
          ...prev,
          [providerId]: {
            ...prev[providerId],
            isValid: true,
            isValidating: false,
            latency: testResult.latency
          }
        }));
      } else {
        setApiKeyStatuses(prev => ({
          ...prev,
          [providerId]: {
            ...prev[providerId],
            isValid: false,
            isValidating: false,
            error: testResult.error || 'Invalid API key'
          }
        }));
      }
    } catch (error) {
      setApiKeyStatuses(prev => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          isValid: false,
          isValidating: false,
          error: (error as Error).message
        }
      }));
    }
  };

  // Handle API key submission
  const handleApiKeySubmit = async () => {
    if (!newApiKey.trim() || !selectedProvider) return;

    await validateApiKey(selectedProvider, newApiKey.trim());
    
    // Reset form
    setNewApiKey('');
    setSelectedProvider('');
    setIsDialogOpen(false);
  };

  // Remove API key
  const handleRemoveApiKey = (providerId: string) => {
    dispatch({ type: 'REMOVE_API_KEY', payload: providerId });
    setApiKeyStatuses(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        isValid: false,
        error: undefined,
        latency: undefined
      }
    }));
  };

  // Toggle API key visibility
  const toggleApiKeyVisibility = (providerId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  // Mask API key for display
  const maskApiKey = (apiKey: string) => {
    if (apiKey.length <= 8) return apiKey;
    return `${apiKey.slice(0, 4)}${'•'.repeat(apiKey.length - 8)}${apiKey.slice(-4)}`;
  };

  const categorizedProviders = categorizeProviders();
  const providersRequiringKeys = PROVIDERS.filter(p => p.requiresApiKey);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">API Key Management</h3>
          <p className="text-sm text-muted-foreground">
            Configure API keys for AI providers to enable real conversations
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Key className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New API Key</DialogTitle>
              <DialogDescription>
                Enter your API key for the selected provider. Keys are stored securely in your browser.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="provider-select">Provider</Label>
                <select
                  id="provider-select"
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full mt-1 p-2 border border-border rounded-md bg-background text-sm"
                >
                  <option value="">Select Provider</option>
                  {providersRequiringKeys.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.icon} {provider.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="api-key-input">API Key</Label>
                <Input
                  id="api-key-input"
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={handleApiKeySubmit} 
                className="w-full"
                disabled={!newApiKey.trim() || !selectedProvider}
              >
                <Key className="h-4 w-4 mr-2" />
                Save API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Keys</p>
                <p className="text-2xl font-bold text-green-600">
                  {Object.values(apiKeyStatuses).filter(s => s.isValid).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <div>
                <p className="text-sm font-medium">Missing Keys</p>
                <p className="text-2xl font-bold text-amber-600">
                  {providersRequiringKeys.length - Object.values(apiKeyStatuses).filter(s => s.isValid).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    Object.values(apiKeyStatuses)
                      .filter(s => s.latency)
                      .reduce((acc, s) => acc + (s.latency || 0), 0) /
                    Object.values(apiKeyStatuses).filter(s => s.latency).length || 0
                  ) || '--'}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys by Category */}
      <div className="space-y-6">
        {Object.entries(categorizedProviders).map(([category, providers]) => 
          providers.length > 0 && (
            <div key={category}>
              <h4 className="text-md font-medium mb-3 flex items-center gap-2">
                <span>{category}</span>
                <Badge variant="outline">{providers.length} providers</Badge>
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {providers.map(provider => {
                  const status = apiKeyStatuses[provider.id];
                  const apiKey = getApiKey(provider.id);
                  
                  return (
                    <Card key={provider.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{provider.icon}</span>
                            <div>
                              <CardTitle className="text-sm">{provider.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {provider.models.length} models available
                              </CardDescription>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {status?.isValidating && (
                              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            )}
                            
                            {status?.isValid ? (
                              <Badge className="bg-green-500">
                                <Check className="h-3 w-3 mr-1" />
                                Valid
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <X className="h-3 w-3 mr-1" />
                                {apiKey ? 'Invalid' : 'Missing'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        {apiKey && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">API Key</Label>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => toggleApiKeyVisibility(provider.id)}
                                >
                                  {showApiKey[provider.id] ? (
                                    <EyeOff className="h-3 w-3" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleRemoveApiKey(provider.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                            
                            <div className="font-mono text-xs bg-muted p-2 rounded">
                              {showApiKey[provider.id] ? apiKey.key : maskApiKey(apiKey.key)}
                            </div>
                          </div>
                        )}
                        
                        {status?.latency && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Zap className="h-3 w-3" />
                            <span>Response time: {status.latency}ms</span>
                          </div>
                        )}
                        
                        {status?.error && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              {status.error}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => window.open(provider.website, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Get API Key
                          </Button>
                          
                          {apiKey && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => validateApiKey(provider.id, apiKey.key)}
                              disabled={status?.isValidating}
                            >
                              {status?.isValidating ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <Shield className="h-3 w-3 mr-1" />
                              )}
                              Test Key
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>To start using AI providers, you'll need to obtain API keys from their respective platforms:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>OpenAI:</strong> Visit platform.openai.com to get your API key</li>
              <li><strong>Anthropic:</strong> Sign up at console.anthropic.com</li>
              <li><strong>Google:</strong> Get your key from ai.google.dev</li>
              <li><strong>Groq:</strong> Fast inference at console.groq.com</li>
              <li><strong>Others:</strong> Click "Get API Key" on each provider card</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              💡 API keys are stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}