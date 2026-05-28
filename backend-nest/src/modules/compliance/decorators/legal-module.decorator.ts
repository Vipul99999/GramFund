import { SetMetadata } from '@nestjs/common';

export const LEGAL_MODULE_KEY = 'legal_module';
export const LegalModule = (module: string, version: string) => SetMetadata(LEGAL_MODULE_KEY, { module, version });
