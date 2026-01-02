import type { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

export default function Sidebar(): ReactNode {
  const { theme, toggleTheme } = useTheme();

  console.log('Current theme:', theme);

  return (
    <div className='flex flex-col justify-between w-50 h-full bg-slate-300 dark:bg-slate-800'>
      <p className='text-gray-800 dark:text-gray-200'>This is sidebar</p>
      <button
        onClick={toggleTheme}
        className='my-2 mx-2 px-6 py-3 bg-gray-400 dark:bg-slate-700 dark:text-white rounded-lg hover:bg-slate-500 dark:hover:bg-slate-500 transition-colors'
      >
        {theme === 'light' ? '🌙 Темна тема' : '☀️ Світла тема'}
      </button>
    </div>
  );
}
