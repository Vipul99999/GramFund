export const formatCurrency = (amount: number, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
export const formatDate = (value: Date) => value.toISOString();
