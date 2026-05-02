export const buildNotificationMessage = (event: string, amount: number) => `${event}: contribution recorded for ₹${amount}`;
export const selectChannel = (priority: 'CRITICAL' | 'IMPORTANT' | 'LOW') => priority === 'CRITICAL' ? 'SMS' : priority === 'IMPORTANT' ? 'PUSH' : 'IN_APP';
