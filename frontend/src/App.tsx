import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import { OrdersList } from './components/documents/orders/OrdersList';

function App() {
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
