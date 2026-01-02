import type { IconProps } from '@tabler/icons-react';
import type { ForwardRefExoticComponent } from 'react';

export type NavLinkGroupProps = {
  icon: ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
};
