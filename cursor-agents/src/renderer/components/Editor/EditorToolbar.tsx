import React from 'react';
import { useApp } from '../../context/AppContext';

export function EditorToolbar() {
  const { state, updateLayout } = useApp();
  const { layout, openFiles, activeFileId } = state;

  const activeFile = openFiles.find(f => f.id === activeFileId);

  if (!activeFile) return null;

  const handleToggleMinimap = () => {
    updateLayout({
      editor: {
        ...layout.editor,
        minimap: !layout.editor.minimap
      }
    });
  };

  const handleToggleLineNumbers = () => {
    updateLayout({
      editor: {
        ...layout.editor,
        lineNumbers: !layout.editor.lineNumbers
      }
    });
  };

  const handleToggleWordWrap = () => {
    updateLayout({
      editor: {
        ...layout.editor,
        wordWrap: !layout.editor.wordWrap
      }
    });
  };

  return (
    <div className="flex items-center justify-between px-3 py-1 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 text-xs">
      {/* Left section - File info */}
      <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
        <span className="flex items-center">
          Language: <span className="ml-1 font-medium">{activeFile.language}</span>
        </span>
        
        {activeFile.cursorPosition && (
          <span className="flex items-center">
            Ln {activeFile.cursorPosition.line}, Col {activeFile.cursorPosition.column}
          </span>
        )}
      </div>

      {/* Right section - Editor controls */}
      <div className="flex items-center space-x-1">
        {/* Word wrap toggle */}
        <button
          onClick={handleToggleWordWrap}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            layout.editor.wordWrap
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
          }`}
          title="Toggle word wrap"
        >
          Wrap
        </button>

        {/* Line numbers toggle */}
        <button
          onClick={handleToggleLineNumbers}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            layout.editor.lineNumbers
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
          }`}
          title="Toggle line numbers"
        >
          #
        </button>

        {/* Minimap toggle */}
        <button
          onClick={handleToggleMinimap}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            layout.editor.minimap
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
          }`}
          title="Toggle minimap"
        >
          Map
        </button>

        {/* AI Assistant button */}
        <button
          onClick={() => {
            // TODO: Implement AI assistance for current file
            console.log('AI Assistant for current file');
          }}
          className="px-2 py-1 rounded text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
          title="AI Assistant (Ctrl+K)"
        >
          🤖 AI
        </button>

        {/* Format button */}
        <button
          onClick={() => {
            // TODO: Implement code formatting
            console.log('Format code');
          }}
          className="px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          title="Format code (Shift+Alt+F)"
        >
          Format
        </button>

        {/* Save indicator */}
        {activeFile.isDirty && (
          <div className="flex items-center ml-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full mr-1"></div>
            <span className="text-orange-600 dark:text-orange-400 text-xs">Unsaved</span>
          </div>
        )}
      </div>
    </div>
  );
}