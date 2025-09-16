export interface Agent {
  id: string
  name: string
  description: string
  capabilities: string[]
}

export const AGENTS: Agent[] = [
  {
    id: 'claude',
    name: 'Claude Agent',
    description: 'Anthropic\'s Claude for complex reasoning and code generation',
    capabilities: ['code-generation', 'reasoning', 'documentation', 'debugging']
  },
  {
    id: 'cursor',
    name: 'Cursor Agent',
    description: 'AI-powered code editor with intelligent completions',
    capabilities: ['code-completion', 'refactoring', 'navigation', 'editing']
  },
  {
    id: 'aider',
    name: 'Aider Agent',
    description: 'AI pair programmer that can edit code in your local repo',
    capabilities: ['code-editing', 'git-integration', 'local-development', 'pair-programming']
  },
  {
    id: 'gpt-engineer',
    name: 'GPT Engineer Agent',
    description: 'Generates entire codebases from natural language descriptions',
    capabilities: ['full-stack-generation', 'architecture', 'project-setup', 'boilerplate']
  },
  {
    id: 'smithery',
    name: 'Smithery Agent',
    description: 'AI agent for building and deploying applications',
    capabilities: ['deployment', 'infrastructure', 'devops', 'automation']
  },
  {
    id: 'cline',
    name: 'Cline Agent',
    description: 'Command-line AI assistant for terminal operations',
    capabilities: ['terminal-commands', 'file-operations', 'system-management', 'automation']
  },
  {
    id: 'mcp-server',
    name: 'MCP Server Agent',
    description: 'Model Context Protocol server for tool integration',
    capabilities: ['tool-integration', 'context-management', 'api-connections', 'data-processing']
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI Agent',
    description: 'Google\'s Gemini for command-line assistance',
    capabilities: ['cli-automation', 'script-generation', 'system-tasks', 'data-analysis']
  }
]

export interface AgentCommand {
  command: string
  agent: string
  output: string[]
  duration: number
}

export const AGENT_COMMANDS: Record<string, AgentCommand[]> = {
  'setup-database': [
    {
      command: 'npm install @supabase/supabase-js',
      agent: 'claude',
      output: [
        'Installing Supabase client library...',
        '✓ @supabase/supabase-js@2.38.0 installed',
        'Creating database configuration...',
        '✓ Database connection established'
      ],
      duration: 2000
    }
  ],
  'add-auth': [
    {
      command: 'npm install @clerk/nextjs',
      agent: 'claude',
      output: [
        'Installing Clerk authentication...',
        '✓ @clerk/nextjs@4.29.0 installed',
        'Configuring authentication middleware...',
        '✓ Auth routes configured',
        '✓ User management enabled'
      ],
      duration: 2500
    }
  ],
  'add-cache': [
    {
      command: 'npm install @upstash/redis',
      agent: 'cursor',
      output: [
        'Installing Upstash Redis client...',
        '✓ @upstash/redis@1.25.0 installed',
        'Setting up Redis connection...',
        '✓ Cache layer configured',
        '✓ Session storage enabled'
      ],
      duration: 1800
    }
  ],
  'add-monitoring': [
    {
      command: 'npm install @sentry/nextjs',
      agent: 'aider',
      output: [
        'Installing Sentry monitoring...',
        '✓ @sentry/nextjs@7.80.0 installed',
        'Configuring error tracking...',
        '✓ Performance monitoring enabled',
        '✓ Error reporting configured'
      ],
      duration: 2200
    }
  ],
  'deploy-app': [
    {
      command: 'vercel --prod',
      agent: 'smithery',
      output: [
        'Building application...',
        '✓ Build completed successfully',
        'Deploying to Vercel...',
        '✓ Deployment successful',
        '🌐 Application live at: https://your-app.vercel.app'
      ],
      duration: 5000
    }
  ]
}

export function parseCommand(input: string): { agent: string; command: string } {
  const trimmed = input.trim()
  
  // Check for agent-specific commands
  for (const agent of AGENTS) {
    if (trimmed.startsWith(`/${agent.id}`)) {
      return {
        agent: agent.id,
        command: trimmed.substring(agent.id.length + 1).trim()
      }
    }
  }
  
  // Auto-detect agent based on command content
  const lowerInput = trimmed.toLowerCase()
  
  if (lowerInput.includes('database') || lowerInput.includes('supabase')) {
    return { agent: 'claude', command: trimmed }
  }
  
  if (lowerInput.includes('auth') || lowerInput.includes('login') || lowerInput.includes('user')) {
    return { agent: 'claude', command: trimmed }
  }
  
  if (lowerInput.includes('cache') || lowerInput.includes('redis') || lowerInput.includes('upstash')) {
    return { agent: 'cursor', command: trimmed }
  }
  
  if (lowerInput.includes('monitor') || lowerInput.includes('error') || lowerInput.includes('sentry')) {
    return { agent: 'aider', command: trimmed }
  }
  
  if (lowerInput.includes('deploy') || lowerInput.includes('production')) {
    return { agent: 'smithery', command: trimmed }
  }
  
  // Default to Claude for general commands
  return { agent: 'claude', command: trimmed }
}

export function getCommandWorkflow(command: string): AgentCommand[] {
  const lowerCommand = command.toLowerCase()
  
  if (lowerCommand.includes('database') || lowerCommand.includes('supabase')) {
    return AGENT_COMMANDS['setup-database']
  }
  
  if (lowerCommand.includes('auth') || lowerCommand.includes('authentication')) {
    return AGENT_COMMANDS['add-auth']
  }
  
  if (lowerCommand.includes('cache') || lowerCommand.includes('redis')) {
    return AGENT_COMMANDS['add-cache']
  }
  
  if (lowerCommand.includes('monitor') || lowerCommand.includes('error tracking')) {
    return AGENT_COMMANDS['add-monitoring']
  }
  
  if (lowerCommand.includes('deploy') || lowerCommand.includes('production')) {
    return AGENT_COMMANDS['deploy-app']
  }
  
  // Default workflow for general commands
  return [
    {
      command: 'analyzing requirements...',
      agent: 'claude',
      output: [
        'Understanding user request...',
        '✓ Requirements analyzed',
        'Planning implementation...',
        '✓ Action plan created'
      ],
      duration: 1500
    }
  ]
}