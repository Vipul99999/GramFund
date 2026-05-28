import { Module } from '@nestjs/common';
import { AssistedController } from './assisted.controller';
import { AssistedService } from './assisted.service';

@Module({ controllers: [AssistedController], providers: [AssistedService] })
export class AssistedModule {}
