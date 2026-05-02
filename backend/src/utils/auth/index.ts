export type Role = 'ADMIN' | 'HANDLER' | 'FAMILY';
export const canAccess = (role: Role, allowed: Role[]) => allowed.includes(role);
