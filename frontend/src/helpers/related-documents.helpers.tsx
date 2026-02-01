import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Group,
  type RenderTreeNodePayload,
  type TreeNodeData,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
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
): TreeNodeData[] {
  return orders.map(order => ({
    value: `orders/${order.id}`,
    label: `Замовлення №${order.id}`,
    children: [
      ...(order.invoices?.map(invoice => ({
        value: `invoices/${invoice.id}`,
        label: `Рахунок ${invoice.invoiceNumber}`,
        children: [
          ...(invoice.shipments?.map(shipment => ({
            value: `shipments/${shipment.id}`,
            label: `Відвантаження №${shipment.id}`,
            children: [
              ...(shipment.receives?.map(receive => ({
                value: `receives/${receive.id}`,
                label: `Надходження №${receive.id}`,
              })) || []),
            ],
          })) || []),
          ...(invoice.payments?.map(payment => ({
            value: `payments/${payment.id}`,
            label: `Платіж №${payment.id}`,
          })) || []),
        ],
      })) || []),
    ],
  }));
}
