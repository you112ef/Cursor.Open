import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileItem } from '../../../shared/types';
import { FileTreeItem } from './FileTreeItem';

export function FileExplorer() {
  const { state, openFile } = useApp();
  const { activeProject } = state;
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load file tree when project changes
  useEffect(() => {
    if (activeProject) {
      loadFileTree(activeProject.path);
    } else {
      setFileTree([]);
    }
  }, [activeProject]);

  const loadFileTree = async (path: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const files = await window.electron.file.list(path);
      setFileTree(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
      console.error('Failed to load file tree:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: FileItem) => {
    if (file.type === 'file') {
      try {
        const content = await window.electron.file.read(file.path);
        
        // Determine language from file extension
        const extension = file.extension || '';
        const languageMap: Record<string, string> = {
          'ts': 'typescript',
          'tsx': 'typescript',
          'js': 'javascript',
          'jsx': 'javascript',
          'py': 'python',
          'json': 'json',
          'html': 'html',
          'css': 'css',
          'scss': 'scss',
          'md': 'markdown',
          'yml': 'yaml',
          'yaml': 'yaml',
          'xml': 'xml',
          'sql': 'sql',
          'sh': 'shell',
          'bash': 'shell'
        };

        const openFileData = {
          id: file.id,
          name: file.name,
          path: file.path,
          content,
          language: languageMap[extension] || 'plaintext',
          isDirty: false,
          cursorPosition: { line: 0, column: 0 }
        };

        openFile(openFileData);
      } catch (err) {
        console.error('Failed to open file:', err);
        setError(`Failed to open ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const handleOpenFolder = async () => {
    try {
      const result = await window.electron.app.showOpenDialog();
      if (!result.canceled && result.filePaths.length > 0) {
        const folderPath = result.filePaths[0];
        // For now, just load the file tree. Project management will be enhanced later.
        await loadFileTree(folderPath);
      }
    } catch (err) {
      console.error('Failed to open folder:', err);
      setError('Failed to open folder');
    }
  };

  if (!activeProject) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="text-4xl mb-4">📁</div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          No Project Open
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Open a folder to start exploring files
        </p>
        <button
          onClick={handleOpenFolder}
          className="btn btn-primary text-xs px-3 py-1.5"
        >
          Open Folder
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading files...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="text-red-500 text-2xl mb-2">⚠️</div>
        <div className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</div>
        <button
          onClick={() => activeProject && loadFileTree(activeProject.path)}
          className="btn btn-secondary text-xs px-3 py-1.5"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {activeProject.name}
          </h3>
          <button
            onClick={() => activeProject && loadFileTree(activeProject.path)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            title="Refresh"
          >
            🔄
          </button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
          {activeProject.path}
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto">
        {fileTree.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No files found
          </div>
        ) : (
          <div className="py-2">
            {fileTree.map((file) => (
              <FileTreeItem
                key={file.id}
                file={file}
                level={0}
                onSelect={handleFileSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}