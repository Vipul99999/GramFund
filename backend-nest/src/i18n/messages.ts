export const MESSAGES = {
  en: { invalidCredentials: 'Invalid credentials', dailyLimitExceeded: 'Handler daily exposure limit exceeded' },
  hi: { invalidCredentials: 'अमान्य क्रेडेंशियल्स', dailyLimitExceeded: 'हैंडलर की दैनिक सीमा पार हो गई है' },
  bn: { invalidCredentials: 'অবৈধ পরিচয়পত্র', dailyLimitExceeded: 'হ্যান্ডলারের দৈনিক সীমা অতিক্রম করেছে' },
  ta: { invalidCredentials: 'தவறான உள்நுழைவு விவரங்கள்', dailyLimitExceeded: 'ஹேண்ட்லரின் தினசரி வரம்பு மீறப்பட்டது' }
} as const;

export type SupportedLanguage = keyof typeof MESSAGES;
