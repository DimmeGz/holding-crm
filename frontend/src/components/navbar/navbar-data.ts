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
import { CompanyType } from '@/constants/company-type.constants';
import { UrlConstants } from '@/constants/url-constants';
import type { Link, NavLinkGroupProps } from '@/types/base-ui.types';

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
    url: UrlConstants.SHIPMENTS_URL,
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

export function getGeneralMenu(
  companies: Record<number, string>,
  companyTypes: Record<number, string>,
): NavLinkGroupProps[] {
  const warehouseLinks: Link[] = Object.entries(companies)
    .filter(
      ([companyId]) =>
        companyTypes[Number(companyId)] === CompanyType.INNER_COMPANY,
    )
    .map(([companyId, name]) => ({
      label: name,
      url: `${UrlConstants.WAREHOUSE_URL}?company=${companyId}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return [
    {
      labelKey: 'common:nav.companies',
      icon: IconBuildingSkyscraper,
      url: '/companies',
    },
    {
      labelKey: 'common:nav.warehouse',
      icon: IconForklift,
      url: UrlConstants.WAREHOUSE_URL,
      links: warehouseLinks,
    },
    { labelKey: 'common:nav.calendar', icon: IconCalendar },
    {
      labelKey: 'common:nav.transit',
      icon: IconTruckDelivery,
      url: UrlConstants.TRANSIT_URL,
    },
  ];
}
