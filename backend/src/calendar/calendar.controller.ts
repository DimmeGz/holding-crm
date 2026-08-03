import { Controller, Get, Query } from '@nestjs/common';

import { CalendarService } from './calendar.service';
import { CalendarOrderDTO, GetCalendarQueryDTO } from './dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('orders')
  getCalendarOrders(
    @Query() query: GetCalendarQueryDTO,
  ): Promise<CalendarOrderDTO[]> {
    return this.calendarService.getCalendarOrders(query);
  }
}
