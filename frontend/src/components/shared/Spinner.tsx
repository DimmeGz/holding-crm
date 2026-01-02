import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { Loader } from '@mantine/core';
import type { SpinnerProps } from '@/types/base-ui.types';

export function Spinner({
  fullscreen = false,
  center = true,
  size = fullscreen ? 85 : 65,
}: SpinnerProps): ReactNode {
  return (
    <div
      className={clsx(
        { 'text-center w-full': !fullscreen },
        {
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2':
            fullscreen || center,
        },
      )}
    >
      <Loader color='cyan' size={size} />
    </div>
  );
}
