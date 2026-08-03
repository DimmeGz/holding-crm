import {
  IconArrowMoveRight,
  IconBuildingSkyscraper,
  IconCalendar,
  IconChartBar,
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

export type DocumentsMenuLabels = {
  incoming: string;
  outgoing: string;
  inner: string;
  paymentsByCreation: string;
};

function getInnerCompanies(
  companies: Record<number, string>,
  companyTypes: Record<number, string>,
): Array<{ id: number; name: string }> {
  return Object.entries(companies)
    .filter(
      ([companyId]) =>
        companyTypes[Number(companyId)] === CompanyType.INNER_COMPANY,
    )
    .map(([companyId, name]) => ({ id: Number(companyId), name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function buildCompanyTypeLinks(
  baseUrl: string,
  companies: Array<{ id: number; name: string }>,
  labels: DocumentsMenuLabels,
  options?: { flipTypeLabels?: boolean },
): Link[] {
  const flip = options?.flipTypeLabels ?? false;
  const links: Link[] = [];

  for (const company of companies) {
    links.push({
      label: company.name,
      url: `${baseUrl}?company=${company.id}`,
    });

    if (flip) {
      // Payments cashflow: sel → incoming, buy → outgoing
      links.push({
        label: `${company.name} — ${labels.incoming}`,
        url: `${baseUrl}?company=${company.id}&type=sel`,
      });
      links.push({
        label: `${company.name} — ${labels.outgoing}`,
        url: `${baseUrl}?company=${company.id}&type=buy`,
      });
    } else {
      links.push({
        label: `${company.name} — ${labels.incoming}`,
        url: `${baseUrl}?company=${company.id}&type=buy`,
      });
      links.push({
        label: `${company.name} — ${labels.outgoing}`,
        url: `${baseUrl}?company=${company.id}&type=sel`,
      });
    }
  }

  return links;
}

export function getDocumentsMenu(
  companies: Record<number, string>,
  companyTypes: Record<number, string>,
  labels: DocumentsMenuLabels,
): NavLinkGroupProps[] {
  const innerCompanies = getInnerCompanies(companies, companyTypes);

  const contractLinks: Link[] = [
    ...buildCompanyTypeLinks(
      UrlConstants.CONTRACTS_URL,
      innerCompanies,
      labels,
    ),
    {
      label: labels.inner,
      url: `${UrlConstants.CONTRACTS_URL}?type=inner`,
    },
  ];

  const paymentLinks: Link[] = [
    ...buildCompanyTypeLinks(UrlConstants.PAYMENTS_URL, innerCompanies, labels, {
      flipTypeLabels: true,
    }),
    {
      label: labels.paymentsByCreation,
      url: UrlConstants.PAYMENTS_BY_CREATION_URL,
    },
  ];

  return [
    {
      labelKey: 'common:nav.contracts',
      icon: IconContract,
      url: UrlConstants.CONTRACTS_URL,
      links: contractLinks,
    },
    {
      labelKey: 'common:nav.orders',
      icon: IconCurrencyEuro,
      url: `${UrlConstants.ORDERS_URL}?status=open&type=buy`,
    },
    {
      labelKey: 'common:nav.invoices',
      icon: IconFileEuro,
      url: UrlConstants.INVOICES_URL,
      links: buildCompanyTypeLinks(
        UrlConstants.INVOICES_URL,
        innerCompanies,
        labels,
      ),
    },
    {
      labelKey: 'common:nav.payments',
      icon: IconFileEuroFilled,
      url: UrlConstants.PAYMENTS_URL,
      links: paymentLinks,
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
      links: buildCompanyTypeLinks(
        UrlConstants.SHIPMENTS_URL,
        innerCompanies,
        labels,
      ),
    },
    {
      labelKey: 'common:nav.receives',
      icon: IconTruckFilled,
      url: UrlConstants.RECEIVES_URL,
      links: buildCompanyTypeLinks(
        UrlConstants.RECEIVES_URL,
        innerCompanies,
        labels,
      ),
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
}

export const adminMenu: NavLinkGroupProps[] = [
  {
    labelKey: 'common:nav.batchEdit',
    icon: IconEdit,
    url: UrlConstants.BATCHES_URL,
  },
];

export function getGeneralMenu(
  companies: Record<number, string>,
  companyTypes: Record<number, string>,
): NavLinkGroupProps[] {
  const warehouseLinks: Link[] = getInnerCompanies(companies, companyTypes).map(
    (company) => ({
      label: company.name,
      url: `${UrlConstants.WAREHOUSE_URL}?company=${company.id}`,
    }),
  );

  const monthReportLinks: Link[] = getInnerCompanies(
    companies,
    companyTypes,
  ).map((company) => ({
    label: company.name,
    url: `${UrlConstants.MONTH_REPORT_URL}/${company.id}`,
  }));

  return [
    {
      labelKey: 'common:nav.companies',
      icon: IconBuildingSkyscraper,
      url: UrlConstants.COMPANIES_URL,
    },
    {
      labelKey: 'common:nav.warehouse',
      icon: IconForklift,
      url: UrlConstants.WAREHOUSE_URL,
      links: warehouseLinks,
    },
    {
      labelKey: 'common:nav.monthReport',
      icon: IconChartBar,
      url: UrlConstants.MONTH_REPORT_URL,
      links: monthReportLinks,
    },
    {
      labelKey: 'common:nav.calendar',
      icon: IconCalendar,
      url: UrlConstants.CALENDAR_URL,
    },
    {
      labelKey: 'common:nav.transit',
      icon: IconTruckDelivery,
      url: UrlConstants.TRANSIT_URL,
    },
  ];
}
