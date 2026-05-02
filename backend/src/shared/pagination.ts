export const getPaginationParams = (page = 1, limit = 20) => ({ page: Math.max(1, page), limit: Math.max(1, Math.min(limit, 100)) });
