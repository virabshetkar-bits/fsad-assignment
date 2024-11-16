import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  Query,
  ForbiddenException,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { BooklistingService } from './booklisting.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateBooklistingRequest } from './dto/create-booklisting.request';
import { UpdateBooklistingRequest } from './dto/update-booklisting.request';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestUtilsService } from 'src/common/services/request-utils/request-utils.service';
import { PaginationQuery } from './dto/pagination.query';

@ApiBearerAuth()
@ApiTags('Book Listings')
@UseGuards(AuthGuard)
@Controller({ version: '1', path: 'users/:userId/booklistings' })
export class BooklistingController {
  constructor(
    private readonly booklistingService: BooklistingService,
    private readonly requestUtils: RequestUtilsService,
  ) {}

  @Post()
  async create(
    @Body() createBooklistingRequest: CreateBooklistingRequest,
    @Request() request: Request,
  ) {
    const id = this.requestUtils.getTokenInformation(request).user.id;
    try {
      return await this.booklistingService.create(createBooklistingRequest, id);
    } catch (err) {
      throw new BadRequestException('cannot_create_booklisting');
    }
  }

  @Get()
  async findAll(
    @Query() { offset, limit }: PaginationQuery,
    @Param('userId') userId: string,
  ) {
    return {
      booklistings: await this.booklistingService.findAll(
        userId,
        +offset,
        +limit,
      ),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Param('userId') userId: string) {
    return await this.booklistingService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBooklistingRequest: UpdateBooklistingRequest,
    @Request() request,
    @Param('userId') userId: string,
  ) {
    const token = this.requestUtils.getTokenInformation(request).user;

    if (userId != token.id)
      throw new ForbiddenException('cannot_update_other_users_data');

    return await this.booklistingService.update(
      id,
      token.id,
      updateBooklistingRequest,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() request,
    @Param('userId') userId: string,
  ) {
    const token = this.requestUtils.getTokenInformation(request).user;

    if (userId != token.id)
      throw new ForbiddenException('cannot_delete_other_users_data');
    return await this.booklistingService.remove(id, userId);
  }
}
