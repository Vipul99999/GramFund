import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('App bootstrap', () => {
  let app: INestApplication;

  it('should compile module', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    expect(app).toBeDefined();
    await app.close();
  });
});
