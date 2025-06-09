import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { Favorites } from 'src/models/favorites.entity';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAll() {
    return this.favoritesService.getAll();
  }

  @Post('artist/:id')
  @HttpCode(201)
  addArtist(@Param('id', new ParseUUIDPipe()) id: string): Promise<Favorites> {
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeArtist(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    const removed = this.favoritesService.removeAlbum(id);
    if (!removed) {
      throw new HttpException(
        'Album not found in favorites',
        HttpStatus.NOT_FOUND,
      );
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
  @HttpCode(204)
  removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    const removed = this.favoritesService.removeTrack(id);
    if (!removed) {
      throw new HttpException(
        'Track not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
    return { statusCode: 204 };
  }
}
