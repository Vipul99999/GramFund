import { prisma } from '../../../lib/prisma.js';

export type FamilyLifecycleOperation = 'SPLIT' | 'MERGE';

export interface FamilySplitMergeRecord {
  sourceFamilyId: string;
  targetFamilyId: string;
  operation: FamilyLifecycleOperation;
  reason?: string;
  createdAt: Date;
}

const ENTITY = 'FAMILY_LIFECYCLE';

export class FamilySplitMergeService {
  async record(input: Omit<FamilySplitMergeRecord, 'createdAt'>) {
    const rec: FamilySplitMergeRecord = { ...input, createdAt: new Date() };
    await prisma.auditLog.create({
      data: {
        entity: ENTITY,
        entityId: `${input.sourceFamilyId}:${input.targetFamilyId}`,
        action: input.operation,
        data: rec,
        createdAt: rec.createdAt
      } as any
    });
    return rec;
  }

  async listByFamily(familyId: string) {
    const logs = await prisma.auditLog.findMany({ where: { entity: ENTITY } } as any);
    return (logs as any[])
      .map((l) => l.data as FamilySplitMergeRecord)
      .filter((r) => r.sourceFamilyId === familyId || r.targetFamilyId === familyId);
  }
}
