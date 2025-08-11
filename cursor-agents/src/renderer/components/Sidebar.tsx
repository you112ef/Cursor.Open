import React from 'react';
import { useApp } from '../context/AppContext';
import { FileExplorer } from './FileExplorer/FileExplorer';

const panels = [
  { id: 'explorer' as const, name: 'Explorer', icon: '📁' },
  { id: 'search' as const, name: 'Search', icon: '🔍' },
  { id: 'git' as const, name: 'Git', icon: '🔧' },
  { id: 'extensions' as const, name: 'Extensions', icon: '🧩' }
];

export function Sidebar() {
  const { state, setSidebarPanel } = useApp();
  const { layout } = state;
  const activePanel = layout.sidebar.activePanel;

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'explorer':
        return <FileExplorer />;
      case 'search':
        return (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
            Search functionality coming soon...
          </div>
        );
      case 'git':
        return (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
            Git integration coming soon...
          </div>
        );
      case 'extensions':
        return (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
            Extensions panel coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-800">
      {/* Panel tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {panels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => setSidebarPanel(panel.id)}
            className={`flex-1 p-2 text-sm font-medium border-b-2 transition-colors ${
              activePanel === panel.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-700'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
            title={panel.name}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">{panel.icon}</span>
              <span className="text-xs">{panel.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        {renderPanelContent()}
      </div>
    </div>
  );
}