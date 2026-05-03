import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  AUTH_TOKEN_SECRET: z.string().optional(),
  ALERT_WEBHOOK_URL: z.string().url().optional(),
  OTP_DAILY_CAP: z.coerce.number().default(200),
  OTP_PER_USER_DAILY_CAP: z.coerce.number().default(5),
  OTP_PER_VILLAGE_DAILY_CAP: z.coerce.number().default(100),
  USE_REAL_DB: z.enum(['true', 'false']).default('false')
});

export const env = EnvSchema.parse(process.env);

if (env.NODE_ENV === 'production' && env.USE_REAL_DB !== 'true') {
  throw new Error('USE_REAL_DB=true is required in production');
}
