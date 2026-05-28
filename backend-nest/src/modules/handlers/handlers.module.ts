import { Module } from '@nestjs/common';
import { HandlersController } from './handlers.controller';
import { HandlersService } from './handlers.service';

@Module({ controllers: [HandlersController], providers: [HandlersService] })
export class HandlersModule {}
