const counters = new Map<string, number>();

export const incMetric = (name: string, by = 1) => counters.set(name, (counters.get(name) ?? 0) + by);
export const setMetric = (name: string, value: number) => counters.set(name, value);
export const metricsSnapshot = () => Object.fromEntries(counters.entries());
