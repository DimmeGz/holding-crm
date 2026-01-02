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
import type { NavLinkGroupProps } from '@/types/base-ui.types';

const mockCompanies: string[] = [
  'Klimana CZ',
  'EAST-WEST-BRIDGE',
  'Imvend Chemical',
  'DYUMANS ltd',
];

export const generalMenu: NavLinkGroupProps[] = [
  { label: 'Компанії', icon: IconBuildingSkyscraper },
  {
    label: 'Склад',
    icon: IconForklift,
    links: mockCompanies.map(company => ({ label: company, link: '/' })),
  },
  { label: 'Календар', icon: IconCalendar },
  { label: 'Транзит', icon: IconTruckDelivery },
];

export const documentsMenu: NavLinkGroupProps[] = [
  { label: 'Контракти', icon: IconContract },
  { label: 'Замовлення', icon: IconCurrencyEuro, link: '/orders' },
  { label: 'Рахунки', icon: IconFileEuro },
  { label: 'Платежі', icon: IconFileEuroFilled },
  { label: 'Комісійні рахунки', icon: IconFileEuro },
  { label: 'Комісійні платежі', icon: IconFileEuroFilled },
  { label: 'Відвантаження', icon: IconTruck },
  { label: 'Надходження', icon: IconTruckFilled },
  { label: 'Виробництво', icon: IconWreckingBall },
  { label: 'Переміщення', icon: IconArrowMoveRight },
];

export const adminMenu: NavLinkGroupProps[] = [
  { label: 'Редагування партій', icon: IconEdit },
];
