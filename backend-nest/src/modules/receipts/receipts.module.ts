import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { ObjectStorageService } from './storage/object-storage.service';

@Module({ controllers: [ReceiptsController], providers: [ReceiptsService, ObjectStorageService] })
export class ReceiptsModule {}
