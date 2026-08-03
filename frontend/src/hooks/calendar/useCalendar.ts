import { useApiData } from '@/hooks/useApiData';
import { CalendarService } from '@/services/calendar/calendar.service';
import type {
  CalendarOrder,
  CalendarQuery,
} from '@/types/calendar/calendar.types';

export function useCalendar(query: CalendarQuery): {
  data: CalendarOrder[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const processKey = (query.process ?? []).join(',');

  return useApiData<CalendarOrder[]>(
    () => CalendarService.getOrders(query),
    {
      initialData: [],
      dependencies: [query.year, query.month, processKey, query.type],
    },
  );
}
