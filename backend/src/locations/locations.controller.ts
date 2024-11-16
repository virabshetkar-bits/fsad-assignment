import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationQuery } from './dto/location.query';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationResponse } from './dto/location.response';

@ApiTags('Locations')
@Controller({ version: '1', path: 'locations' })
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiResponse({
    type: LocationResponse,
    isArray: true,
  })
  @Get()
  async findAll(@Query() { query }: LocationQuery) {
    return await this.locationsService.findAll(query);
  }
}
