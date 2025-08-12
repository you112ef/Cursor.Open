import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProviderContextProvider } from './contexts/ProviderContext';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <ThemeProvider>
      <ProviderContextProvider>
        <AppProvider>
          <div className="app h-screen overflow-hidden bg-background text-foreground">
            <Layout />
          </div>
        </AppProvider>
      </ProviderContextProvider>
    </ThemeProvider>
  );
}