export const logInfo = (message: string, meta?: object) => console.info(message, meta ?? {});
export const logError = (message: string, meta?: object) => console.error(message, meta ?? {});
export const logAudit = (message: string, meta?: object) => console.log(`[AUDIT] ${message}`, meta ?? {});
