import React, { useState } from 'react';
import { useProvider, PROVIDERS } from '../contexts/ProviderContext';
import { providerManager } from '../services/ai/provider-manager';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Play, 
  Check, 
  X, 
  Loader2, 
  AlertTriangle, 
  Clock,
  Zap,
  Shield,
  Eye,
  RefreshCw
} from 'lucide-react';

interface TestResult {
  provider: string;
  model: string;
  status: 'pending' | 'running' | 'success' | 'error';
  latency?: number;
  error?: string;
  response?: string;
}

export function ProviderTestSuite() {
  const { getApiKey, hasValidApiKey } = useProvider();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [testProgress, setTestProgress] = useState(0);

  // Get providers that have valid API keys
  const availableProviders = PROVIDERS.filter(p => 
    p.requiresApiKey ? hasValidApiKey(p.id) : true
  );

  // Initialize test suite
  const initializeTests = () => {
    const tests: TestResult[] = [];
    
    availableProviders.forEach(provider => {
      // Test with the first model of each provider
      const firstModel = provider.models[0];
      if (firstModel) {
        tests.push({
          provider: provider.id,
          model: firstModel.id,
          status: 'pending'
        });
      }
    });
    
    setTestResults(tests);
    setSelectedProviders(availableProviders.map(p => p.id));
  };

  // Run single provider test
  const runProviderTest = async (test: TestResult): Promise<TestResult> => {
    const provider = PROVIDERS.find(p => p.id === test.provider);
    if (!provider) {
      return { ...test, status: 'error', error: 'Provider not found' };
    }

    const apiKey = getApiKey(test.provider);
    const startTime = Date.now();

    try {
      // Update status to running
      setTestResults(prev => prev.map(t => 
        t.provider === test.provider && t.model === test.model 
          ? { ...t, status: 'running' }
          : t
      ));

      const response = await providerManager.chat({
        provider: test.provider,
        model: test.model,
        apiKey: apiKey?.key,
        messages: [
          {
            role: 'user',
            content: 'Hello! Please respond with exactly "Test successful" to verify the integration.'
          }
        ],
        temperature: 0,
        maxTokens: 50
      });

      const latency = Date.now() - startTime;
      
      return {
        ...test,
        status: 'success',
        latency,
        response: response.message.content
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        ...test,
        status: 'error',
        latency,
        error: (error as Error).message
      };
    }
  };

  // Run all tests
  const runAllTests = async () => {
    if (testResults.length === 0) {
      initializeTests();
      return;
    }

    setIsRunning(true);
    setTestProgress(0);

    const testsToRun = testResults.filter(test => 
      selectedProviders.includes(test.provider)
    );

    let completedTests = 0;
    
    // Run tests sequentially to avoid rate limiting
    for (const test of testsToRun) {
      const result = await runProviderTest(test);
      
      setTestResults(prev => prev.map(t => 
        t.provider === result.provider && t.model === result.model 
          ? result 
          : t
      ));
      
      completedTests++;
      setTestProgress((completedTests / testsToRun.length) * 100);
      
      // Small delay between tests to be respectful to APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsRunning(false);
  };

  // Toggle provider selection
  const toggleProvider = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  // Get status icon
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  // Calculate statistics
  const stats = {
    total: testResults.length,
    success: testResults.filter(t => t.status === 'success').length,
    error: testResults.filter(t => t.status === 'error').length,
    avgLatency: testResults
      .filter(t => t.latency)
      .reduce((acc, t) => acc + (t.latency || 0), 0) / 
      testResults.filter(t => t.latency).length || 0
  };

  React.useEffect(() => {
    initializeTests();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Provider Integration Tests</h3>
          <p className="text-sm text-muted-foreground">
            Test real API integration with all configured providers
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={initializeTests}
            disabled={isRunning}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            onClick={runAllTests}
            disabled={isRunning || selectedProviders.length === 0}
            className="gap-2"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </div>
      </div>

      {/* Progress */}
      {isRunning && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Running tests...</span>
            <span>{Math.round(testProgress)}%</span>
          </div>
          <Progress value={testProgress} className="w-full" />
        </div>
      )}

      {/* Statistics */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Tests</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Successful</p>
                  <p className="text-2xl font-bold text-green-600">{stats.success}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{stats.error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Avg Latency</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {Math.round(stats.avgLatency) || '--'}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Provider Selection */}
      {availableProviders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Select Providers to Test
            </CardTitle>
            <CardDescription>
              Choose which providers to include in the test suite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableProviders.map(provider => (
                <label
                  key={provider.id}
                  className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedProviders.includes(provider.id)}
                    onChange={() => toggleProvider(provider.id)}
                    className="rounded"
                  />
                  <span className="text-lg">{provider.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium">{provider.name}</span>
                    <div className="text-xs text-muted-foreground">
                      {provider.models.length} models
                    </div>
                  </div>
                  {hasValidApiKey(provider.id) && (
                    <Badge variant="default" className="text-xs">
                      ✓
                    </Badge>
                  )}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Real API integration test results for each provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map(test => {
                const provider = PROVIDERS.find(p => p.id === test.provider);
                const model = provider?.models.find(m => m.id === test.model);
                
                return (
                  <div
                    key={`${test.provider}-${test.model}`}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{provider?.icon}</span>
                          <span className="font-medium">{provider?.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {model?.name}
                          </Badge>
                        </div>
                        
                        {test.response && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Response: {test.response.substring(0, 50)}...
                          </div>
                        )}
                        
                        {test.error && (
                          <div className="text-xs text-red-500 mt-1">
                            Error: {test.error}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {test.latency && (
                        <Badge variant="secondary" className="text-xs">
                          {test.latency}ms
                        </Badge>
                      )}
                      
                      <Badge 
                        variant={
                          test.status === 'success' ? 'default' : 
                          test.status === 'error' ? 'destructive' : 'outline'
                        }
                        className="text-xs"
                      >
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No API Keys Warning */}
      {availableProviders.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No providers with valid API keys found. Please add API keys in the settings to run integration tests.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}