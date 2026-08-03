import type { RouteObject } from 'react-router-dom';
import { CalendarPage } from '@/components/calendar/CalendarPage';
import { UrlConstants } from '@/constants/url-constants';

export const calendarRoutes: RouteObject = {
  path: UrlConstants.CALENDAR_URL,
  children: [
    {
      index: true,
      element: <CalendarPage />,
    },
  ],
};
