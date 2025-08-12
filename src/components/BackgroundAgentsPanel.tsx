import React, { useState, useEffect } from 'react';
import { backgroundAgentManager, BackgroundTask, BackgroundAgent } from '../services/agents/backgroundAgentManager';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import {
  Bot,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Activity,
  Plus,
} from 'lucide-react';

export function BackgroundAgentsPanel() {
  const [tasks, setTasks] = useState<BackgroundTask[]>([]);
  const [agents, setAgents] = useState<BackgroundAgent[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initial load
    setTasks(backgroundAgentManager.getAllTasks());
    setAgents(backgroundAgentManager.getAgents());

    // Subscribe to updates
    const unsubscribe = backgroundAgentManager.addListener((updatedTasks) => {
      setTasks(updatedTasks);
      setAgents(backgroundAgentManager.getAgents());
    });

    return unsubscribe;
  }, []);

  const getStatusIcon = (status: BackgroundTask['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'running':
        return <Play className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: BackgroundTask['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'running':
        return 'default';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const addSampleTask = (type: BackgroundTask['type']) => {
    const descriptions = {
      analysis: 'Analyze code quality and performance',
      refactor: 'Optimize component structure',
      search: 'Find usage of React hooks',
      generation: 'Generate utility component',
    };

    backgroundAgentManager.queueTask({
      type,
      description: descriptions[type],
    });
  };

  const clearCompleted = () => {
    backgroundAgentManager.clearCompletedTasks();
  };

  const activeTasks = tasks.filter(task => task.status === 'running');
  const completedTasks = tasks.filter(task => task.status === 'completed' || task.status === 'failed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 relative">
          <Bot className="h-4 w-4" />
          {activeTasks.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center">
              {activeTasks.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Background Agents
            <Badge variant="outline">
              {agents.filter(a => a.status === 'busy').length}/{agents.length} Active
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="tasks" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">
              Tasks ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="agents">
              Agents ({agents.length})
            </TabsTrigger>
            <TabsTrigger value="add">
              Add Task
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Badge variant="outline">
                  Active: {activeTasks.length}
                </Badge>
                <Badge variant="outline">
                  Pending: {pendingTasks.length}
                </Badge>
                <Badge variant="outline">
                  Completed: {completedTasks.length}
                </Badge>
              </div>
              
              {completedTasks.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompleted}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear Completed
                </Button>
              )}
            </div>
            
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No background tasks yet. Add a task to get started!
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <div>
                            <p className="font-medium text-sm">{task.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {task.type} • {task.createdAt.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(task.status) as any}>
                          {task.status}
                        </Badge>
                      </div>
                      
                      {task.status === 'running' && (
                        <div className="space-y-1">
                          <Progress value={task.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {Math.round(task.progress)}% complete
                          </p>
                        </div>
                      )}
                      
                      {task.result && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          <div className="font-medium mb-1">Result:</div>
                          <div className="whitespace-pre-wrap text-muted-foreground">
                            {task.result.length > 200 
                              ? task.result.substring(0, 200) + '...' 
                              : task.result
                            }
                          </div>
                        </div>
                      )}
                      
                      {task.error && (
                        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
                          <div className="font-medium mb-1 text-destructive">Error:</div>
                          <div className="text-destructive/80">{task.error}</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="agents" className="flex-1">
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div key={agent.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${
                          agent.status === 'busy' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
                        }`} />
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {agent.status}
                            {agent.currentTask && ` • Working on ${agent.currentTask}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {agent.tasksCompleted} completed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="add" className="flex-1">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Queue background tasks for AI agents to process:
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => addSampleTask('analysis')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">Code Analysis</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Analyze code quality, performance, and best practices
                  </p>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => addSampleTask('refactor')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4" />
                    <span className="font-medium">Refactor Code</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Optimize and improve code structure
                  </p>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => addSampleTask('search')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">Search Symbols</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Find and analyze code symbols and usage
                  </p>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => addSampleTask('generation')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Generate Code</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    Generate new components and utilities
                  </p>
                </Button>
              </div>
              
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div className="font-medium mb-1">How it works:</div>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Tasks are queued and processed by background agents</li>
                  <li>• Multiple agents work in parallel for efficiency</li>
                  <li>• Results are saved and can be reviewed anytime</li>
                  <li>• Failed tasks can be retried automatically</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}