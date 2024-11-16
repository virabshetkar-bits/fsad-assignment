import { Controller, Get, Param, ParseArrayPipe, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { FilterQuery } from './dto/availability.query';
import { PaginationQuery } from 'src/booklisting/dto/pagination.query';
import { filter } from 'rxjs';

@ApiTags('Books')
@Controller({ version: '1', path: 'books' })
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/')
  async getBooks(@Query() filters: FilterQuery) {
    console.log(filters);
    return this.booksService.findAll(filters);
  }

  @Get('/:id')
  async getBook(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }
}
