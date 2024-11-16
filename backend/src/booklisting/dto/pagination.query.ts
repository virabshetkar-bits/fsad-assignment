import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PaginationQuery {
  @ApiProperty({
    default: 10,
    required: false,
    type: Number,
  })
  @Transform(({ value }) => +value)
  limit: number = 10;

  @ApiProperty({
    default: 0,
    required: false,
    type: Number,
  })
  @Transform(({ value }) => +value)
  offset: number = 0;
}
