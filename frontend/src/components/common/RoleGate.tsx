'use client';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyState } from './StateBlocks';

export function RoleGate({ roles, children }: { roles: ('ADMIN'|'HANDLER'|'FAMILY'|'COMMUNITY_ADMIN')[]; children: React.ReactNode }) {
  const auth = useAuth();
  if (!auth.user) return <EmptyState message="Login required." />;
  if (!auth.hasRole(roles)) return <EmptyState message="You do not have permission for this section." />;
  return <>{children}</>;
}
