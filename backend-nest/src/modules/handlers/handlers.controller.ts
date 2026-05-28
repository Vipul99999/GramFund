import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HandlersService } from './handlers.service';

@ApiTags('handlers')
@Controller({ path: 'handlers', version: '1' })
export class HandlersController {
  constructor(private readonly service: HandlersService) {}
  @Get() list() { return this.service.list(); }
}
