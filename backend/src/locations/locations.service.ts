import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LocationsService {
  
  constructor(private databaseService: DatabaseService) {}
  async findAll(query: string) {
    return await this.databaseService.location.findMany({
      where: {
        name: {
          startsWith: query,
        },
      },
    });
  }
}
