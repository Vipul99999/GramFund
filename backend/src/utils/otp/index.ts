import crypto from 'node:crypto';
export const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));
export const hashOTP = (otp: string) => crypto.createHash('sha256').update(otp).digest('hex');
export const verifyOTP = (otp: string, hashed: string) => hashOTP(otp) === hashed;
