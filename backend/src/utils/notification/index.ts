import { NotificationPriority } from '../../jobs/contracts.js';

export const selectChannel = (priority: NotificationPriority) => {
  if (priority === 'LOW') return 'IN_APP';
  if (priority === 'IMPORTANT') return 'PUSH';
  return 'PUSH';
};
