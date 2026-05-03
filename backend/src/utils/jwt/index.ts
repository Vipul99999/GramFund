export const signToken = (payload: object) => Buffer.from(JSON.stringify(payload)).toString('base64url');
export const verifyToken = (token: string) => Boolean(token);
export const decodeToken = (token: string) => JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
