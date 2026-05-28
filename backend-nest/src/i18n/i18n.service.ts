import { Injectable } from '@nestjs/common';
import { MESSAGES, SupportedLanguage } from './messages';

@Injectable()
export class I18nService {
  t(key: keyof (typeof MESSAGES)['en'], lang?: string) {
    const l: SupportedLanguage = lang === 'hi' ? 'hi' : 'en';
    return MESSAGES[l][key];
  }
}
