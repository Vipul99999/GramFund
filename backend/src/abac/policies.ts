import { Action, PolicyContext, PolicyResource, PolicyUser } from './types.js';

const isAdmin = (u?: PolicyUser) => u?.role === 'ADMIN';
const sameAddress = (u?: PolicyUser, r?: PolicyResource) => Boolean(u?.addressId && r?.addressId && u.addressId === r.addressId);
const ownFamily = (u?: PolicyUser, r?: PolicyResource) => Boolean(u?.familyId && r?.familyId && u.familyId === r.familyId);
const involvedInTxn = (u?: PolicyUser, r?: PolicyResource) => Boolean(u?.familyId && (u.familyId === r?.fromFamilyId || u.familyId === r?.toFamilyId));

export function globalDeny(user: PolicyUser | null | undefined, context: PolicyContext): boolean {
  const now = context.now ?? new Date();
  if (!user || !user.isActive) return true;
  if (user.lockUntil && user.lockUntil > now) return true;
  if (context.ipBlocked) return true;
  return false;
}

export const policies: Record<Action, (user: PolicyUser | null | undefined, resource: PolicyResource, context: PolicyContext) => boolean> = {
  'auth.register': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r))),
  'auth.login': () => true,
  'auth.logout': (u) => !!u,
  'auth.refresh': (u) => !!u,
  'auth.verify_email': () => true,
  'auth.sessions': (u, r) => !!u && (isAdmin(u) || r.requestedByUserId === u.id),

  'family.create': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r))),
  'family.view': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || (u.role === 'FAMILY' && ownFamily(u, r))),
  'family.update': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || (u.role === 'FAMILY' && ownFamily(u, r))),
  'family.link_user': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r))),
  'family.balance': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || ownFamily(u, r)),

  'handler.create': (u) => !!u && isAdmin(u),
  'handler.view': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && u.id === r.handlerId)),
  'handler.performance': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && u.id === r.handlerId)),
  'handler.update': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && u.id === r.handlerId)),

  'event.create': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r))),
  'event.view': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || (u.role === 'FAMILY' && !!u.familyId && r.participantFamilyIds?.includes(u.familyId))),
  'event.update': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r) && r.status === 'DRAFT')),
  'event.start_complete': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r))),
  'event.participants': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r))),

  'payment.create': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || ownFamily(u, r)),
  'payment.confirm': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && u.id === r.collectedByHandlerId)),
  'payment.view': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || ownFamily(u, r)),

  'transaction.create': (u, _r, c) => c.actorType === 'SYSTEM' || !!u,
  'transaction.view': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || involvedInTxn(u, r)),
  'transaction.reverse': (u) => !!u && isAdmin(u),

  'ledger.view': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || ownFamily(u, r)),
  'ledger.balance': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || ownFamily(u, r)),

  'settlement.create': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r))),
  'settlement.execute': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r))),
  'settlement.view': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || ownFamily(u, r)),

  'dispute.create': (u, r) => !!u && ((u.role === 'FAMILY' && involvedInTxn(u, r)) || (u.role === 'HANDLER' && sameAddress(u, r)) || isAdmin(u)),
  'dispute.view': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || involvedInTxn(u, r)),
  'dispute.resolve': (u) => !!u && isAdmin(u),

  'report.summary': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r))),
  'report.family': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && sameAddress(u, r)) || ownFamily(u, r)),
  'report.handler': (u, r) => !!u && (isAdmin(u) || (u.role === 'HANDLER' && u.id === r.handlerId)),

  'notification.view': (u, r) => !!u && (isAdmin(u) || ownFamily(u, r)),
  'notification.create': (u, _r, c) => c.actorType === 'SYSTEM' || !!u?.role && isAdmin(u),

  'address.create': (u) => !!u && isAdmin(u),
  'address.view': (u) => !!u
};

export function can(action: Action, user: PolicyUser | null | undefined, resource: PolicyResource = {}, context: PolicyContext = {}): boolean {
  if (globalDeny(user, context)) return false;
  return policies[action](user, resource, context);
}
