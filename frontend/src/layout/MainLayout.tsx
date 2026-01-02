import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function MainLayout() {
  return (
    <div className='flex flex-col gap-1 w-screen h-screen bg-slate-100 dark:bg-slate-700'>
      <Header />
      <div className='main w-screen h-full'>
        <Sidebar />
        <div className='content bg-slate-100 dark:bg-slate-800 text-black dark:text-white'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
