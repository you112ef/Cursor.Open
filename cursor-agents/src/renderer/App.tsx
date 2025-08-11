import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the application
    const initApp = async () => {
      try {
        // Check if Electron API is available
        if (!window.electron) {
          throw new Error('Electron API is not available');
        }

        // Test basic functionality
        await window.electron.app.getSettings();
        
        // Simulate loading time for smooth UX
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 dark:bg-red-950">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
            Application Error
          </h1>
          <p className="text-red-600 dark:text-red-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center text-white">
          <div className="inline-block w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl font-medium">Loading Cursor Agents...</div>
          <div className="text-sm opacity-75 mt-2">Initializing AI-powered code editor</div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AppProvider>
        <div className="app h-screen overflow-hidden bg-white dark:bg-slate-900">
          <Layout />
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}