import type { ReactNode } from 'react';

export default function Header(): ReactNode {
  return (
      <header className='h-10 bg-slate-300 dark:bg-slate-800 text-black dark:text-white'>
        This is header
      </header>
  );
}
