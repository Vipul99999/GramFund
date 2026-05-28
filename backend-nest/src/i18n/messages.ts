export const MESSAGES = {
  en: { invalidCredentials: 'Invalid credentials', dailyLimitExceeded: 'Handler daily exposure limit exceeded', ivrPaymentConfirmed: 'Your GramFund payment has been recorded.' },
  hi: { invalidCredentials: 'अमान्य क्रेडेंशियल्स', dailyLimitExceeded: 'हैंडलर की दैनिक सीमा पार हो गई है', ivrPaymentConfirmed: 'आपका ग्रामफंड भुगतान दर्ज हो गया है।' },
  bn: { invalidCredentials: 'অবৈধ পরিচয়পত্র', dailyLimitExceeded: 'হ্যান্ডলারের দৈনিক সীমা অতিক্রম করেছে', ivrPaymentConfirmed: 'আপনার গ্রামফান্ড পেমেন্ট রেকর্ড হয়েছে।' },
  ta: { invalidCredentials: 'தவறான உள்நுழைவு விவரங்கள்', dailyLimitExceeded: 'ஹேண்ட்லரின் தினசரி வரம்பு மீறப்பட்டது', ivrPaymentConfirmed: 'உங்கள் கிராம்ஃபண்ட் கட்டணம் பதிவு செய்யப்பட்டது.' },
  mr: { invalidCredentials: 'अवैध लॉगिन माहिती', dailyLimitExceeded: 'हँडलरची दैनिक मर्यादा ओलांडली आहे', ivrPaymentConfirmed: 'तुमचे ग्रामफंड पेमेंट नोंदले गेले आहे.' },
  te: { invalidCredentials: 'చెల్లని ప్రవేశ వివరాలు', dailyLimitExceeded: 'హ్యాండ్లర్ దినసరి పరిమితి దాటింది', ivrPaymentConfirmed: 'మీ గ్రామ్‌ఫండ్ చెల్లింపు నమోదు చేయబడింది.' }
} as const;

export type SupportedLanguage = keyof typeof MESSAGES;
