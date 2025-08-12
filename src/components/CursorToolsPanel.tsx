import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Search, 
  Edit3, 
  Play, 
  Link, 
  Settings, 
  FileText, 
  Folder, 
  Code, 
  Globe, 
  Terminal,
  Trash2,
  Shield,
  RefreshCw,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { cursorToolRegistry, parseToolMentions, type Tool, type ToolRequest, type ToolResult } from '../services/tools/cursorToolRegistry';

interface ToolExecution {
  id: string;
  tool: string;
  query: string;
  startTime: Date;
  endTime?: Date;
  result?: ToolResult;
  status: 'running' | 'completed' | 'failed';
}

const CursorToolsPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'search' | 'edit' | 'run' | 'mcp' | 'advanced'>('search');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolQuery, setToolQuery] = useState('');
  const [toolParams, setToolParams] = useState('{}');
  const [executions, setExecutions] = useState<ToolExecution[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [toolsStats, setToolsStats] = useState<any>(null);

  // Load initial stats
  useEffect(() => {
    setToolsStats(cursorToolRegistry.getToolStatistics());
  }, []);

  const categoryIcons = {
    search: Search,
    edit: Edit3,
    run: Play,
    mcp: Link,
    advanced: Settings
  };

  const toolIcons: Record<string, any> = {
    read: FileText,
    list: Folder,
    codebase: Code,
    grep: Search,
    search: Search,
    web: Globe,
    rules: FileText,
    edit: Edit3,
    delete: Trash2,
    terminal: Terminal,
    mcp: Link,
    apply: RefreshCw,
    run: Play,
    guard: Shield,
    fix: Zap
  };

  const handleToolExecution = async (tool: Tool, query: string, params: any = {}) => {
    if (!tool || !query.trim()) return;

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const execution: ToolExecution = {
      id: executionId,
      tool: tool.name,
      query: query,
      startTime: new Date(),
      status: 'running'
    };

    setExecutions(prev => [execution, ...prev]);
    setIsExecuting(true);

    try {
      const request: ToolRequest = {
        type: tool.name,
        query,
        params: typeof params === 'string' ? JSON.parse(params) : params
      };

      const result = await cursorToolRegistry.executeTool(request);
      
      setExecutions(prev => prev.map(exec => 
        exec.id === executionId 
          ? { 
              ...exec, 
              endTime: new Date(), 
              result, 
              status: result.success !== false ? 'completed' : 'failed' 
            }
          : exec
      ));
    } catch (error) {
      setExecutions(prev => prev.map(exec => 
        exec.id === executionId 
          ? { 
              ...exec, 
              endTime: new Date(), 
              result: {
                type: tool.name,
                content: `Execution failed: ${(error as Error).message}`,
                success: false,
                error: (error as Error).message
              },
              status: 'failed' 
            }
          : exec
      ));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleQuickTool = (toolName: string, query: string) => {
    const tool = cursorToolRegistry.getTool(toolName);
    if (tool) {
      handleToolExecution(tool, query);
    }
  };

  const handleBatchExecution = async (text: string) => {
    const parsed = parseToolMentions(text);
    
    if (parsed.tools.length === 0) {
      return;
    }

    setIsExecuting(true);
    
    try {
      for (const toolMention of parsed.tools) {
        const tool = cursorToolRegistry.getTool(toolMention.type);
        if (tool) {
          await new Promise(resolve => setTimeout(resolve, 200)); // Prevent overwhelming
          await handleToolExecution(tool, toolMention.query);
        }
      }
    } catch (error) {
      console.error('Batch execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleTool = (toolName: string) => {
    cursorToolRegistry.toggleTool(toolName);
    setToolsStats(cursorToolRegistry.getToolStatistics());
  };

  const clearExecutions = () => {
    setExecutions([]);
  };

  const getExecutionDuration = (execution: ToolExecution): string => {
    if (!execution.endTime) return 'Running...';
    const duration = execution.endTime.getTime() - execution.startTime.getTime();
    return `${duration}ms`;
  };

  const renderToolCard = (tool: Tool) => {
    const IconComponent = toolIcons[tool.name] || Settings;
    const isEnabled = tool.enabled;
    
    return (
      <Card 
        key={tool.name}
        className={`cursor-pointer transition-all hover:shadow-md ${
          selectedTool?.name === tool.name ? 'border-primary bg-primary/5' : ''
        } ${!isEnabled ? 'opacity-50' : ''}`}
        onClick={() => setSelectedTool(tool)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4" />
              <span className="font-medium">{tool.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isEnabled ? 'default' : 'secondary'} className="text-xs">
                {isEnabled ? 'ON' : 'OFF'}
              </Badge>
              <Switch
                checked={isEnabled}
                onCheckedChange={() => toggleTool(tool.name)}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
          <div className="flex gap-1 mt-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!isEnabled}
              onClick={(e) => {
                e.stopPropagation();
                if (toolQuery) {
                  handleToolExecution(tool, toolQuery);
                }
              }}
            >
              Execute
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderExecutionResult = (execution: ToolExecution) => {
    const IconComponent = execution.status === 'completed' ? CheckCircle :
                         execution.status === 'failed' ? XCircle : Clock;
    
    const statusColor = execution.status === 'completed' ? 'text-green-500' :
                       execution.status === 'failed' ? 'text-red-500' : 'text-yellow-500';

    return (
      <Card key={execution.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className={`h-4 w-4 ${statusColor}`} />
              <CardTitle className="text-sm">
                {execution.tool} • {execution.query.substring(0, 50)}
                {execution.query.length > 50 ? '...' : ''}
              </CardTitle>
            </div>
            <div className="text-xs text-muted-foreground">
              {getExecutionDuration(execution)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {execution.result && (
            <div className="space-y-2">
              <div className="text-sm bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-xs">
                  {execution.result.content}
                </pre>
              </div>
              {execution.result.metadata && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Metadata
                  </summary>
                  <pre className="mt-2 bg-muted p-2 rounded text-xs">
                    {JSON.stringify(execution.result.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
          {execution.status === 'running' && (
            <div className="flex items-center gap-2">
              <Progress value={undefined} className="flex-1" />
              <span className="text-xs text-muted-foreground">Executing...</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Cursor Tools</h2>
        
        {/* Stats Overview */}
        {toolsStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            <div className="text-center p-2 bg-muted rounded">
              <div className="text-lg font-bold">{toolsStats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">{toolsStats.enabled}</div>
              <div className="text-xs text-muted-foreground">Enabled</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="text-lg font-bold text-red-600">{toolsStats.disabled}</div>
              <div className="text-xs text-muted-foreground">Disabled</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">{executions.filter(e => e.status === 'completed').length}</div>
              <div className="text-xs text-muted-foreground">Executed</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <div className="text-lg font-bold text-yellow-600">{executions.filter(e => e.status === 'running').length}</div>
              <div className="text-xs text-muted-foreground">Running</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickTool('read', 'package.json')}
            disabled={isExecuting}
          >
            <FileText className="h-3 w-3 mr-1" />
            Read File
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickTool('list', '.')}
            disabled={isExecuting}
          >
            <Folder className="h-3 w-3 mr-1" />
            List Dir
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickTool('terminal', 'pwd')}
            disabled={isExecuting}
          >
            <Terminal className="h-3 w-3 mr-1" />
            Terminal
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickTool('fix', 'all')}
            disabled={isExecuting}
          >
            <Zap className="h-3 w-3 mr-1" />
            Auto-Fix
          </Button>
        </div>

        {/* Batch Tool Execution */}
        <div className="space-y-2">
          <Textarea
            placeholder="Enter commands with @tool mentions, e.g., '@read package.json @list src @terminal npm --version'"
            value={toolQuery}
            onChange={(e) => setToolQuery(e.target.value)}
            className="min-h-[60px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => handleBatchExecution(toolQuery)}
              disabled={isExecuting || !toolQuery.trim()}
              className="flex-1"
            >
              {isExecuting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Tools
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setToolQuery('')}
              disabled={isExecuting}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Tools List */}
        <div className="w-1/2 border-r">
          <Tabs value={activeCategory} onValueChange={(value: any) => setActiveCategory(value)}>
            <TabsList className="grid grid-cols-5 w-full">
              {Object.entries(categoryIcons).map(([category, IconComponent]) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  <IconComponent className="h-3 w-3 mr-1" />
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(categoryIcons).map(category => (
              <TabsContent key={category} value={category} className="mt-0">
                <ScrollArea className="h-[400px] p-2">
                  <div className="space-y-2">
                    {cursorToolRegistry.getToolsByCategory(category as any).map(renderToolCard)}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Execution Results */}
        <div className="w-1/2">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-medium">Execution History</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={clearExecutions}
                disabled={executions.length === 0}
              >
                Clear History
              </Button>
            </div>
          </div>
          
          <ScrollArea className="h-[450px] p-4">
            {executions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No tool executions yet</p>
                <p className="text-sm">Select a tool and execute it to see results</p>
              </div>
            ) : (
              <div className="space-y-2">
                {executions.map(renderExecutionResult)}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Tool Details Modal */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedTool(null)}>
          <Card className="w-96 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(toolIcons[selectedTool.name] || Settings, { className: "h-5 w-5" })}
                {selectedTool.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground">{selectedTool.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Badge variant="secondary">{selectedTool.category}</Badge>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={selectedTool.enabled}
                    onCheckedChange={() => {
                      toggleTool(selectedTool.name);
                      setSelectedTool({
                        ...selectedTool,
                        enabled: !selectedTool.enabled
                      });
                    }}
                  />
                  <span className="text-sm">{selectedTool.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium mb-2 block">Execute Tool</label>
                <Input
                  placeholder="Enter query or command"
                  value={toolQuery}
                  onChange={(e) => setToolQuery(e.target.value)}
                  className="mb-2"
                />
                <Textarea
                  placeholder="Parameters (JSON format)"
                  value={toolParams}
                  onChange={(e) => setToolParams(e.target.value)}
                  className="mb-2 min-h-[80px] font-mono text-sm"
                />
                <Button
                  className="w-full"
                  disabled={!selectedTool.enabled || !toolQuery.trim() || isExecuting}
                  onClick={() => {
                    try {
                      const params = JSON.parse(toolParams || '{}');
                      handleToolExecution(selectedTool, toolQuery, params);
                      setSelectedTool(null);
                    } catch (error) {
                      alert('Invalid JSON parameters');
                    }
                  }}
                >
                  {isExecuting ? 'Executing...' : 'Execute'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedTool(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CursorToolsPanel;