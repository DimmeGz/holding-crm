import type { ReactNode } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { LinksGroup } from './LinksGroup';
import classes from './Navbar.module.css';
import { Button, ScrollArea } from '@mantine/core';
import { documentsMenu, generalMenu } from './mock-data';

export default function Navbar(): ReactNode {
  const { theme, toggleTheme } = useTheme();
  const generalLinks = generalMenu.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));
  const documentsLinks = documentsMenu.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>Logo and name here</div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{generalLinks}</div>
        <div className={classes.linksInner}>{documentsLinks}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <Button
          variant='light'
          my='xs'
          onClick={toggleTheme}
        >
          {theme === 'light' ? '🌙 Темна тема' : '☀️ Світла тема'}
        </Button>
      </div>
    </nav>
  );
}
