import React, { useState } from 'react';
import { FileItem } from '@/shared/types';

interface FileTreeItemProps {
  file: FileItem;
  level: number;
  onSelect: (file: FileItem) => void;
}

export function FileTreeItem({ file, level, onSelect }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getFileIcon = (file: FileItem): string => {
    if (file.type === 'directory') {
      return isExpanded ? '📂' : '📁';
    }

    const extension = file.extension?.toLowerCase() || '';
    const iconMap: Record<string, string> = {
      // Code files
      'ts': '🟦',
      'tsx': '🟦',
      'js': '🟨',
      'jsx': '🟨',
      'py': '🐍',
      'java': '☕',
      'cpp': '⚙️',
      'c': '⚙️',
      'cs': '🟣',
      'php': '🟪',
      'rb': '💎',
      'go': '🟢',
      'rs': '🦀',
      'swift': '🍎',
      'kt': '🟠',
      
      // Web files
      'html': '🌐',
      'css': '🎨',
      'scss': '🎨',
      'sass': '🎨',
      'less': '🎨',
      
      // Config files
      'json': '📋',
      'xml': '📋',
      'yml': '⚙️',
      'yaml': '⚙️',
      'toml': '⚙️',
      'ini': '⚙️',
      'env': '🔧',
      
      // Documentation
      'md': '📝',
      'txt': '📄',
      'pdf': '📕',
      'doc': '📘',
      'docx': '📘',
      
      // Media
      'png': '🖼️',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'gif': '🖼️',
      'svg': '🎨',
      'ico': '🖼️',
      
      // Data
      'sql': '🗃️',
      'db': '🗃️',
      'sqlite': '🗃️',
      'csv': '📊',
      
      // Build/Package
      'zip': '📦',
      'tar': '📦',
      'gz': '📦',
      'rar': '📦',
      
      // Shell
      'sh': '💻',
      'bash': '💻',
      'zsh': '💻',
      'fish': '💻',
      'ps1': '💻'
    };

    return iconMap[extension] || '📄';
  };

  const handleClick = () => {
    if (file.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onSelect(file);
    }
  };

  const paddingLeft = level * 20 + 8;

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer select-none group"
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleClick}
      >
        {/* Expand/collapse indicator for directories */}
        {file.type === 'directory' && (
          <span 
            className="w-3 h-3 flex items-center justify-center text-gray-400 mr-1 text-xs"
          >
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        
        {/* File icon */}
        <span className="mr-2 text-sm">
          {getFileIcon(file)}
        </span>

        {/* File name */}
        <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
          {file.name}
        </span>

        {/* File size (for files only) */}
        {file.type === 'file' && file.size && (
          <span className="text-xs text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatFileSize(file.size)}
          </span>
        )}
      </div>

      {/* Children (for expanded directories) */}
      {file.type === 'directory' && isExpanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeItem
              key={child.id}
              file={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}