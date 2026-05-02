export type Locale = 'en' | 'hi';

export const messages = {
  en: {
    appTitle: 'GramFund',
    chooseLanguage: 'Language',
    login: 'Login',
    enterEmailPhone: 'Enter email or phone',
    password: 'Password',
    otp: 'OTP',
    sendOtp: 'Send OTP',
    loginSuccess: 'Login successful',
    otpSent: 'OTP sent. Enter OTP to continue.',
    googleLogin: 'Login with Google',
    about: 'About GramFund',
    financialPolicy: 'Financial Integrity Policy',
  },
  hi: {
    appTitle: 'ग्रामफंड',
    chooseLanguage: 'भाषा',
    login: 'लॉगिन',
    enterEmailPhone: 'ईमेल या फोन दर्ज करें',
    password: 'पासवर्ड',
    otp: 'ओटीपी',
    sendOtp: 'ओटीपी भेजें',
    loginSuccess: 'लॉगिन सफल',
    otpSent: 'ओटीपी भेज दिया गया है। जारी रखने के लिए ओटीपी दर्ज करें।',
    googleLogin: 'गूगल से लॉगिन',
    about: 'ग्रामफंड के बारे में',
    financialPolicy: 'वित्तीय सत्यनिष्ठा नीति',
  }
} as const;
