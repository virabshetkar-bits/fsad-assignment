import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const { data } = require('./data');

const client = new PrismaClient();

let data3 = data.map((d) => ({
  title: d.title,
  authors: {
    connectOrCreate: d.authors.map((a) => ({
      where: {name: a},
      create: {name: a}
    })),
  },
  genres: {
    connectOrCreate: d.genres.map((a) => ({
      where: {name: a},
      create: {name: a}
    })),
  },
  condition: 'new',
  owner: {
    connectOrCreate: {
      email: 'bangalorelibrary@email.com',
    },
  },
}));

const delay = (time: number) => {
  return new Promise<number>((res, rej) => {
    setTimeout(() => {
      res(0);
    }, time);
  });
};

let count = 0;
client.$connect().then(() => {
  data3.forEach(async (d) => {

    client.$transaction([])

    await client.bookListing.create({
      data: {
        title: d.title,
        authors: d.authors,
        genres: d.genres,
        condition: randomInt(0, 2) === 0 ? 'new' : 'old',
        owner: {
          connect: {
            email: 'bangalorelibrary@email.com',
          },
        },
      },
    });
  });
});
