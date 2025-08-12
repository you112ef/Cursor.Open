import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { ProviderSelector } from './ProviderSelector';
import { 
  PanelLeft, 
  Terminal as TerminalIcon, 
  MessageSquare,
  Sun,
  Moon,
  Settings,
  Search,
  Wrench
} from 'lucide-react';

export function TitleBar() {
  const { state, dispatch } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { layout } = state;

  return (
    <div className="h-12 bg-background border-b border-border flex items-center justify-between px-4 flex-shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-2">
        <div className="text-lg font-semibold text-foreground">
          Cursor Open
        </div>
        
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="h-8 w-8 p-0"
          >
            <PanelLeft className={`h-4 w-4 ${layout.sidebar.visible ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: 'TOGGLE_TERMINAL' })}
            className="h-8 w-8 p-0"
          >
            <TerminalIcon className={`h-4 w-4 ${layout.terminal.visible ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}
            className="h-8 w-8 p-0"
          >
            <MessageSquare className={`h-4 w-4 ${layout.chat.visible ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: 'TOGGLE_TOOLS' })}
            className="h-8 w-8 p-0"
            title="Toggle Cursor Tools"
          >
            <Wrench className={`h-4 w-4 ${layout.tools.visible ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full h-8 pl-10 pr-4 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Provider Selector */}
        <ProviderSelector />
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-8 w-8 p-0"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}