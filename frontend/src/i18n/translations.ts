export type Locale = 'en' | 'hi';

export const messages = {
  en: {
    appTitle: 'GramFund', chooseLanguage: 'Language', login: 'Login', enterEmailPhone: 'Enter email or phone', password: 'Password',
    dashboard: 'Operator Dashboard', loading: 'Loading...', noData: 'No data', offlineSafeMode: 'Safe mode: low or no network',
    syncNow: 'Sync now', pendingQueue: 'Pending queue', conflicts: 'Conflicts', lastSync: 'Last sync', resolve: 'Resolve',
    txCreate: 'Create Transaction', trust: 'Trust', security: 'Security', compliance: 'Compliance', incidentPolicy: 'Incident Policy',
    noMoneyHeld: 'No money held by platform', logoutAll: 'Logout all sessions'
  },
  hi: {
    appTitle: 'ग्रामफंड', chooseLanguage: 'भाषा', login: 'लॉगिन', enterEmailPhone: 'ईमेल या फोन दर्ज करें', password: 'पासवर्ड',
    dashboard: 'ऑपरेटर डैशबोर्ड', loading: 'लोड हो रहा है...', noData: 'कोई डेटा नहीं', offlineSafeMode: 'सुरक्षित मोड: नेटवर्क कमजोर या बंद',
    syncNow: 'अभी सिंक करें', pendingQueue: 'लंबित कतार', conflicts: 'विवाद', lastSync: 'अंतिम सिंक', resolve: 'सुलझाएं',
    txCreate: 'लेनदेन बनाएँ', trust: 'विश्वास', security: 'सुरक्षा', compliance: 'अनुपालन', incidentPolicy: 'घटना नीति',
    noMoneyHeld: 'प्लेटफ़ॉर्म पैसे नहीं रखता', logoutAll: 'सभी सत्र लॉगआउट'
  }
} as const;
