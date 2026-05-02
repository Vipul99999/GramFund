import { z } from 'zod';

export const createTransactionSchema = z.object({
  fromFamilyId: z.string().min(1),
  toFamilyId: z.string().min(1),
  amount: z.number().positive()
});
