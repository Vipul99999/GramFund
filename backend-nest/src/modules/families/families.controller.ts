import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FamiliesService } from './families.service';

@ApiTags('families')
@Controller({ path: 'families', version: '1' })
export class FamiliesController {
  constructor(private readonly service: FamiliesService) {}
  @Get() list() { return this.service.list(); }
}
