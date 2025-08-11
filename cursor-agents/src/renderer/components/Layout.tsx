import React from 'react';
import { useApp } from '../context/AppContext';
import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { Editor } from './Editor/Editor';
import { Terminal } from './Terminal/Terminal';
import { Chat } from './Chat/Chat';

export function Layout() {
  const { state } = useApp();
  const { layout } = state;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Title Bar */}
      <TitleBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {layout.sidebar.visible && (
          <div 
            className="sidebar flex-shrink-0 border-r border-gray-200 dark:border-gray-700"
            style={{ width: layout.sidebar.width }}
          >
            <Sidebar />
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <Editor />
            </div>

            {/* Chat Panel (Right) */}
            {layout.chat.visible && layout.chat.position === 'right' && (
              <div 
                className="flex-shrink-0 border-l border-gray-200 dark:border-gray-700"
                style={{ width: layout.chat.width }}
              >
                <Chat />
              </div>
            )}
          </div>

          {/* Terminal (Bottom) */}
          {layout.terminal.visible && (
            <div 
              className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700"
              style={{ height: layout.terminal.height }}
            >
              <Terminal />
            </div>
          )}

          {/* Chat Panel (Bottom) */}
          {layout.chat.visible && layout.chat.position === 'bottom' && (
            <div 
              className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700"
              style={{ height: layout.chat.width }} // Using width as height for bottom position
            >
              <Chat />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}