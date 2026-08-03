import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
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
import type { Link as NavLinkItem, NavLinkGroupProps } from '@/types/base-ui.types';

export function LinksGroup({
  icon: Icon,
  labelKey,
  initiallyOpened,
  url: link,
  links,
}: NavLinkGroupProps): ReactNode {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();

  const hasLinks: boolean = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const items: ReactNode = (hasLinks ? links! : []).map((item: NavLinkItem) => (
    <Text
      component={Link}
      to={item.url}
      className={classes.link}
      key={`${item.label}-${item.url}`}
    >
      {item.label}
    </Text>
  ));

  const handleControlClick = (): void => {
    if (hasLinks) {
      setOpened((current: boolean) => !current);
      return;
    }

    if (link) {
      navigate(link);
    }
  };

  return (
    <>
      <UnstyledButton onClick={handleControlClick} className={classes.control}>
        <Group justify='space-between' gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant='light' size={30}>
              <Icon size={18} />
            </ThemeIcon>
            {link ? (
              <Text
                component={Link}
                to={link}
                ml='md'
                onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                  event.stopPropagation();
                }}
              >
                {t(labelKey)}
              </Text>
            ) : (
              <Text ml='md'>{t(labelKey)}</Text>
            )}
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
