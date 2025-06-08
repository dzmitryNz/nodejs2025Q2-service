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
} from '@nestjs/common';
import { TrackService } from '../services/track.service';
import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

class CreateTrackDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  artistId: string | null;

  @IsOptional()
  @IsUUID()
  albumId: string | null;

  @IsNumber()
  duration: number;
}

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAll() {
    return this.trackService.getAll();
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const track = this.trackService.getById(id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  @Post()
  create(@Body() body: CreateTrackDto) {
    if (!body.name || body.duration === undefined) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.trackService.create(
      body.name,
      body.artistId || null,
      body.albumId || null,
      body.duration,
    );
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: CreateTrackDto,
  ) {
    if (!body.name || body.duration === undefined) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = this.trackService.update(
      id,
      body.name,
      body.artistId || null,
      body.albumId || null,
      body.duration,
    );
    if (!result) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const deleted = this.trackService.delete(id);
    if (!deleted) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return { statusCode: 204 };
  }
}