import type { ReactNode } from 'react';
import { useRoutes } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import { commissionInvoicesRoutes } from '@/routes/documents/commission-invoices.routes';
import { commissionPaymentsRoutes } from '@/routes/documents/commission-payments.routes';
import { contractsRoutes } from '@/routes/documents/contracts.routes';
import { invoicesRoutes } from '@/routes/documents/invoices.routes';
import { ordersRoutes } from '@/routes/documents/orders.routes';
import { paymentsRoutes } from '@/routes/documents/payments.routes';
import { shipmentsRoutes } from '@/routes/documents/shipments.routes';
import { receivesRoutes } from '@/routes/documents/receives.routes';

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
        commissionInvoicesRoutes,
        commissionPaymentsRoutes,
        shipmentsRoutes,
        receivesRoutes,
      ],
    },
  ]);
}
