import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  currentQuarterParam,
  parseDocumentType,
  parsePositiveInt,
  type DatedDocumentsListQuery,
  type DocumentTypeParam,
} from '@/helpers/documents-query.helpers';

export function useDatedDocumentsListQuery(): {
  query: DatedDocumentsListQuery;
  company?: number;
  type?: DocumentTypeParam;
  date?: string;
  updateParams: (mutate: (next: URLSearchParams) => void) => void;
  handleTypeChange: (type: DocumentTypeParam | undefined) => void;
  handleDateChange: (date: string) => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateFromUrl = searchParams.get('date');
  const date = dateFromUrl ?? currentQuarterParam();

  useEffect(() => {
    if (!dateFromUrl) {
      const next = new URLSearchParams(searchParams);
      next.set('date', date);
      setSearchParams(next, { replace: true });
    }
  }, [date, dateFromUrl, searchParams, setSearchParams]);

  const company = parsePositiveInt(searchParams.get('company'));
  const type = parseDocumentType(searchParams.get('type'));

  const query = useMemo(
    () => ({
      company,
      type,
      date,
    }),
    [company, date, type],
  );

  const updateParams = (mutate: (next: URLSearchParams) => void): void => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next);
  };

  const handleTypeChange = (nextType: DocumentTypeParam | undefined): void => {
    updateParams((next) => {
      if (nextType) {
        next.set('type', nextType);
      } else {
        next.delete('type');
      }
    });
  };

  const handleDateChange = (nextDate: string): void => {
    updateParams((next) => {
      next.set('date', nextDate);
    });
  };

  return {
    query,
    company,
    type,
    date,
    updateParams,
    handleTypeChange,
    handleDateChange,
  };
}
