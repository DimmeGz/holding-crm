import type { ForwardRefExoticComponent } from 'react';
import type { IconProps } from '@tabler/icons-react';

export type NavLinkGroupProps = {
  icon: ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
};

export type SpinnerProps = {
  fullscreen?: boolean;
  center?: boolean;
  size?: number;
};
