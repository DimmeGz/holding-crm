import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import type { Link, NavLinkGroupProps } from '@/types/base-ui.types';

export function LinksGroup({
  icon: Icon,
  labelKey,
  initiallyOpened,
  url: link,
  links,
}: NavLinkGroupProps): ReactNode {
  const { t } = useTranslation(['common']);

  const hasLinks: boolean = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items: ReactNode = (hasLinks ? links! : []).map((link: Link) => (
    <Text<'a'>
      component='a'
      className={classes.link}
      href={link.url}
      key={link.label}
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
        event.preventDefault()
      }
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((opened: boolean) => !opened)}
        className={classes.control}
      >
        <Group justify='space-between' gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant='light' size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Text<'a'> component='a' ml='md' href={link}>
              {t(labelKey)}
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

export function NavbarLinksGroup(linkdata: NavLinkGroupProps): ReactNode {
  return (
    <Box mih={220} p='md'>
      <LinksGroup {...linkdata} />
    </Box>
  );
}
