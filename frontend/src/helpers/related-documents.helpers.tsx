import type { ReactNode } from 'react';
import {
  Group,
  type RenderTreeNodePayload,
  type TreeNodeData,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

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
      <Group gap={5} onClick={() => tree.toggleExpanded(node.value)}>
        <span>
          {}
          {node.label}
        </span>

        {hasChildren && (
          <IconChevronDown
            size={14}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        )}
      </Group>
    </Group>
  );
}
