import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateBooklistingRequest
  implements
    Omit<Prisma.BookListingCreateInput, 'owner' | 'genres' | 'authors'>
{
  @ApiProperty()
  title: string;

  @ApiProperty()
  condition: string;

  @ApiProperty({ required: false })
  genres?: string[];

  @ApiProperty({ required: false })
  authors?: string[];
}
