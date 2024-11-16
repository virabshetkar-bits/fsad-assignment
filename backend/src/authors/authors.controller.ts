import { Controller, Get, Query } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorQuery } from './dto/author.query';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authors')
@Controller({ version: '1', path: 'authors' })
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  findAll(@Query() { query }: AuthorQuery) {
    return this.authorsService.findAll(query);
  }
}
