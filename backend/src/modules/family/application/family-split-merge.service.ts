export type FamilyLifecycleOperation = 'SPLIT' | 'MERGE';

export interface FamilySplitMergeRecord {
  sourceFamilyId: string;
  targetFamilyId: string;
  operation: FamilyLifecycleOperation;
  reason?: string;
  createdAt: Date;
}

export class FamilySplitMergeService {
  private readonly records: FamilySplitMergeRecord[] = [];

  record(input: Omit<FamilySplitMergeRecord, 'createdAt'>) {
    const rec: FamilySplitMergeRecord = { ...input, createdAt: new Date() };
    this.records.push(rec);
    return rec;
  }

  listByFamily(familyId: string) {
    return this.records.filter((r) => r.sourceFamilyId === familyId || r.targetFamilyId === familyId);
  }
}
