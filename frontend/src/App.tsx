import type { ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@/App.css';
import { OrdersList } from '@/components/documents/orders/OrdersList';
import MainLayout from '@/layout/MainLayout';

function App(): ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<div className='w-full h-full'></div>} />
          <Route path='/orders' element={<OrdersList />} />
          {/* <Route path='/companies' element={<Companies />} />
          <Route path='/reports' element={<Reports />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
