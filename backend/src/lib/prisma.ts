import type { PrismaClient as PrismaClientType } from '@prisma/client';

type TxCallback<T> = (tx: PrismaLikeClient) => Promise<T>;
type Row = Record<string, unknown>;

class MemoryTable {
  rows: Row[] = [];
  async create({ data }: { data: Row }) { this.rows.push(data); return data; }
  async findUnique({ where }: { where: Row }) { return this.rows.find((r) => Object.entries(where).every(([k, v]) => r[k] === v)) ?? null; }
  async findMany({ where }: { where?: Row } = {}) {
    if (!where) return [...this.rows];
    return this.rows.filter((r) => Object.entries(where).every(([k, v]) => r[k] === v));
  }
  async update({ where, data }: { where: Row; data: Row }) {
    const idx = this.rows.findIndex((r) => Object.entries(where).every(([k, v]) => r[k] === v));
    if (idx < 0) throw new Error('Row not found');
    this.rows[idx] = { ...this.rows[idx], ...data };
    return this.rows[idx];
  }
  async upsert({ where, create, update }: { where: Row; create: Row; update: Row }) {
    const found = await this.findUnique({ where });
    if (!found) return this.create({ data: create });
    return this.update({ where, data: update });
  }
}

interface MemoryPrismaLike {
  transaction: MemoryTable;
  ledgerEntry: MemoryTable;
  payment: MemoryTable;
  syncReplay: MemoryTable;
  user: MemoryTable;
  passwordReset: MemoryTable;
  otpRecord: MemoryTable;
  riskState: MemoryTable;
  userSession: MemoryTable;
  securityEvent: MemoryTable;
  quotaUsage: MemoryTable;
  notificationLog: MemoryTable;
  auditLog: MemoryTable;
  $transaction<T>(cb: TxCallback<T>): Promise<T>;
}

export type PrismaLikeClient = MemoryPrismaLike & Partial<PrismaClientType>;

function createMemoryPrisma(): MemoryPrismaLike {
  return {
    transaction: new MemoryTable(),
    ledgerEntry: new MemoryTable(),
    payment: new MemoryTable(),
    syncReplay: new MemoryTable(),
    user: new MemoryTable(),
    passwordReset: new MemoryTable(),
    otpRecord: new MemoryTable(),
    riskState: new MemoryTable(),
    userSession: new MemoryTable(),
    securityEvent: new MemoryTable(),
    quotaUsage: new MemoryTable(),
    notificationLog: new MemoryTable(),
    auditLog: new MemoryTable(),
    async $transaction<T>(cb: TxCallback<T>) { return cb(this as PrismaLikeClient); }
  };
}

const useMemory = process.env.USE_REAL_DB !== 'true';

let prismaClient: PrismaLikeClient;
if (useMemory) {
  prismaClient = createMemoryPrisma();
} else {
  const { PrismaClient } = await import('@prisma/client');
  prismaClient = new PrismaClient() as unknown as PrismaLikeClient;
}

export const prisma = prismaClient;
