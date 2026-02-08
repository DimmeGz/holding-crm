import type { TFunction } from 'i18next';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Group,
  type RenderTreeNodePayload,
  type TreeNodeData,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { CommonConstants } from '@/constants/common.constants';
import type { ContractRelatedDocument } from '@/types/documents/contracts.types';

export function getAllValues(nodes: TreeNodeData[]): string[] {
  return nodes.flatMap(node => [
    node.value,
    ...(node.children ? getAllValues(node.children) : []),
  ]);
}

export function renderTreeNode(payload: RenderTreeNodePayload): ReactNode {
  const { node, expanded, hasChildren, elementProps, tree } = payload;

  return (
    <Group gap='xs' {...elementProps}>
      <Group gap={5}>
        <Link to={`/${node.value}`}>{node.label}</Link>

        {hasChildren && (
          <IconChevronDown
            size={14}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            onClick={() => tree.toggleExpanded(node.value)}
          />
        )}
      </Group>
    </Group>
  );
}

export function transformContractRelatedDocumentsToTreeData(
  orders: ContractRelatedDocument[],
  t: TFunction<readonly ['common', 'documents'], undefined>,
): TreeNodeData[] {
  return orders.map(order => ({
    value: `orders/${order.id}`,
    label: `${t('documents:documents.order')} ${CommonConstants.NUMBER}${order.id}`,
    children: [
      ...(order.invoices?.map(invoice => ({
        value: `invoices/${invoice.id}`,
        label: `${t('documents:documents.invoice')} ${invoice.invoiceNumber}`,
        children: [
          ...(invoice.shipments?.map(shipment => ({
            value: `shipments/${shipment.id}`,
            label: `${t('documents:documents.shipment')} ${CommonConstants.NUMBER}${shipment.id}`,
            children: [
              ...(shipment.receives?.map(receive => ({
                value: `receives/${receive.id}`,
                label: `${t('documents:documents.receive')} ${CommonConstants.NUMBER}${receive.id}`,
              })) || []),
            ],
          })) || []),
          ...(invoice.payments?.map(payment => ({
            value: `payments/${payment.id}`,
            label: `${t('documents:documents.payment')} ${CommonConstants.NUMBER}${payment.id}`,
          })) || []),
        ],
      })) || []),
    ],
  }));
}
