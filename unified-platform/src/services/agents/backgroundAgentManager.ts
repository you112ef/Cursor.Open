// Background Agent System
export interface BackgroundTask {
  id: string;
  type: 'analysis' | 'refactor' | 'search' | 'generation';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BackgroundAgent {
  id: string;
  name: string;
  status: 'idle' | 'busy';
  currentTask?: string;
  tasksCompleted: number;
}

export class BackgroundAgentManager {
  private agents: BackgroundAgent[] = [];
  private taskQueue: BackgroundTask[] = [];
  private activeTasks: Map<string, BackgroundTask> = new Map();
  private maxAgents: number = 3;
  private listeners: Set<(tasks: BackgroundTask[]) => void> = new Set();

  constructor() {
    // Initialize default agents
    for (let i = 0; i < this.maxAgents; i++) {
      this.agents.push({
        id: `agent-${i + 1}`,
        name: `Background Agent ${i + 1}`,
        status: 'idle',
        tasksCompleted: 0,
      });
    }
  }

  // Add task to queue
  queueTask(task: Omit<BackgroundTask, 'id' | 'status' | 'progress' | 'createdAt' | 'updatedAt'>): string {
    const newTask: BackgroundTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.taskQueue.push(newTask);
    this.processQueue();
    this.notifyListeners();
    
    return newTask.id;
  }

  // Process task queue
  private async processQueue() {
    const idleAgent = this.agents.find(agent => agent.status === 'idle');
    const pendingTask = this.taskQueue.find(task => task.status === 'pending');

    if (idleAgent && pendingTask) {
      await this.assignTask(idleAgent, pendingTask);
    }
  }

  // Assign task to agent
  private async assignTask(agent: BackgroundAgent, task: BackgroundTask) {
    agent.status = 'busy';
    agent.currentTask = task.id;
    
    task.status = 'running';
    task.updatedAt = new Date();
    
    this.activeTasks.set(task.id, task);
    this.notifyListeners();

    try {
      const result = await this.executeTask(task);
      
      task.status = 'completed';
      task.progress = 100;
      task.result = result;
      task.updatedAt = new Date();
      
      agent.tasksCompleted++;
    } catch (error) {
      task.status = 'failed';
      task.error = (error as Error).message;
      task.updatedAt = new Date();
    } finally {
      agent.status = 'idle';
      agent.currentTask = undefined;
      
      this.activeTasks.delete(task.id);
      this.notifyListeners();
      
      // Process next task in queue
      setTimeout(() => this.processQueue(), 100);
    }
  }

  // Execute task based on type
  private async executeTask(task: BackgroundTask): Promise<string> {
    // Simulate task execution delay
    const delay = 2000 + Math.random() * 3000; // 2-5 seconds
    
    // Update progress periodically
    const progressInterval = setInterval(() => {
      if (task.status === 'running') {
        task.progress = Math.min(task.progress + Math.random() * 20, 95);
        task.updatedAt = new Date();
        this.notifyListeners();
      }
    }, 500);

    await new Promise(resolve => setTimeout(resolve, delay));
    clearInterval(progressInterval);

    // Simulate task results based on type
    switch (task.type) {
      case 'analysis':
        return this.generateAnalysisResult(task.description);
      
      case 'refactor':
        return this.generateRefactorResult(task.description);
        
      case 'search':
        return this.generateSearchResult(task.description);
        
      case 'generation':
        return this.generateCodeResult(task.description);
        
      default:
        return `Task completed: ${task.description}`;
    }
  }

  private generateAnalysisResult(description: string): string {
    return `## Code Analysis Complete

**Task:** ${description}

### Findings:
- **Performance Issues:** Found 2 potential bottlenecks
- **Code Quality:** Overall score 85/100
- **Security:** No critical vulnerabilities detected
- **Best Practices:** 3 recommendations available

### Recommendations:
1. Consider using React.memo for expensive components
2. Optimize bundle size by removing unused dependencies
3. Add error boundaries for better error handling

*Analysis completed by background agent*`;
  }

  private generateRefactorResult(description: string): string {
    return `## Refactoring Complete

**Task:** ${description}

### Changes Applied:
- Extracted 3 reusable components
- Improved TypeScript type definitions
- Optimized import statements
- Updated documentation

### Files Modified:
- \`src/components/Chat.tsx\`
- \`src/contexts/ProviderContext.tsx\` 
- \`src/services/ai/aiService.ts\`

### Impact:
- Code maintainability: +25%
- Bundle size: -8%
- Type safety: Improved

*Refactoring completed by background agent*`;
  }

  private generateSearchResult(description: string): string {
    return `## Search Results

**Query:** ${description}

### Code Symbols Found:
1. **useState** - React hook (15 occurrences)
   - File: Chat.tsx, Line 45
   - File: ProviderContext.tsx, Line 187

2. **useProvider** - Custom hook (8 occurrences)
   - File: ProviderSelector.tsx, Line 23
   - File: Chat.tsx, Line 38

3. **aiService** - Service instance (12 occurrences)
   - File: Chat.tsx, Line 123
   - File: aiService.ts, Line 185

### Documentation Links:
- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://typescriptlang.org/docs)

*Search completed by background agent*`;
  }

  private generateCodeResult(description: string): string {
    return `## Code Generation Complete

**Request:** ${description}

### Generated Component:

\`\`\`tsx
import React, { useState } from 'react';
import { Button } from './ui/button';

interface GeneratedComponentProps {
  title: string;
  onAction: () => void;
}

export function GeneratedComponent({ title, onAction }: GeneratedComponentProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Button 
        onClick={() => {
          setIsActive(!isActive);
          onAction();
        }}
        variant={isActive ? 'default' : 'outline'}
      >
        {isActive ? 'Active' : 'Inactive'}
      </Button>
    </div>
  );
}
\`\`\`

### Usage:
\`\`\`tsx
<GeneratedComponent 
  title="My Component" 
  onAction={() => console.log('Action triggered')} 
/>
\`\`\`

*Code generation completed by background agent*`;
  }

  // Get all tasks (active and completed)
  getAllTasks(): BackgroundTask[] {
    const allTasks = [
      ...this.taskQueue,
      ...Array.from(this.activeTasks.values()),
    ];
    
    return allTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get active tasks only
  getActiveTasks(): BackgroundTask[] {
    return Array.from(this.activeTasks.values());
  }

  // Get agent status
  getAgents(): BackgroundAgent[] {
    return [...this.agents];
  }

  // Clear completed tasks
  clearCompletedTasks(): void {
    this.taskQueue = this.taskQueue.filter(task => 
      task.status !== 'completed' && task.status !== 'failed'
    );
    this.notifyListeners();
  }

  // Add listener for task updates
  addListener(callback: (tasks: BackgroundTask[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify listeners of task updates
  private notifyListeners(): void {
    const tasks = this.getAllTasks();
    this.listeners.forEach(listener => listener(tasks));
  }

  // Set maximum number of agents
  setMaxAgents(max: number): void {
    this.maxAgents = Math.max(1, Math.min(10, max));
    
    // Adjust agent count
    while (this.agents.length < this.maxAgents) {
      this.agents.push({
        id: `agent-${this.agents.length + 1}`,
        name: `Background Agent ${this.agents.length + 1}`,
        status: 'idle',
        tasksCompleted: 0,
      });
    }
    
    while (this.agents.length > this.maxAgents) {
      const agent = this.agents.pop();
      if (agent?.status === 'busy') {
        // Don't remove busy agents
        this.agents.push(agent);
        break;
      }
    }
  }
}

// Singleton instance
export const backgroundAgentManager = new BackgroundAgentManager();