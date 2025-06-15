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
  @IsUUID()
  artistId: string | null;
}

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const album = this.albumService.getById(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
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
    return this.albumService.create(body.name, body.year, body.artistId || null);
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
    const result = this.albumService.update(
      id,
      body.name,
      body.year,
      body.artistId || null,
    );
    if (!result) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const deleted = this.albumService.delete(id);
    if (!deleted) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return { statusCode: 204 };
  }
}