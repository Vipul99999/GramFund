import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { I18nService } from './i18n/i18n.service';
import { AuthModule } from './modules/auth/auth.module';
import { VillagesModule } from './modules/villages/villages.module';
import { FamiliesModule } from './modules/families/families.module';
import { HandlersModule } from './modules/handlers/handlers.module';
import { EventsModule } from './modules/events/events.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { SettlementsModule } from './modules/settlements/settlements.module';
import { FraudModule } from './modules/fraud/fraud.module';
import { AuditModule } from './modules/audit/audit.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { AssistedModule } from './modules/assisted/assisted.module';
import { SyncModule } from './modules/sync/sync.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PeriodCloseModule } from './modules/period-close/period-close.module';
import { SuccessionModule } from './modules/succession/succession.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, VillagesModule, FamiliesModule, HandlersModule, EventsModule, TransactionsModule, SettlementsModule, FraudModule, AuditModule, ReceiptsModule, ApprovalsModule, AssistedModule, SyncModule, NotificationsModule, PeriodCloseModule, SuccessionModule],
  providers: [I18nService],
  exports: [I18nService]
})
export class AppModule {}
