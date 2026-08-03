import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CalendarOrder,
  CalendarQuery,
} from '@/types/calendar/calendar.types';

function buildCalendarQuery(query: CalendarQuery): string {
  const params = new URLSearchParams();
  params.set('year', String(query.year));
  params.set('month', String(query.month));

  if (query.type) {
    params.set('type', query.type);
  }

  for (const processId of query.process ?? []) {
    params.append('process', String(processId));
  }

  const search = params.toString();
  return search ? `?${search}` : '';
}

export const calendarApi = {
  getOrders(query: CalendarQuery): Promise<CalendarOrder[]> {
    return apiClient.get<CalendarOrder[]>(
      `${UrlConstants.CALENDAR_URL}/orders${buildCalendarQuery(query)}`,
    );
  },
};
