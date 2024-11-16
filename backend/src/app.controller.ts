import { Controller, Get, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Testing')
@Controller({
  version: '1',
})
export class AppController {
  constructor() {}

  @Version('1')
  @Get('status')
  status(): { status: string } {
    return { status: 'online' };
  }
}
