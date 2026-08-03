import { calendarApi } from '@/api/calendar/calendar.api';
import type {
  CalendarOrder,
  CalendarQuery,
} from '@/types/calendar/calendar.types';

export class CalendarService {
  static async getOrders(query: CalendarQuery): Promise<CalendarOrder[]> {
    return calendarApi.getOrders(query);
  }
}
