import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().min(1),
  familyId: z.string().min(1),
  eventId: z.string().optional(),
  to: z.string().min(3),
  message: z.string().min(1).max(500),
  priority: z.enum(['LOW', 'IMPORTANT', 'CRITICAL']).default('LOW')
});
