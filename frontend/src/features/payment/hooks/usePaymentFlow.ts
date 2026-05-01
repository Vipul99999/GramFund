'use client';
import { useOffline } from '../../../hooks/useOffline';
import { useNetworkQuality } from '../../../hooks/useNetworkQuality';
import { createPayment } from '../services/payment.service';

export const usePaymentFlow = () => {
  const { enqueueOffline } = useOffline();
  const quality = useNetworkQuality();

  const submitPayment = async (input: { fromFamilyId: string; toFamilyId: string; amount: number; mode: 'CASH' | 'ONLINE' }) => {
    const idempotencyKey = `${input.fromFamilyId}:${input.toFamilyId}:${input.amount}:${Date.now()}`;
    if (quality === 'OFFLINE' || quality === 'POOR') {
      await enqueueOffline('payment.create', input, idempotencyKey);
      return { queued: true };
    }
    await createPayment({ ...input, idempotencyKey });
    return { queued: false };
  };

  return { submitPayment, quality };
};
