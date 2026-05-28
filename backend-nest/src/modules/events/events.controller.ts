import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(private readonly service: EventsService) {}
  @Get() list() { return this.service.list(); }
}
