import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ScrollArea } from '@mantine/core';
import LanguageSwitcher from '@/components/navbar/LanguageSwitcher';
import { LinksGroup } from '@/components/navbar/LinksGroup';
import {
  adminMenu,
  getDocumentsMenu,
  getGeneralMenu,
} from '@/components/navbar/navbar-data';
import classes from '@/components/navbar/Navbar.module.css';
import { useTheme } from '@/hooks/useTheme';
import { useLibsStore } from '@/stores/useLibsStore';
import type { NavLinkGroupProps } from '@/types/base-ui.types';

export default function Navbar(): ReactNode {
  const { t } = useTranslation(['common']);
  const { theme, toggleTheme } = useTheme();
  const companies = useLibsStore((s) => s.companies);
  const companyTypes = useLibsStore((s) => s.companyTypes);
  const isLoaded = useLibsStore((s) => s.isLoaded);

  const generalMenu = useMemo(
    () => getGeneralMenu(isLoaded ? companies : {}, isLoaded ? companyTypes : {}),
    [companies, companyTypes, isLoaded],
  );

  const documentsMenu = useMemo(
    () =>
      getDocumentsMenu(isLoaded ? companies : {}, isLoaded ? companyTypes : {}, {
        incoming: t('common:filters.incoming'),
        outgoing: t('common:filters.outgoing'),
        inner: t('common:filters.inner'),
        paymentsByCreation: t('common:nav.paymentsByCreation'),
      }),
    [companies, companyTypes, isLoaded, t],
  );

  const generalLinks: ReactNode[] = generalMenu.map(
    (item: NavLinkGroupProps) => <LinksGroup {...item} key={item.labelKey} />,
  );
  const documentsLinks: ReactNode[] = documentsMenu.map(
    (item: NavLinkGroupProps) => <LinksGroup {...item} key={item.labelKey} />,
  );
  const adminLinks: ReactNode[] = adminMenu.map((item: NavLinkGroupProps) => (
    <LinksGroup {...item} key={item.labelKey} />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>Logo and name here</div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{generalLinks}</div>
        <div className={classes.linksInner}>{documentsLinks}</div>
        <div className={classes.linksInner}>{adminLinks}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <Button variant='light' my='xs' onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
