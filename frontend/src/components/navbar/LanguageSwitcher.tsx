// src/components/LanguageSwitcher.tsx
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';

export default function LanguageSwitcher(): ReactNode {
  const { i18n } = useTranslation();

  const languages: {
    value: string;
    label: string;
  }[] = [
    { value: 'uk', label: '🇺🇦' },
    { value: 'cz', label: '🇨🇿' },
  ];

  return (
    <Select
      value={i18n.language || 'uk'}
      onChange={(value: string | null) => value && i18n.changeLanguage(value)}
      data={languages}
      w={80}
    />
  );
}
