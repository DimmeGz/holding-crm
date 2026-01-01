import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<></>} />
          {/* <Route path='/companies' element={<Companies />} />
          <Route path='/reports' element={<Reports />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
