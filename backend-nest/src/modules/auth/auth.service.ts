import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { I18nService } from '../../i18n/i18n.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly i18n: I18nService) {}

  async login(dto: LoginDto, lang?: string) {
    const user = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] } });
    if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException(this.i18n.t('invalidCredentials', lang));
    }
    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role, email: user.email, phone: user.phone });
    return { accessToken, user: { id: user.id, role: user.role, name: user.name, preferredLanguage: user.preferredLanguage } };
  }
}
