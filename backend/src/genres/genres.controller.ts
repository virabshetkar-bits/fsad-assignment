import { Controller, Get, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenreQuery } from './dto/genre.query';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Genres")
@Controller({version: "1", path: "genres"})
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  findAll(@Query() { query }: GenreQuery) {
    return this.genresService.findAll(query);
  }
}
