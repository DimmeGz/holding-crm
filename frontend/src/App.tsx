import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@/App.css';
import { AppRoutes } from '@/routes/AppRoutes';

function App(): ReactNode {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
