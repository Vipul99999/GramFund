export const ROLES = ['ADMIN', 'HANDLER', 'FAMILY'] as const;
export type Role = (typeof ROLES)[number];
