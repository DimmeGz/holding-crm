import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Divider,
  getTreeExpandedState,
  Group,
  Text,
  Tree,
  type TreeNodeData,
  useTree,
  type UseTreeReturnType,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { StylesConstants } from '@/constants/styles.constants';
import {
  getAllValues,
  renderTreeNode,
} from '@/helpers/related-documents.helpers';

export function ContractRelatedDocuments({
  orders,
}: {
  orders: TreeNodeData[];
}): ReactNode {
  const { t } = useTranslation(['documents']),
    [isExpanded, setIsExpanded] = useState(false),
    tree: UseTreeReturnType | undefined = useTree({
      initialExpandedState: getTreeExpandedState(orders, '*'),
    });

  useEffect(() => {
    if (orders) {
      const allValues: string[] = getAllValues(orders);
      allValues.forEach(value => tree.expand(value));
    }
  }, [orders, tree]);

  return (
    <Card shadow='sm' p='md' radius='md' withBorder mb='sm'>
      <Group justify='space-between' wrap='nowrap' gap='2'>
        <Text fw={StylesConstants.HEAVY_FONT_WEIGHT} size='md' mb='5'>
          {t('documents:documents.relatedDocuments')}
        </Text>
        <IconChevronDown
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            cursor: 'pointer',
          }}
          onClick={() => setIsExpanded(prev => !prev)}
        />
      </Group>
      {isExpanded && (
        <>
          <Divider my='xs' />
          <Tree
            tree={tree}
            data={orders}
            levelOffset={23}
            expandOnClick={false}
            renderNode={renderTreeNode}
          />
        </>
      )}
    </Card>
  );
}
