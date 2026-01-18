import { type ReactNode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@/App.css';
import '@/i18n/config';
import { AppRoutes } from '@/routes/AppRoutes';
import { useLibsStore } from '@/stores/useLibsStore';

function App(): ReactNode {
  useEffect(() => {
    useLibsStore.getState().loadAll();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
