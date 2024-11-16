import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationQuery } from 'src/booklisting/dto/pagination.query';

export class FilterQuery extends PaginationQuery {
  @ApiProperty({ required: false })
  @Transform(({ value }) => value !== 'false')
  availability: boolean;

  @ApiProperty({ required: false })
  genre?: string;

  @ApiProperty({ required: false })
  location: string;

  @ApiProperty({ required: false })
  search: string;

  @ApiProperty({ required: false })
  condition: string;
}
