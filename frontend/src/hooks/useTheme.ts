import { useEffect, useState } from 'react';
import { useMantineColorScheme } from '@mantine/core';

export function useTheme() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      setColorScheme('dark');
    } else {
      root.classList.remove('dark');
      setColorScheme('light');
    }

    localStorage.setItem('theme', theme);
  }, [theme, setColorScheme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
