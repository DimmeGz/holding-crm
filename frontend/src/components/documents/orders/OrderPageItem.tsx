import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { CommonConstants } from '@/constants/common.constants';
import { StylesConstants } from '@/constants/styles.constants';

export function OrderPageItem({
  gridSpan,
  translationKey,
  baseValue,
  confirmValue,
}: {
  gridSpan: number;
  translationKey: { primary: string; secondary?: string };
  baseValue: { primary: string; secondary?: string };
  confirmValue?: { primary?: string; secondary?: string };
}): ReactNode {
  const { t } = useTranslation(['documents']),
    hasBaseValue: boolean = Boolean(baseValue.primary?.trim()),
    hasConfirmation: boolean = Boolean(confirmValue),
    isEqual: boolean =
      baseValue.primary === confirmValue?.primary &&
      (!baseValue.secondary || baseValue.secondary === confirmValue?.secondary);

  return (
    <Grid.Col span={gridSpan}>
      <Text size='md' fw={StylesConstants.DEFAULT_FONT_WEIGHT}>
        {t(translationKey.primary)}:
      </Text>
      {hasBaseValue ? (
        <div className='flex gap-xs'>
          <Text
            size='sm'
            fw={StylesConstants.HEAVY_FONT_WEIGHT}
            td={!isEqual && hasConfirmation ? 'line-through' : 'none'}
            c={!isEqual && hasConfirmation ? 'line-through' : 'none'}
            style={{
              textDecorationThickness: '2px',
            }}
          >
            {baseValue.primary}
          </Text>
          {translationKey.secondary && baseValue.secondary && (
            <Text
              size='sm'
              fw={StylesConstants.DEFAULT_FONT_WEIGHT}
              ml={5}
              c='dimmed'
              td={!isEqual && hasConfirmation ? 'line-through' : 'none'}
              style={{
                textDecorationThickness: '2px',
              }}
            >
              ({t(translationKey.secondary)}: {baseValue.secondary})
            </Text>
          )}

          {isEqual && baseValue.primary && <IconCheck />}
        </div>
      ) : (
        <Text>{CommonConstants.EMPTY_VALUE_PLACEHOLDER}</Text>
      )}
      {!isEqual && hasConfirmation && (
        <div className='flex gap-xs'>
          <Text size='sm' fw={StylesConstants.HEAVY_FONT_WEIGHT}>
            {confirmValue?.primary}
          </Text>
          {translationKey.secondary && confirmValue?.secondary && (
            <Text
              size='sm'
              fw={StylesConstants.DEFAULT_FONT_WEIGHT}
              ml={5}
              c='dimmed'
            >
              ({t(translationKey.secondary)}: {confirmValue.secondary})
            </Text>
          )}
        </div>
      )}
    </Grid.Col>
  );
}
