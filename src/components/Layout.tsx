import React from 'react';
import { useApp } from '../contexts/AppContext';
import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { Editor } from './Editor';
import { Terminal } from './Terminal';
import { Chat } from './Chat';
import CursorToolsPanel from './CursorToolsPanel';

export function Layout() {
  const { state } = useApp();
  const { layout } = state;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Title Bar */}
      <TitleBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {layout.sidebar.visible && (
          <div 
            className="flex-shrink-0 border-r border-border bg-sidebar"
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
                className="flex-shrink-0 border-l border-border bg-card"
                style={{ width: layout.chat.width }}
              >
                <Chat />
              </div>
            )}
          </div>

          {/* Terminal (Bottom) */}
          {layout.terminal.visible && (
            <div 
              className="flex-shrink-0 border-t border-border bg-card"
              style={{ height: layout.terminal.height }}
            >
              <Terminal />
            </div>
          )}

          {/* Chat Panel (Bottom) */}
          {layout.chat.visible && layout.chat.position === 'bottom' && (
            <div 
              className="flex-shrink-0 border-t border-border bg-card"
              style={{ height: layout.chat.width }}
            >
              <Chat />
            </div>
          )}

          {/* Tools Panel (Bottom) */}
          {layout.tools.visible && layout.tools.position === 'bottom' && (
            <div 
              className="flex-shrink-0 border-t border-border bg-card"
              style={{ height: layout.tools.width }}
            >
              <CursorToolsPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}