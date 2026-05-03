export async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delayMs = 100): Promise<T> {
  let err: unknown;
  for (let i = 0; i <= retries; i += 1) {
    try { return await fn(); } catch (e) { err = e; }
    await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
  }
  throw err;
}
