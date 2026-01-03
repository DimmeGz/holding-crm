import type { ForwardRefExoticComponent } from 'react';
import type { IconProps } from '@tabler/icons-react';

export type NavLinkGroupProps = {
  icon: ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  labelKey: string;
  initiallyOpened?: boolean;
  url?: string;
  links?: Link[];
};

export type SpinnerProps = {
  fullscreen?: boolean;
  center?: boolean;
  size?: number;
};

export type Link = { label: string; url: string };
