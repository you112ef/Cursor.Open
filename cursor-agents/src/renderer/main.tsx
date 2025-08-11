import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/globals.css';

// Ensure we have the Electron API
if (!window.electron) {
  console.error('Electron API not found! Make sure preload script is loaded correctly.');
}

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hot module replacement is handled by Vite