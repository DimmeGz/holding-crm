import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function MainLayout() {
  return (
    <div className='flex flex-col w-screen h-screen'>
      <Header />
      <div className='main w-screen h-full'>
        <Sidebar />
        <div className='content'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
