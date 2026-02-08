import type { ReactNode } from 'react';
import { useRoutes } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import { contractsRoutes } from '@/routes/documents/contracts.routes';
import { invoicesRoutes } from '@/routes/documents/invoices.routes';
import { ordersRoutes } from '@/routes/documents/orders.routes';
import { paymentsRoutes } from '@/routes/documents/payments.routes';

export function AppRoutes(): ReactNode {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <div className='w-full h-full'></div>,
        },
        ordersRoutes,
        contractsRoutes,
        invoicesRoutes,
        paymentsRoutes,
      ],
    },
  ]);
}
