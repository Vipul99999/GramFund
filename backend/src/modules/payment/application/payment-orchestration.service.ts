import { prisma } from '../../../lib/prisma.js';
import { TransactionService } from '../../transaction/application/transaction.service.js';
import { LedgerService } from '../../ledger/application/ledger.service.js';
import { LedgerRepository } from '../../ledger/infra/ledger.repository.js';
import { PaymentRepository } from '../infra/payment.repository.js';

export interface PaymentInput {
  fromFamilyId: string;
  toFamilyId: string;
  amount: number;
  mode: 'CASH' | 'ONLINE';
  proofImageUrl?: string;
}

export class PaymentOrchestrationService {
  constructor(
    private readonly transactionService = new TransactionService(),
    private readonly ledgerService = new LedgerService(),
    private readonly ledgerRepo = new LedgerRepository(),
    private readonly paymentRepo = new PaymentRepository()
  ) {}

  async processPayment(input: PaymentInput) {
    return prisma.$transaction(async () => {
      const payment = await this.paymentRepo.create({
        id: `pay_${Date.now()}`,
        fromFamilyId: input.fromFamilyId,
        toFamilyId: input.toFamilyId,
        amount: input.amount,
        mode: input.mode,
        status: 'SUCCESS'
      });

      const transaction = await this.transactionService.create({
        fromFamilyId: input.fromFamilyId,
        toFamilyId: input.toFamilyId,
        amount: input.amount
      });

      const ledgerEntries = this.ledgerService.postDoubleEntry({
        fromFamilyId: input.fromFamilyId,
        toFamilyId: input.toFamilyId,
        amount: input.amount,
        transactionId: transaction.id
      });
      await this.ledgerRepo.createMany(ledgerEntries);

      return { payment, transaction, ledgerEntries };
    });
  }
}
