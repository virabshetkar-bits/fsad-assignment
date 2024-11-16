import { Module } from '@nestjs/common';
import { BooklistingService } from './booklisting.service';
import { BooklistingController } from './booklisting.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BooklistingController],
  providers: [BooklistingService],
})
export class BooklistingModule {}
