import { Fragment, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Text } from '@mantine/core';
import { StylesConstants } from '@/constants/styles.constants';

export function DocumentLinkItem({
  gridSpan,
  translationKey,
  value,
}: {
  gridSpan: number;
  translationKey: string;
  value: { label: string; uri: string } | { label: string; uri: string }[];
}): ReactNode {
  const { t } = useTranslation(['documents']),
    valueArray: { label: string; uri: string }[] = Array.isArray(value)
      ? [...value]
      : [value];

  return (
    <Grid.Col span={gridSpan}>
      <Text size='md' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
        {t(translationKey)}:
      </Text>

      <div className='flex gap-xs'>
        {valueArray.map((value, index) => (
          <Fragment key={value.label}>
            {index > 0 && ', '}
            <Text<'a'>
              component='a'
              href={value.uri}
              size='sm'
              fw={StylesConstants.HEAVY_FONT_WEIGHT}
              td='underline'
              style={{
                textDecorationThickness: '3px',
              }}
            >
              {value.label}
            </Text>
          </Fragment>
        ))}
      </div>
    </Grid.Col>
  );
}
