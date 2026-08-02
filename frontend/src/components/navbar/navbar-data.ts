import {
  IconArrowMoveRight,
  IconBuildingSkyscraper,
  IconCalendar,
  IconContract,
  IconCurrencyEuro,
  IconEdit,
  IconFileEuro,
  IconFileEuroFilled,
  IconForklift,
  IconTruck,
  IconTruckDelivery,
  IconTruckFilled,
  IconWreckingBall,
} from '@tabler/icons-react';
import { UrlConstants } from '@/constants/url-constants';
import type { NavLinkGroupProps } from '@/types/base-ui.types';

const mockCompanies: string[] = [
  'Klimana CZ',
  'EAST-WEST-BRIDGE',
  'Imvend Chemical',
  'DYUMANS ltd',
];

export const generalMenu: NavLinkGroupProps[] = [
  {
    labelKey: 'common:nav.companies',
    icon: IconBuildingSkyscraper,
    url: '/companies',
  },
  {
    labelKey: 'common:nav.warehouse',
    icon: IconForklift,
    links: mockCompanies.map((companyName: string) => ({
      label: companyName,
      url: '/',
    })),
  },
  { labelKey: 'common:nav.calendar', icon: IconCalendar },
  { labelKey: 'common:nav.transit', icon: IconTruckDelivery },
];

export const documentsMenu: NavLinkGroupProps[] = [
  {
    labelKey: 'common:nav.contracts',
    icon: IconContract,
    url: UrlConstants.CONTRACTS_URL,
  },
  {
    labelKey: 'common:nav.orders',
    icon: IconCurrencyEuro,
    url: UrlConstants.ORDERS_URL,
  },
  {
    labelKey: 'common:nav.invoices',
    icon: IconFileEuro,
    url: UrlConstants.INVOICES_URL,
  },
  {
    labelKey: 'common:nav.payments',
    icon: IconFileEuroFilled,
    url: UrlConstants.PAYMENTS_URL,
  },
  {
    labelKey: 'common:nav.paymentsByCreation',
    icon: IconFileEuroFilled,
    url: UrlConstants.PAYMENTS_BY_CREATION_URL,
  },
  {
    labelKey: 'common:nav.commissionInvoices',
    icon: IconFileEuro,
    url: UrlConstants.COMMISSION_INVOICES_URL,
  },
  {
    labelKey: 'common:nav.commissioPayments',
    icon: IconFileEuroFilled,
    url: UrlConstants.COMMISSION_PAYMENTS_URL,
  },
  {
    labelKey: 'common:nav.shipments',
    icon: IconTruck,
    url: UrlConstants.SHIPMENTS_URL
  },
  {
    labelKey: 'common:nav.receives',
    icon: IconTruckFilled,
    url: UrlConstants.RECEIVES_URL,
  },
  {
    labelKey: 'common:nav.production',
    icon: IconWreckingBall,
    url: UrlConstants.PRODUCTION_URL,
  },
  {
    labelKey: 'common:nav.transportations',
    icon: IconArrowMoveRight,
    url: UrlConstants.TRANSPORT_URL,
  },
];

export const adminMenu: NavLinkGroupProps[] = [
  { labelKey: 'common:nav.batchEdit', icon: IconEdit },
];
