type TxCallback<T> = (tx: PrismaLikeClient) => Promise<T>;

type Row = Record<string, unknown>;

class MemoryTable {
  rows: Row[] = [];
  async create({ data }: { data: Row }) { this.rows.push(data); return data; }
  async findUnique({ where }: { where: Row }) { return this.rows.find((r) => Object.entries(where).every(([k, v]) => r[k] === v)) ?? null; }
}

export interface PrismaLikeClient {
  transaction: MemoryTable;
  ledgerEntry: MemoryTable;
  payment: MemoryTable;
  syncReplay: MemoryTable;
  $transaction<T>(cb: TxCallback<T>): Promise<T>;
}

export const prisma: PrismaLikeClient = {
  transaction: new MemoryTable(),
  ledgerEntry: new MemoryTable(),
  payment: new MemoryTable(),
  syncReplay: new MemoryTable(),
  async $transaction<T>(cb: TxCallback<T>) { return cb(this); }
};
