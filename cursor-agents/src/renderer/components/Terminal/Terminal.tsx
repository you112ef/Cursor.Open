import React, { useState } from 'react';
import { TerminalSession } from './TerminalSession';

export function Terminal() {
  const [terminals, setTerminals] = useState<Array<{ id: string; title: string }>>([
    { id: '1', title: 'Terminal 1' }
  ]);
  const [activeTerminalId, setActiveTerminalId] = useState('1');

  const addTerminal = () => {
    const newId = Date.now().toString();
    const newTerminal = {
      id: newId,
      title: `Terminal ${terminals.length + 1}`
    };
    setTerminals([...terminals, newTerminal]);
    setActiveTerminalId(newId);
  };

  const closeTerminal = (id: string) => {
    if (terminals.length === 1) return; // Keep at least one terminal
    
    const newTerminals = terminals.filter(t => t.id !== id);
    setTerminals(newTerminals);
    
    if (activeTerminalId === id) {
      setActiveTerminalId(newTerminals[0]?.id || '');
    }
  };

  const activeTerminal = terminals.find(t => t.id === activeTerminalId);

  return (
    <div className="h-full flex flex-col bg-slate-900 text-green-400">
      {/* Terminal tabs */}
      <div className="flex items-center bg-slate-800 border-b border-slate-700 px-2">
        <div className="flex items-center flex-1 overflow-x-auto">
          {terminals.map((terminal) => (
            <div
              key={terminal.id}
              className={`flex items-center px-3 py-2 cursor-pointer border-r border-slate-700 ${
                terminal.id === activeTerminalId
                  ? 'bg-slate-900 text-green-400'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-slate-700'
              }`}
              onClick={() => setActiveTerminalId(terminal.id)}
            >
              <span className="text-sm mr-2">💻</span>
              <span className="text-sm">{terminal.title}</span>
              
              {terminals.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTerminal(terminal.id);
                  }}
                  className="ml-2 text-gray-400 hover:text-red-400 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add terminal button */}
        <button
          onClick={addTerminal}
          className="p-2 text-gray-400 hover:text-green-400 hover:bg-slate-700 rounded"
          title="New terminal"
        >
          +
        </button>

        {/* Terminal controls */}
        <div className="flex items-center ml-2 space-x-1">
          <button
            onClick={() => {
              // TODO: Clear terminal
              console.log('Clear terminal');
            }}
            className="p-1 text-gray-400 hover:text-gray-300 text-xs"
            title="Clear terminal"
          >
            🗑️
          </button>

          <button
            onClick={() => {
              // TODO: Split terminal
              console.log('Split terminal');
            }}
            className="p-1 text-gray-400 hover:text-gray-300 text-xs"
            title="Split terminal"
          >
            ⫞
          </button>
        </div>
      </div>

      {/* Active terminal content */}
      <div className="flex-1 overflow-hidden">
        {activeTerminal ? (
          <TerminalSession key={activeTerminal.id} terminalId={activeTerminal.id} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No terminal available
          </div>
        )}
      </div>
    </div>
  );
}