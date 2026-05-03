export const validateTransaction = (amount: number) => amount > 0;
export const calculateExpected = (expected: number, paid: number) => Math.max(expected - paid, 0);
