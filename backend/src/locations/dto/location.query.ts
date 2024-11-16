import { ApiProperty } from '@nestjs/swagger';

export class LocationQuery {
  @ApiProperty({
    minLength: 3,
  })
  query: string;
}
