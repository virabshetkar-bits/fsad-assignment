import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import {
  LoginRequest,
  PasswordResetEmailRequest,
  PasswordResetRequest,
} from './dto/login.request';
import { RegisterUserRequest } from './dto/register-user-form.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('/login')
  async login(@Body() { email, password }: LoginRequest) {
    return await this.authService.signIn(email, password);
  }

  @Post('/register')
  async register(@Body() user: RegisterUserRequest) {
    return await this.authService.registerUser(user);
  }

  @Post('/send-password-reset-email')
  async trigger(@Body() passwordResetRequest: PasswordResetEmailRequest) {
    return await this.authService.triggerPasswordResetEmail(
      passwordResetRequest.email,
    );
  }

  @HttpCode(200)
  @Post('/reset-password')
  async resetPassword(@Body() { id, code, password }: PasswordResetRequest) {
    return await this.authService.passwordReset(code, password, id);
  }
}
