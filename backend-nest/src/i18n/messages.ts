export const MESSAGES = {
  en: {
    invalidCredentials: 'Invalid credentials',
    dailyLimitExceeded: 'Handler daily exposure limit exceeded'
  },
  hi: {
    invalidCredentials: 'अमान्य क्रेडेंशियल्स',
    dailyLimitExceeded: 'हैंडलर की दैनिक सीमा पार हो गई है'
  }
} as const;

export type SupportedLanguage = keyof typeof MESSAGES;
