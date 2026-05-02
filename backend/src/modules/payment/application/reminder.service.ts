export interface ReminderTask {
  familyId: string;
  eventId?: string;
  reason: string;
  dueAt: Date;
}

export class ReminderService {
  private readonly tasks: ReminderTask[] = [];

  enqueue(task: ReminderTask) {
    this.tasks.push(task);
    return task;
  }

  listPending(now = new Date()) {
    return this.tasks.filter((t) => t.dueAt <= now);
  }
}
