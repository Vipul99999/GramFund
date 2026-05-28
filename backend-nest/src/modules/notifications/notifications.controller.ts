import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}
  @Post('fallback') send(@Body() body: { userId: string; title: string; body: string }) { return this.service.sendFallback(body.userId, body.title, body.body); }
}
