export interface FamilyProfileUpdate {
  headName?: string;
  phoneNumber?: string;
}

export class FamilyService {
  updateOwnProfile(existing: { headName: string; phoneNumber?: string }, patch: FamilyProfileUpdate) {
    return { ...existing, ...patch };
  }
}
