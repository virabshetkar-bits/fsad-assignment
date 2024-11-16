import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { MailingService } from 'src/mailing/mailing.service';
import { RegisterUserRequest } from './dto/register-user-form.dto';

@Injectable()
export class AuthService {
  SALT_ROUNDS = +(this.config.get<number>('SALT_ROUNDS') ?? 10);
  FRONTEND_URL: string = this.config.get('FRONTEND_URL');

  
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailingService: MailingService,
  ) {}

  async registerUser(user: RegisterUserRequest) {
    user.password = await this.hashString(user.password);
    try {
      return await this.databaseService.user.create({
        data: {
          full_name: user.full_name,
          password: user.password,
          email: user.email,
          location: {
            connect: {
              name: user.location,
            },
          },
        },
        select: {
          id: true,
          full_name: true,
          email: true,
        },
      });
    } catch (err) {
      if (err.name === 'PrismaClientKnownRequestError')
        throw new BadRequestException('user_exists');
      throw new BadRequestException('cannot_create_user');
    }
  }

  async signIn(email: string, password: string) {
    const user = await this.databaseService.user.findFirst({
      where: { email },
      select: {
        id: true,
        full_name: true,
        email: true,
        password: true,
        location: true,
      },
    });
    if (!user) throw new BadRequestException('invalid_credentials');

    const isEqual = await compare(password, user.password);
    if (!isEqual) throw new BadRequestException('invalid_credentials');

    return {
      access_token: await this.jwtService.signAsync({
        user: { ...user, password: undefined },
      }),
      user: { ...user, password: undefined },
    };
  }

  private generateRandomString() {
    return randomBytes(48).toString('base64');
  }

  private async hashString(text: string) {
    return await hash(text, this.SALT_ROUNDS);
  }

  async triggerPasswordResetEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
      select: {
        id: true,
        full_name: true,
      },
    });

    if (!user) throw new BadRequestException('user_does_not_exist');

    const pwdRequest =
      await this.databaseService.passwordResetRequest.findUnique({
        where: { user_id: user.id },
      });

    if (pwdRequest) {
      await this.databaseService.passwordResetRequest.delete({
        where: {
          id: pwdRequest.id,
        },
      });
    }

    const code = this.generateRandomString();

    const hashedCode = await this.hashString(code);

    const pwdResetRequest =
      await this.databaseService.passwordResetRequest.create({
        data: {
          code: hashedCode,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

    await this.mailingService.sendEmail(
      'mail.html',
      'BookExchangePlatform: Password Recovery',
      email,
      user.full_name,
      {
        full_name: user.full_name,
        pwd_reset_url: this.getPasswordRecoveryURL(pwdResetRequest.id, code),
      },
    );

    return;
  }

  async passwordReset(
    code: string,
    password: string,
    pwdResetRequestId: string,
  ) {
    const hashedPassword = await this.hashString(password);

    const pwdRequest =
      await this.databaseService.passwordResetRequest.findUnique({
        where: { id: pwdResetRequestId },
      });

    if (!pwdRequest) throw new BadRequestException('pwd_request_expired');

    const { user_id: userId, code: hashedCode } = pwdRequest;

    if (!(await compare(code, hashedCode)))
      throw new BadRequestException('incorrect_code');

    await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await this.databaseService.passwordResetRequest.delete({
      where: {
        id: pwdResetRequestId,
      },
    });
  }

  private getPasswordRecoveryURL(id: string, code: string) {
    const url = new URL('/password-reset', this.FRONTEND_URL);

    url.searchParams.append('rid', id);
    url.searchParams.append('code', code);

    return url.href;
  }
}
