import type { ReactNode } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { UrlConstants } from '@/constants/url-constants';
import MainLayout from '@/layout/MainLayout';
import { commissionInvoicesRoutes } from '@/routes/documents/commission-invoices.routes';
import { commissionPaymentsRoutes } from '@/routes/documents/commission-payments.routes';
import { contractsRoutes } from '@/routes/documents/contracts.routes';
import { invoicesRoutes } from '@/routes/documents/invoices.routes';
import { ordersRoutes } from '@/routes/documents/orders.routes';
import { paymentsRoutes } from '@/routes/documents/payments.routes';
import { shipmentsRoutes } from '@/routes/documents/shipments.routes';
import { receivesRoutes } from '@/routes/documents/receives.routes';
import { productionsRoutes } from '@/routes/documents/productions.routes';
import { transportsRoutes } from '@/routes/documents/transports.routes';
import { transitRoutes } from '@/routes/documents/transit.routes';
import { warehouseRoutes } from '@/routes/warehouse.routes';
import { batchesRoutes } from '@/routes/batches.routes';
import { calendarRoutes } from '@/routes/calendar.routes';
import { companiesRoutes } from '@/routes/companies.routes';

export function AppRoutes(): ReactNode {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Navigate to={UrlConstants.CALENDAR_URL} replace />,
        },
        companiesRoutes,
        ordersRoutes,
        contractsRoutes,
        invoicesRoutes,
        paymentsRoutes,
        commissionInvoicesRoutes,
        commissionPaymentsRoutes,
        shipmentsRoutes,
        receivesRoutes,
        productionsRoutes,
        transportsRoutes,
        transitRoutes,
        warehouseRoutes,
        batchesRoutes,
        calendarRoutes,
      ],
    },
  ]);
}
