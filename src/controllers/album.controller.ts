import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { AlbumService } from 'src/services/album.service';

class CreateAlbumDto {
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsOptional()
  artistId: string | null;
}

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) { }

  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.albumService.getById(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateAlbumDto) {
    if (!body.name || body.year === undefined) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.albumService.create(
      body.name,
      body.year,
      body.artistId || null,
    );
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: CreateAlbumDto,
  ) {
    if (!body.name || body.year === undefined) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.albumService.update(
      id,
      body.name,
      body.year,
      body.artistId || null,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.albumService.delete(id);
  }
}
