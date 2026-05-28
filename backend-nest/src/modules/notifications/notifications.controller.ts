import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}
  @Post('fallback') send(@Body() body: { userId: string; title: string; body: string }) { return this.service.processFallback(body.userId, body.title, body.body); }
  @Patch('callback') cb(@Body() body: { deliveryId: string; status: 'DELIVERED' | 'FAILED'; signature: string; rawPayload: string }) { return this.service.callback(body.deliveryId, body.status, body.signature, body.rawPayload); }
}
