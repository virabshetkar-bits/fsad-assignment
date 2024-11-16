import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BooklistingModule } from './booklisting/booklisting.module';
import { RequestUtilsService } from './common/services/request-utils/request-utils.service';
import { CommonModule } from './common/common.module';
import { MailingModule } from './mailing/mailing.module';
import { BooksModule } from './books/books.module';
import { LocationsModule } from './locations/locations.module';
import { GenresModule } from './genres/genres.module';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BooklistingModule,
    CommonModule,
    MailingModule,
    BooksModule,
    LocationsModule,
    GenresModule,
    AuthorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
