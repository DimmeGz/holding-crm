import { useState } from 'react';
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from '@/components/navbar/LinksGroup.module.css';
import type { NavLinkGroupProps } from '@/types/base-ui.types';

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  link,
  links,
}: NavLinkGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map(link => (
    <Text<'a'>
      component='a'
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={event => event.preventDefault()}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened(o => !o)}
        className={classes.control}
      >
        <Group justify='space-between' gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant='light' size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Text<'a'> component='a' ml='md' href={link}>
              {label}
            </Text>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

export function NavbarLinksGroup(linkdata: NavLinkGroupProps) {
  return (
    <Box mih={220} p='md'>
      <LinksGroup {...linkdata} />
    </Box>
  );
}
