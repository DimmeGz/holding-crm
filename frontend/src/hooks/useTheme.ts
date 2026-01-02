import { useEffect, useState } from 'react';
import { useMantineColorScheme } from '@mantine/core';
import type { Theme, UseThemeProps } from '@/types/common.types';

export function useTheme(): UseThemeProps {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    const root: HTMLElement = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      setColorScheme('dark');
    } else {
      root.classList.remove('dark');
      setColorScheme('light');
    }

    localStorage.setItem('theme', theme);
  }, [theme, setColorScheme]);

  function toggleTheme(): void {
    setTheme((prev: Theme) => (prev === 'light' ? 'dark' : 'light'));
  }

  return { theme, toggleTheme };
}
