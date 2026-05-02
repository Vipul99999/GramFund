import { apiFetch } from '../../../lib/api';

export const createPayment = (input: { fromFamilyId: string; toFamilyId: string; amount: number; mode: 'CASH' | 'ONLINE'; idempotencyKey: string }) =>
  apiFetch('/api/v1/payments', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': input.idempotencyKey }, body: JSON.stringify(input) });
