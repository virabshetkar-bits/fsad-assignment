import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class RegisterUserRequest
  implements Omit<Prisma.UserCreateInput, 'location'>
{
  @ApiProperty()
  email: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  full_name: string;
}
