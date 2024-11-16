import { ApiProperty } from '@nestjs/swagger';

export class AuthorQuery {
  @ApiProperty({ required: true, minLength: 3 })
  query: string;
}
