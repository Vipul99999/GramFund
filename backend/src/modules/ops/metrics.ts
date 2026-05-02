const counters = new Map<string, number>();
export const incMetric = (name: string) => counters.set(name, (counters.get(name) ?? 0) + 1);
export const metricsSnapshot = () => Object.fromEntries(counters.entries());
