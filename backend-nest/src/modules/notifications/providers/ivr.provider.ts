import { NotificationProvider } from './provider.interface';
export class IvrProvider implements NotificationProvider { channel: 'IVR' = 'IVR'; async send(toUserId: string, title: string, body: string) { return { success: true, providerMessageId: `ivr-${toUserId}-${Date.now()}` }; } }
