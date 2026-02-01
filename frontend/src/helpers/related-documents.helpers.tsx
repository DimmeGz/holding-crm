import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
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
