# AI Agent Integration Platform

A fully functional, interactive web application that replicates the core interface and functionality of an AI-powered platform where users can discover and integrate third-party services and interact with a multi-agent CLI system.

## Features

### 🎯 Core Functionality
- **Service Integration**: Click any "+ Add [ServiceName]" button to trigger realistic integration processes
- **Multi-Agent CLI System**: Interact with 8 different AI agents through natural language commands
- **Real-time Terminal**: Watch agents execute commands with live terminal output
- **State Management**: Track added services and agent activities

### 🤖 Available AI Agents
- **Claude Agent**: Complex reasoning and code generation
- **Cursor Agent**: AI-powered code editor with intelligent completions
- **Aider Agent**: AI pair programmer for local development
- **GPT Engineer Agent**: Generates entire codebases from descriptions
- **Smithery Agent**: Building and deploying applications
- **Cline Agent**: Command-line AI assistant
- **MCP Server Agent**: Model Context Protocol for tool integration
- **Gemini CLI Agent**: Google's Gemini for CLI assistance

### 🛠️ Supported Services
- **Supabase**: Open source Firebase alternative with Postgres, Auth, Storage
- **Upstash**: Serverless Redis and Kafka for modern applications
- **Clerk**: Complete user management and authentication solution
- **Sentry**: Error monitoring and performance tracking platform

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-agent-platform
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Service Integration
1. Browse the available services on the main page
2. Click "+ Add [ServiceName]" to integrate a service
3. Watch the integration process with toast notifications
4. Services will be marked as "Added" once integrated

### AI Agent Commands
1. Use the "Tell Sam what you want" input field
2. Try natural language commands like:
   - "Set up a database"
   - "Add authentication"
   - "Deploy the application"
   - "/claude help me with React"
   - "/cursor refactor this code"

3. Watch the terminal for real-time agent execution
4. Agents will automatically add relevant services based on your commands

### Example Commands
- `Set up a database` → Triggers Supabase integration
- `Add user authentication` → Triggers Clerk integration  
- `Add caching layer` → Triggers Upstash integration
- `Monitor errors` → Triggers Sentry integration
- `/claude create a todo app` → Uses Claude agent for code generation
- `/smithery deploy to production` → Uses Smithery agent for deployment

## Technical Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI components
- **State Management**: Zustand
- **Icons**: Lucide React
- **Terminal**: Custom terminal component with animations

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Shadcn/UI components
│   ├── ServiceCard.tsx # Service integration cards
│   ├── CLIInput.tsx    # Command input interface
│   └── Terminal.tsx    # Terminal display component
├── lib/                # Utility libraries
│   ├── agents.ts       # Agent definitions and workflows
│   └── utils.ts        # Common utilities
└── store/              # Zustand state management
    └── useStore.ts     # Global application state
```

## Agent Workflows

The platform includes pre-defined workflows for common tasks:

- **Database Setup**: Installs Supabase client, configures connection
- **Authentication**: Sets up Clerk with middleware and routes
- **Caching**: Configures Upstash Redis with session storage
- **Monitoring**: Installs Sentry with error tracking
- **Deployment**: Builds and deploys to Vercel

## Customization

### Adding New Agents
1. Update `src/lib/agents.ts` with new agent definition
2. Add agent-specific workflows in `AGENT_COMMANDS`
3. Update command parsing logic in `parseCommand()`

### Adding New Services
1. Add service to `initialServices` in `src/store/useStore.ts`
2. Create service card in `src/components/ServiceCard.tsx`
3. Add integration workflow in `src/lib/agents.ts`

## Deployment

The application can be deployed to any platform that supports Next.js:

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by modern AI agent platforms
- Built with Next.js and Tailwind CSS
- Uses Shadcn/UI for beautiful components
- Powered by Zustand for state management