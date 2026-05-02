import { prisma } from '../../../lib/prisma.js';
import { LedgerEntry } from '../application/ledger.service.js';

export class LedgerRepository {
  async createMany(entries: LedgerEntry[]) {
    for (const entry of entries) {
      await prisma.ledgerEntry.create({ data: entry as unknown as Record<string, unknown> });
    }
    return entries;
  }
}
