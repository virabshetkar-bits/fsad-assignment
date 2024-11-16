import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { FilterQuery } from './dto/availability.query';
import { PaginationQuery } from 'src/booklisting/dto/pagination.query';
import { contains } from 'class-validator';

@Injectable()
export class BooksService {
  constructor(private databaseService: DatabaseService) {}

  async findOne(id: string) {
    return await this.databaseService.bookListing.findUnique({
      where: {
        id,
      },
      include: {
        authors: true,
        genres: true,
        owner: true,
      },
    });
  }

  async findAll({
    availability,
    search,
    location,
    condition,
    genre,
    offset,
    limit,
  }: FilterQuery) {
    return await this.databaseService.bookListing.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search ?? '',
            },
          },
          {
            authors: {
              some: {
                name: {
                  contains: search ?? '',
                },
              },
            },
          },
        ],
        genres: {
          some: {
            name: {
              contains: genre,
            },
          },
        },
        available: availability,
        condition: condition,
        owner: {
          location: {
            name: location,
          },
        },
      },
      include: {
        genres: true,
        authors: true,
      },
      skip: offset,
      take: limit,
    });
  }
}
