import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectStorageService {
  async putObject(key: string, content: Buffer, contentType: string) { return { key, etag: `etag-${Date.now()}` }; }
  getSignedUrl(key: string, ttlSeconds: number) { return `https://storage.gramfund.local/${key}?ttl=${ttlSeconds}`; }
}
