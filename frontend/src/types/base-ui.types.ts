import type { IconProps } from '@tabler/icons-react';
import type { ForwardRefExoticComponent } from 'react';

export type NavLinkGroupProps = {
  icon: ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
};
