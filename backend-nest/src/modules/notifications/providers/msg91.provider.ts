import { NotificationProvider } from './provider.interface';
export class Msg91Provider implements NotificationProvider { channel: 'SMS' = 'SMS'; async send(toUserId: string, title: string, body: string) { return { success: true, providerMessageId: `msg91-${toUserId}-${Date.now()}` }; } }
