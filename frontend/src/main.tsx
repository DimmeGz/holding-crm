import { type ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { type MantineColorScheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-react-table/styles.css';
import App from '@/App.tsx';
import '@/index.css';

function Root(): ReactNode {
  const savedTheme: MantineColorScheme | null = localStorage.getItem(
    'theme',
  ) as MantineColorScheme | null;

  return (
    <MantineProvider
      defaultColorScheme={savedTheme || 'auto'}
      theme={{ primaryColor: 'blue' }}
    >
      <Notifications />
      <App />
    </MantineProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
