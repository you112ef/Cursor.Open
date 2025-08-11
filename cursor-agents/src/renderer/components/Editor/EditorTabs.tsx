import React from 'react';
import { useApp } from '../../context/AppContext';

export function EditorTabs() {
  const { state, setActiveFile, closeFile } = useApp();
  const { openFiles, activeFileId } = state;

  if (openFiles.length === 0) return null;

  const handleTabClick = (fileId: string) => {
    setActiveFile(fileId);
  };

  const handleTabClose = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    closeFile(fileId);
  };

  const getFileIcon = (language: string): string => {
    const iconMap: Record<string, string> = {
      'typescript': '🟦',
      'javascript': '🟨',
      'python': '🐍',
      'html': '🌐',
      'css': '🎨',
      'json': '📋',
      'markdown': '📝',
      'yaml': '⚙️',
      'xml': '📋',
      'sql': '🗃️',
      'shell': '💻',
      'plaintext': '📄'
    };
    return iconMap[language] || '📄';
  };

  return (
    <div className="flex bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`group flex items-center px-3 py-2 min-w-0 border-r border-gray-200 dark:border-gray-700 cursor-pointer select-none ${
            file.id === activeFileId
              ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
          onClick={() => handleTabClick(file.id)}
          style={{ maxWidth: '200px' }}
        >
          {/* File icon */}
          <span className="mr-2 text-sm flex-shrink-0">
            {getFileIcon(file.language)}
          </span>

          {/* File name */}
          <span className="text-sm truncate flex-1 min-w-0">
            {file.name}
          </span>

          {/* Dirty indicator */}
          {file.isDirty && (
            <span className="ml-1 w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" title="Unsaved changes" />
          )}

          {/* Close button */}
          <button
            onClick={(e) => handleTabClose(e, file.id)}
            className="ml-2 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            title="Close file"
          >
            <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs">✕</span>
          </button>
        </div>
      ))}
      
      {/* Add file button (for future implementation) */}
      <button
        className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        title="New file"
        onClick={() => {
          // TODO: Implement new file creation
          console.log('New file');
        }}
      >
        +
      </button>
    </div>
  );
}