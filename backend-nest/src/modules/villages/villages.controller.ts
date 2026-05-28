import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VillagesService } from './villages.service';

@ApiTags('villages')
@Controller({ path: 'villages', version: '1' })
export class VillagesController {
  constructor(private readonly service: VillagesService) {}
  @Get() list() { return this.service.list(); }
}
