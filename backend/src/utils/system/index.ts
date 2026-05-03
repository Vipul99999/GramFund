export const generateTxnId = () => `txn_${Date.now()}`;
export const generateReferenceId = () => `ref_${Math.random().toString(36).slice(2, 10)}`;
export const getCurrentTime = () => new Date();
export const isExpired = (date: Date) => date.getTime() < Date.now();
