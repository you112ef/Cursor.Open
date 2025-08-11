# Cursor Agents - AI-Powered Code Editor

A modern, AI-powered code editor inspired by Cursor, built with Electron, React, and TypeScript.

## 🚀 Features

- **AI-Powered Coding Assistant**: Integrated chat with OpenAI and Anthropic models
- **Monaco Editor**: Full-featured code editor with syntax highlighting and IntelliSense
- **File Explorer**: Intuitive file and project management
- **Integrated Terminal**: Built-in terminal with AI command suggestions
- **Modern UI**: Beautiful dark/light themes with responsive design
- **Multi-Platform**: Works on Windows, macOS, and Linux

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cursor-agents
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your AI API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## 🏃‍♂️ Development

Start the development server:
```bash
npm run dev
```

This will start both the Electron main process and the React renderer in development mode.

## 🏗️ Building

Build for production:
```bash
npm run build
```

Package the application:
```bash
# Build for current platform
npm run package

# Build for specific platforms
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

## 🧪 Testing

Run tests:
```bash
npm test              # Unit tests
npm run test:watch    # Watch mode
npm run test:e2e      # End-to-end tests
```

## 📁 Project Structure

```
cursor-agents/
├── src/
│   ├── main/              # Electron main process
│   │   ├── managers/      # Core managers (File, AI, Terminal, etc.)
│   │   ├── index.ts       # Main process entry
│   │   └── preload.ts     # Preload script
│   ├── renderer/          # React renderer process
│   │   ├── components/    # React components
│   │   ├── context/       # React contexts
│   │   ├── styles/        # CSS styles
│   │   └── App.tsx        # Main React app
│   └── shared/            # Shared types and utilities
├── assets/                # Static assets
├── build/                 # Build configuration
└── dist/                  # Build output
```

## 🎯 Key Components

### File Management
- **FileManager**: Handles file operations with watching capabilities
- **ProjectManager**: Manages project lifecycle and metadata
- **FileExplorer**: React component for file tree navigation

### AI Integration
- **AIManager**: Coordinates AI providers (OpenAI, Anthropic)
- **Chat Component**: Interactive AI chat interface
- **Code Completion**: AI-powered code suggestions

### Editor
- **Monaco Editor**: Full-featured code editor
- **Editor Tabs**: Multi-file editing with tab management
- **Syntax Highlighting**: Support for 50+ programming languages

### Terminal
- **TerminalManager**: Manages terminal sessions
- **Terminal Component**: Integrated terminal with AI assistance

## ⚙️ Configuration

The application can be configured through:

1. **Settings UI**: In-app settings panel
2. **Environment Variables**: `.env` file for API keys
3. **Config Files**: Various config files for build and development

### Key Settings

- **AI Provider**: Choose between OpenAI, Anthropic, or local models
- **Editor**: Font size, theme, tab settings, formatting options
- **Terminal**: Shell preferences, appearance settings
- **Workspace**: Layout, panel visibility, keyboard shortcuts

## 🔧 Development Scripts

```bash
npm run dev              # Start development server
npm run dev:main         # Start main process only
npm run dev:renderer     # Start renderer process only
npm run build            # Build for production
npm run build:main       # Build main process
npm run build:renderer   # Build renderer process
npm run start            # Start built application
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cursor](https://cursor.sh/) - Inspiration for this project
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor component
- [Electron](https://electronjs.org/) - Desktop app framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ by the Cursor Agents Team**