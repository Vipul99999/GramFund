export const calculateNetBalance = (totalReceived: number, totalGiven: number) => totalReceived - totalGiven;
export const applyLedgerEntry = (ledger: { totalGiven: number; totalReceived: number }, amount: number, type: 'given' | 'received') => ({
  totalGiven: type === 'given' ? ledger.totalGiven + amount : ledger.totalGiven,
  totalReceived: type === 'received' ? ledger.totalReceived + amount : ledger.totalReceived
});
