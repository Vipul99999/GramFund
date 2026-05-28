import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransparencyService } from './transparency.service';

@ApiTags('transparency')
@Controller({ path: 'transparency', version: '1' })
export class TransparencyController {
  constructor(private readonly service: TransparencyService) {}
  @Get('community-wall/:villageId') wall(@Param('villageId') villageId: string) { return this.service.communityWall(villageId); }
}
