import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class PasswordResetEmailRequest {
  @ApiProperty()
  email: string;
}

export class PasswordResetRequest {
  @ApiProperty()
  id: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  password: string;
}
