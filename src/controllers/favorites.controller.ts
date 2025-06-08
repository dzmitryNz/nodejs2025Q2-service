import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAll() {
    return this.favoritesService.getAll();
  }

  @Post('artist/:id')
  addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    const added = this.favoritesService.addArtist(id);
    if (!added) {
      throw new HttpException(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { statusCode: 201 };
  }

  @Delete('artist/:id')
  removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    const removed = this.favoritesService.removeArtist(id);
    if (!removed) {
      throw new HttpException('Artist not found in favorites', HttpStatus.NOT_FOUND);
    }
    return { statusCode: 204 };
  }

  @Post('album/:id')
  addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    const added = this.favoritesService.addAlbum(id);
    if (!added) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { statusCode: 201 };
  }

  @Delete('album/:id')
  removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    const removed = this.favoritesService.removeAlbum(id);
    if (!removed) {
      throw new HttpException('Album not found in favorites', HttpStatus.NOT_FOUND);
    }
    return { statusCode: 204 };
  }

  @Post('track/:id')
  addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    const added = this.favoritesService.addTrack(id);
    if (!added) {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { statusCode: 201 };
  }

  @Delete('track/:id')
  removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    const removed = this.favoritesService.removeTrack(id);
    if (!removed) {
      throw new HttpException('Track not found in favorites', HttpStatus.NOT_FOUND);
    }
    return { statusCode: 204 };
  }
}