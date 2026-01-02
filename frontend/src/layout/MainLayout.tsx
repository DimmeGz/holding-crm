import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

export default function MainLayout() {
  return (
    <div className='main w-screen h-screen bg-slate-100 dark:bg-slate-700'>
      <Navbar />
      <div className='content bg-slate-100 dark:bg-slate-800 text-black dark:text-white'>
        <Outlet />
      </div>
    </div>
  );
}
