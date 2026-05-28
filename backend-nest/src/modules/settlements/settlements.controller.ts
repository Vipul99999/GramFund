import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettlementsService } from './settlements.service';

@ApiTags('settlements')
@Controller({ path: 'settlements', version: '1' })
export class SettlementsController {
  constructor(private readonly service: SettlementsService) {}
  @Get() list() { return this.service.list(); }
}
