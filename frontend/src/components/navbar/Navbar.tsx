import LanguageSwitcher from './LanguageSwitcher';
import type { ReactNode } from 'react';
import { Button, ScrollArea } from '@mantine/core';
import { LinksGroup } from '@/components/navbar/LinksGroup';
import {
  adminMenu,
  documentsMenu,
  generalMenu,
} from '@/components/navbar/mock-data';
import classes from '@/components/navbar/Navbar.module.css';
import { useTheme } from '@/hooks/useTheme';
import type { NavLinkGroupProps } from '@/types/base-ui.types';

export default function Navbar(): ReactNode {
  const { theme, toggleTheme } = useTheme(),
    generalLinks: ReactNode[] = generalMenu.map((item: NavLinkGroupProps) => (
      <LinksGroup {...item} key={item.labelKey} />
    )),
    documentsLinks: ReactNode[] = documentsMenu.map(
      (item: NavLinkGroupProps) => <LinksGroup {...item} key={item.labelKey} />,
    ),
    adminLinks: ReactNode[] = adminMenu.map((item: NavLinkGroupProps) => (
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
