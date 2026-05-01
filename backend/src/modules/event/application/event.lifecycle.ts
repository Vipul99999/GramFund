export type EventState = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED';

export const transitionEvent = (current: EventState, action: 'start' | 'complete' | 'archive' | 'cancel'): EventState => {
  const map: Record<EventState, Partial<Record<typeof action, EventState>>> = {
    DRAFT: { start: 'ACTIVE', cancel: 'CANCELLED' },
    ACTIVE: { complete: 'COMPLETED', cancel: 'CANCELLED' },
    COMPLETED: { archive: 'ARCHIVED' },
    ARCHIVED: {},
    CANCELLED: {}
  };
  const next = map[current][action];
  if (!next) throw new Error(`Invalid transition ${current} -> ${action}`);
  return next;
};
