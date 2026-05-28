import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

@Injectable()
export class CryptoService {
  private key = scryptSync(process.env.PII_ENCRYPTION_KEY as string, 'gramfund-salt', 32);

  encrypt(value: string) {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const enc = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
  }

  decrypt(payload: string) {
    const [ivHex, tagHex, dataHex] = payload.split(':');
    const decipher = createDecipheriv('aes-256-gcm', this.key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    const out = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
    return out.toString('utf8');
  }
}
