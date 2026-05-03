export const processSyncQueue = async <T>(items: T[], fn: (item: T) => Promise<void>) => Promise.all(items.map(fn));
export const retryFailedActions = async <T>(actions: (() => Promise<T>)[]) => Promise.allSettled(actions.map((a) => a()));
export const resolveConflict = <T>(local: T, server: T) => server ?? local;
