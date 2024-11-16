import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateBooklistingRequest } from './dto/update-booklisting.request';
import { CreateBooklistingRequest } from './dto/create-booklisting.request';

@Injectable()
export class BooklistingService {
  constructor(private databaseService: DatabaseService) {}

  async create(
    { title, authors, genres, condition }: CreateBooklistingRequest,
    ownerId: string,
  ) {
    return await this.databaseService.bookListing.create({
      data: {
        title,
        condition,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        genres: {
          connectOrCreate: genres.map((genre) => {
            return {
              where: { name: genre },
              create: {
                name: genre,
              },
            };
          }),
        },
        authors: {
          connectOrCreate: authors.map((author) => {
            return {
              where: { name: author },
              create: {
                name: author,
              },
            };
          }),
        },
      },
    });
  }

  async findAll(id: string, offset: number, limit: number) {
    return await this.databaseService.bookListing.findMany({
      where: {
        ownerId: id,
      },
      skip: offset,
      take: limit,
      include: {
        authors: true,
        genres: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    return await this.databaseService.bookListing.findUnique({
      where: { id, ownerId: userId },
      include: {
        genres: true,
        authors: true,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    updateBooklistingRequest: UpdateBooklistingRequest,
  ) {
    return await this.databaseService.bookListing.update({
      where: { id, ownerId: userId },
      data: {
        title: updateBooklistingRequest.title,
        authors: {
          upsert: updateBooklistingRequest.authors.map((a) => ({
            where: {
              name: a,
            },
            create: {
              name: a,
            },
            update: {
              name: a,
            },
          })),
          set: updateBooklistingRequest.authors.map((a) => ({
            name: a,
          })),
        },
        genres: {
          set: updateBooklistingRequest.genres.map((g) => ({ name: g })),
        },
        condition: updateBooklistingRequest.condition,
      },
    });
  }

  async remove(id: string, userId: string) {
    return await this.databaseService.bookListing.delete({
      where: { id, ownerId: userId },
    });
  }
}
