import { Module } from '@nestjs/common';
import { TransparencyController } from './transparency.controller';
import { TransparencyService } from './transparency.service';

@Module({ controllers: [TransparencyController], providers: [TransparencyService] })
export class TransparencyModule {}
