import { Global, Module } from '@nestjs/common';
import { RequestUtilsService } from './services/request-utils/request-utils.service';

@Global()
@Module({
  providers: [RequestUtilsService],
  exports: [RequestUtilsService],
})
export class CommonModule {}
