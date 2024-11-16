import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GenresService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(query: string) {
    return await this.databaseService.genre.findMany({
      where: {
        name: {
          startsWith: query,
        },
      },
    });
  }
}
