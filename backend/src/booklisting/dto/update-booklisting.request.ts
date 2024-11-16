import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class UpdateBooklistingRequest
  implements Omit<Prisma.BookListingUpdateInput, 'genres' | 'authors'>
{
  @ApiProperty()
  @ApiPropertyOptional()
  title?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  condition?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  available?: boolean;

  @ApiProperty()
  @ApiPropertyOptional()
  genres?: string[];

  @ApiProperty()
  @ApiPropertyOptional()
  authors?: string[];
}
