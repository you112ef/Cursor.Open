import React from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Bars3Icon, 
  CommandLineIcon, 
  ChatBubbleLeftIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

export function TitleBar() {
  const { state, toggleSidebar, toggleTerminal, toggleChat } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { activeProject, openFiles, activeFileId, layout } = state;

  const activeFile = openFiles.find(f => f.id === activeFileId);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="w-4 h-4" />;
      case 'dark':
        return <MoonIcon className="w-4 h-4" />;
      case 'auto':
        return <ComputerDesktopIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="toolbar h-10 flex items-center px-3 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 select-none">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            layout.sidebar.visible ? 'text-blue-600' : 'text-gray-500'
          }`}
          title="Toggle Sidebar"
        >
          <Bars3Icon className="w-4 h-4" />
        </button>

        {/* Project name */}
        {activeProject && (
          <>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {activeProject.name}
            </span>
          </>
        )}
      </div>

      {/* Center section - Active file */}
      <div className="flex-1 flex justify-center">
        {activeFile && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{activeFile.name}</span>
            {activeFile.isDirty && (
              <div className="w-2 h-2 bg-orange-400 rounded-full" title="Unsaved changes" />
            )}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-1">
        {/* Terminal toggle */}
        <button
          onClick={toggleTerminal}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            layout.terminal.visible ? 'text-blue-600' : 'text-gray-500'
          }`}
          title="Toggle Terminal"
        >
          <CommandLineIcon className="w-4 h-4" />
        </button>

        {/* Chat toggle */}
        <button
          onClick={toggleChat}
          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            layout.chat.visible ? 'text-blue-600' : 'text-gray-500'
          }`}
          title="Toggle AI Chat"
        >
          <ChatBubbleLeftIcon className="w-4 h-4" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          title={`Theme: ${theme}`}
        >
          {getThemeIcon()}
        </button>

        {/* File count indicator */}
        {openFiles.length > 0 && (
          <>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {openFiles.length} file{openFiles.length !== 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
}