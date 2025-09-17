import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { 
  Folder, 
  FolderOpen, 
  File, 
  ChevronRight, 
  ChevronDown,
  Plus,
  FileText
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileItem[];
  isOpen?: boolean;
  content?: string;
}

// Sample file structure
const sampleFiles: FileItem[] = [
  {
    id: uuidv4(),
    name: 'src',
    path: '/src',
    type: 'directory',
    isOpen: true,
    children: [
      {
        id: uuidv4(),
        name: 'components',
        path: '/src/components',
        type: 'directory',
        isOpen: false,
        children: [
          {
            id: uuidv4(),
            name: 'App.tsx',
            path: '/src/components/App.tsx',
            type: 'file',
          },
          {
            id: uuidv4(),
            name: 'Header.tsx',
            path: '/src/components/Header.tsx',
            type: 'file',
          },
        ],
      },
      {
        id: uuidv4(),
        name: 'utils',
        path: '/src/utils',
        type: 'directory',
        isOpen: false,
        children: [
          {
            id: uuidv4(),
            name: 'helpers.ts',
            path: '/src/utils/helpers.ts',
            type: 'file',
          },
        ],
      },
      {
        id: uuidv4(),
        name: 'index.ts',
        path: '/src/index.ts',
        type: 'file',
      },
    ],
  },
  {
    id: uuidv4(),
    name: 'package.json',
    path: '/package.json',
    type: 'file',
  },
  {
    id: uuidv4(),
    name: 'README.md',
    path: '/README.md',
    type: 'file',
  },
];

// Sample file contents
const sampleFileContents: Record<string, string> = {
  '/src/components/App.tsx': `import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Cursor Open</h1>
        <p>A modern AI-powered code editor</p>
      </header>
    </div>
  );
}

export default App;`,
  
  '/src/components/Header.tsx': `import React from 'react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
}`,

  '/src/utils/helpers.ts': `export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`,

  '/src/index.ts': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);`,

  '/package.json': `{
  "name": "cursor-open-project",
  "version": "1.0.0",
  "description": "A sample project for Cursor Open editor",
  "main": "src/index.ts",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.9.0"
  }
}`,

  '/README.md': `# Cursor Open Project

Welcome to your new project! This is a sample project created in Cursor Open, an AI-powered code editor.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Features

- Modern React application
- TypeScript support
- Hot module reloading
- Built-in testing

## AI-Powered Development

Use the chat panel to:
- Ask questions about your code
- Get suggestions for improvements
- Generate new code snippets
- Debug issues

Happy coding! 🚀`,
};

function FileTreeItem({ 
  item, 
  level = 0, 
  onToggle, 
  onFileSelect,
  selectedFile 
}: { 
  item: FileItem; 
  level?: number; 
  onToggle: (path: string) => void;
  onFileSelect: (file: FileItem) => void;
  selectedFile: string | null;
}) {
  const isSelected = selectedFile === item.path;
  
  const handleClick = () => {
    if (item.type === 'directory') {
      onToggle(item.path);
    } else {
      onFileSelect(item);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1 px-2 hover:bg-sidebar-accent cursor-pointer text-sm ${
          isSelected ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'
        }`}
        style={{ paddingLeft: `${0.5 + level * 0.75}rem` }}
        onClick={handleClick}
      >
        {item.type === 'directory' && (
          <>
            {item.isOpen ? (
              <ChevronDown className="h-3 w-3 text-sidebar-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-sidebar-foreground" />
            )}
            {item.isOpen ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )}
          </>
        )}
        
        {item.type === 'file' && (
          <File className="h-4 w-4 text-sidebar-foreground ml-4" />
        )}
        
        <span className="truncate">{item.name}</span>
      </div>
      
      {item.type === 'directory' && item.isOpen && item.children && (
        <div>
          {item.children.map(child => (
            <FileTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              onToggle={onToggle}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { state, dispatch } = useApp();
  const [files, setFiles] = useState<FileItem[]>(sampleFiles);

  useEffect(() => {
    dispatch({ type: 'SET_FILES', payload: files });
  }, [files, dispatch]);

  const toggleDirectory = (path: string) => {
    setFiles(prevFiles => {
      const updateItem = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.path === path && item.type === 'directory') {
            return { ...item, isOpen: !item.isOpen };
          }
          if (item.children) {
            return { ...item, children: updateItem(item.children) };
          }
          return item;
        });
      };
      return updateItem(prevFiles);
    });
  };

  const handleFileSelect = (file: FileItem) => {
    const content = sampleFileContents[file.path] || `// Content for ${file.name}\n\nconsole.log('Hello from ${file.name}');`;
    dispatch({ type: 'OPEN_FILE', payload: { file, content } });
  };

  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        <h2 className="text-sm font-medium">Explorer</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <FileText className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {files.map(file => (
          <FileTreeItem
            key={file.id}
            item={file}
            onToggle={toggleDirectory}
            onFileSelect={handleFileSelect}
            selectedFile={state.selectedFile}
          />
        ))}
      </div>
    </div>
  );
}