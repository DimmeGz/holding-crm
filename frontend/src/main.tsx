import { type ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { type MantineColorScheme, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'dayjs/locale/uk';
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
      <DatesProvider settings={{ locale: 'uk', firstDayOfWeek: 1 }}>
        <Notifications />
        <App />
      </DatesProvider>
    </MantineProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
