import { prisma } from '../../../lib/prisma.js';

export type FamilyLifecycleOperation = 'SPLIT' | 'MERGE';

export interface FamilySplitMergeRecord {
  sourceFamilyId: string;
  targetFamilyId: string;
  operation: FamilyLifecycleOperation;
  reason?: string;
  createdAt: Date;
}

export class FamilySplitMergeService {
  async record(input: Omit<FamilySplitMergeRecord, 'createdAt'>) {
    const rec: FamilySplitMergeRecord = { ...input, createdAt: new Date() };
    await prisma.familySplitMerge.create({
      data: {
        sourceFamilyId: input.sourceFamilyId,
        targetFamilyId: input.targetFamilyId,
        reason: `${input.operation}:${input.reason ?? ''}`,
        createdAt: rec.createdAt
      } as any
    });
    return rec;
  }

  async listByFamily(familyId: string) {
    const rows = await prisma.familySplitMerge.findMany();
    return (rows as any[])
      .filter((r) => r.sourceFamilyId === familyId || r.targetFamilyId === familyId)
      .map((r) => ({
        sourceFamilyId: r.sourceFamilyId,
        targetFamilyId: r.targetFamilyId,
        operation: String(r.reason ?? '').startsWith('MERGE:') ? 'MERGE' : 'SPLIT',
        reason: String(r.reason ?? '').split(':').slice(1).join(':') || undefined,
        createdAt: new Date(r.createdAt)
      } as FamilySplitMergeRecord));
  }
}
