import React, { useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { X, Circle } from 'lucide-react';

export function Editor() {
  const { state, dispatch } = useApp();
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const { editorTabs, activeTab } = state;

  const currentTab = editorTabs.find(tab => tab.id === activeTab);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Set up editor options
    editor.updateOptions({
      fontSize: state.settings.fontSize,
      tabSize: state.settings.tabSize,
      wordWrap: state.settings.wordWrap ? 'on' : 'off',
      minimap: { enabled: true },
      lineNumbers: 'on',
      rulers: [80, 120],
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      renderLineHighlight: 'all',
      renderWhitespace: 'selection',
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && currentTab) {
      dispatch({
        type: 'UPDATE_TAB_CONTENT',
        payload: { id: currentTab.id, content: value },
      });
    }
  };

  const closeTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({ type: 'CLOSE_TAB', payload: tabId });
  };

  const switchTab = (tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
  };

  if (editorTabs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No files open</h3>
          <p className="text-sm">Select a file from the sidebar to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tabs */}
      <div className="flex items-center bg-card border-b border-border overflow-x-auto">
        {editorTabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer hover:bg-accent min-w-0 ${
              tab.id === activeTab 
                ? 'bg-background text-foreground' 
                : 'bg-card text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => switchTab(tab.id)}
          >
            <span className="text-sm truncate min-w-0">
              {tab.name}
            </span>
            
            {tab.isDirty && (
              <Circle className="h-2 w-2 fill-current text-orange-500" />
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => closeTab(tab.id, e)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1">
        {currentTab && (
          <MonacoEditor
            height="100%"
            language={currentTab.language}
            value={currentTab.content}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              scrollBeyondLastLine: false,
              readOnly: false,
              contextmenu: true,
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true,
              },
              parameterHints: {
                enabled: true,
              },
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              tabCompletion: 'on',
              wordBasedSuggestions: 'allDocuments',
              // Enhanced editing features
              formatOnPaste: true,
              formatOnType: true,
              autoIndent: 'full',
              bracketPairColorization: {
                enabled: true,
              },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
            }}
          />
        )}
      </div>
    </div>
  );
}