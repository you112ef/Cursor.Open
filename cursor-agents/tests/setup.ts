import '@testing-library/jest-dom';

// Mock Electron
global.window.electron = {
  ipcRenderer: {
    invoke: jest.fn(),
    on: jest.fn(),
    removeAllListeners: jest.fn()
  }
};

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  Editor: () => <div data-testid="monaco-editor">Monaco Editor Mock</div>
}));

// Mock xterm.js
jest.mock('@xterm/xterm', () => ({
  Terminal: class {
    loadAddon = jest.fn();
    open = jest.fn();
    write = jest.fn();
    writeln = jest.fn();
    clear = jest.fn();
    dispose = jest.fn();
    onData = jest.fn();
    onResize = jest.fn();
  }
}));