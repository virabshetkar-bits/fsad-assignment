import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthorsService {
  constructor(private databaseService: DatabaseService) {}
  async findAll(query: string) {
    return this.databaseService.author.findMany({
      where: {
        name: {
          startsWith: query,
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
    });
  }
}
