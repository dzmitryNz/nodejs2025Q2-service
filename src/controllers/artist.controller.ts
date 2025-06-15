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
import { IsString, IsBoolean } from 'class-validator';

import { ArtistService } from 'src/services/artist.service';

class CreateArtistDto {
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAll() {
    return this.artistService.getAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const artist = this.artistService.getById(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateArtistDto) {
    if (!body.name || body.grammy === undefined) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.artistService.create(body.name, body.grammy);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: CreateArtistDto,
  ) {
    if (!body.name || body.grammy === undefined) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = this.artistService.update(id, body.name, body.grammy);
    if (!result) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const deleted = this.artistService.delete(id);
    if (!deleted) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return { statusCode: 204 };
  }
}