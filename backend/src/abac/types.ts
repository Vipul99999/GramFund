export type Role = 'ADMIN' | 'HANDLER' | 'FAMILY';

export type Action =
  | 'auth.register' | 'auth.login' | 'auth.logout' | 'auth.refresh' | 'auth.verify_email' | 'auth.sessions'
  | 'family.create' | 'family.view' | 'family.update' | 'family.link_user' | 'family.balance'
  | 'handler.create' | 'handler.view' | 'handler.performance' | 'handler.update'
  | 'event.create' | 'event.view' | 'event.update' | 'event.start_complete' | 'event.participants'
  | 'payment.create' | 'payment.confirm' | 'payment.view'
  | 'transaction.create' | 'transaction.view' | 'transaction.reverse'
  | 'ledger.view' | 'ledger.balance'
  | 'settlement.create' | 'settlement.execute' | 'settlement.view'
  | 'dispute.create' | 'dispute.view' | 'dispute.resolve'
  | 'report.summary' | 'report.family' | 'report.handler'
  | 'notification.view' | 'notification.create'
  | 'address.create' | 'address.view';

export interface PolicyUser {
  id: string;
  role: Role;
  isActive: boolean;
  addressId?: string | null;
  familyId?: string | null;
  lockUntil?: Date | null;
}

export interface PolicyResource {
  addressId?: string | null;
  familyId?: string | null;
  fromFamilyId?: string | null;
  toFamilyId?: string | null;
  participantFamilyIds?: string[];
  status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED';
  collectedByHandlerId?: string | null;
  handlerId?: string | null;
  requestedByUserId?: string | null;
}

export interface PolicyContext {
  now?: Date;
  ipBlocked?: boolean;
  actorType?: 'SYSTEM' | 'USER';
}
