import React, { useRef, useEffect } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { EditorTabs } from './EditorTabs';
import { EditorToolbar } from './EditorToolbar';

export function Editor() {
  const { state, updateFileContent } = useApp();
  const { actualTheme } = useTheme();
  const { openFiles, activeFileId, settings } = state;
  const editorRef = useRef<any>(null);

  const activeFile = openFiles.find(f => f.id === activeFileId);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure editor settings
    editor.updateOptions({
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      tabSize: settings.editor.tabSize,
      insertSpaces: settings.editor.insertSpaces,
      wordWrap: settings.editor.wordWrap ? 'on' : 'off',
      minimap: { enabled: state.layout.editor.minimap },
      lineNumbers: state.layout.editor.lineNumbers ? 'on' : 'off',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'boundary',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      },
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      parameterHints: { enabled: true },
      hover: { enabled: true },
      contextmenu: true,
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'mouseover',
      unfoldOnClickAfterEndOfLine: true,
      links: true,
      colorDecorators: true,
      lightbulb: { enabled: true },
      codeActionsOnSave: settings.editor.codeAction ? {
        'source.organizeImports': true,
        'source.fixAll': true
      } : undefined
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save file (will be implemented)
      console.log('Save file shortcut triggered');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      // AI inline chat (will be implemented)
      console.log('AI inline chat shortcut triggered');
    });

    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      if (activeFile) {
        const content = editor.getValue();
        updateFileContent(activeFile.id, content);
      }
    });

    // Listen for cursor position changes
    editor.onDidChangeCursorPosition((e: any) => {
      if (activeFile) {
        // Update cursor position in state (will be used for AI context)
        const position = { line: e.position.lineNumber, column: e.position.column };
        // This could be stored in the file state for context
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFileContent(activeFile.id, value);
    }
  };

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        tabSize: settings.editor.tabSize,
        insertSpaces: settings.editor.insertSpaces,
        minimap: { enabled: state.layout.editor.minimap },
        lineNumbers: state.layout.editor.lineNumbers ? 'on' : 'off'
      });
    }
  }, [settings, state.layout.editor]);

  if (openFiles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Welcome to Cursor Agents
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            Open a file to start coding with AI-powered assistance, or create a new file to begin your project.
          </p>
          <div className="space-y-2">
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Quick shortcuts:
            </div>
            <div className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
              <div><kbd className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">Ctrl/Cmd + O</kbd> Open file</div>
              <div><kbd className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">Ctrl/Cmd + N</kbd> New file</div>
              <div><kbd className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">Ctrl/Cmd + K</kbd> AI Chat</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Editor Tabs */}
      <EditorTabs />
      
      {/* Editor Toolbar */}
      <EditorToolbar />

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        {activeFile ? (
          <MonacoEditor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            theme={actualTheme === 'dark' ? 'vs-dark' : 'light'}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            options={{
              fontSize: settings.fontSize,
              fontFamily: settings.fontFamily,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              renderWhitespace: 'boundary',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true
              },
              suggestOnTriggerCharacters: true,
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true
              },
              parameterHints: { enabled: true },
              hover: { enabled: true },
              contextmenu: true,
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'mouseover',
              unfoldOnClickAfterEndOfLine: true,
              links: true,
              colorDecorators: true,
              lightbulb: { enabled: true }
            }}
            loading={
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Loading editor...</div>
                </div>
              </div>
            }
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">
              No file selected
            </div>
          </div>
        )}
      </div>
    </div>
  );
}