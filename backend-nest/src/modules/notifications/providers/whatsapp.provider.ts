import { NotificationProvider } from './provider.interface';
export class WhatsappProvider implements NotificationProvider { channel: 'WHATSAPP' = 'WHATSAPP'; async send(toUserId: string, title: string, body: string) { return { success: true, providerMessageId: `wa-${toUserId}-${Date.now()}` }; } }
