import { prisma } from '../../../lib/prisma.js';

export interface ReminderTask {
  familyId: string;
  eventId?: string;
  reason: string;
  dueAt: Date;
  sentAt?: Date;
}

export class ReminderService {
  async enqueue(task: ReminderTask) {
    await prisma.reminderTask.create({
      data: {
        familyId: task.familyId,
        eventId: task.eventId,
        reason: task.reason,
        dueAt: task.dueAt,
        sentAt: task.sentAt ?? null
      } as any
    });
  }

  async listPending(asOf = new Date()) {
    const rows = await prisma.reminderTask.findMany();
    return (rows as any[])
      .filter((t) => new Date(t.dueAt) <= asOf && !t.sentAt)
      .map((t) => ({ familyId: t.familyId, eventId: t.eventId ?? undefined, reason: t.reason, dueAt: new Date(t.dueAt), sentAt: t.sentAt ? new Date(t.sentAt) : undefined }));
  }
}
