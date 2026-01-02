/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, type MantineColorScheme } from '@mantine/core';
import './index.css';
import '@mantine/core/styles.css';
import 'mantine-react-table/styles.css';
import App from './App.tsx';

function Root() {
  const savedTheme = localStorage.getItem('theme') as MantineColorScheme | null;

  return (
    <MantineProvider
      defaultColorScheme={savedTheme || 'auto'}
      theme={{ primaryColor: 'blue' }}
    >
      <App />
    </MantineProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
