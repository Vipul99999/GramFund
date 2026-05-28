import { Module } from '@nestjs/common';
import { ComplianceModule } from '../compliance/compliance.module';
import { ReadModelsController } from './read-models.controller';
import { ReadModelsService } from './read-models.service';

@Module({ imports: [ComplianceModule], controllers: [ReadModelsController], providers: [ReadModelsService] })
export class ReadModelsModule {}
