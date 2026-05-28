import { NotificationProvider } from './provider.interface';
export class FcmProvider implements NotificationProvider { channel: 'PUSH' = 'PUSH'; async send(toUserId: string, title: string, body: string) { return { success: true, providerMessageId: `fcm-${toUserId}-${Date.now()}` }; } }
