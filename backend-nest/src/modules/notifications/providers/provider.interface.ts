export interface ProviderResult { success: boolean; providerMessageId?: string; error?: string }
export interface NotificationProvider { channel: 'PUSH'|'SMS'|'WHATSAPP'|'IVR'; send(toUserId: string, title: string, body: string): Promise<ProviderResult>; }
