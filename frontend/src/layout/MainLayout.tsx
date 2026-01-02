import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';

export default function MainLayout(): ReactNode {
  return (
    <div className='main w-screen h-screen flex bg-slate-100 dark:bg-slate-700'>
      <Navbar />
      <div className='content w-full h-screen overflow-auto bg-slate-100 dark:bg-slate-800 text-black dark:text-white px-2'>
        <Outlet />
      </div>
    </div>
  );
}
