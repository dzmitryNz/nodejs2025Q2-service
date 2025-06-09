import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from '../models/favorites.entity';
import { Artist } from '../models/artist.entity';
import { Album } from '../models/album.entity';
import { Track } from '../models/track.entity';
import { FavoritesResponse } from '../interfaces/favorites.interface';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) { }

  async getAll(): Promise<FavoritesResponse> {
    const [artists, albums, tracks] = await Promise.all([
      this.artistRepository
        .createQueryBuilder('artist')
        .innerJoin('favorites', 'favorites', 'favorites.artistId = artist.id')
        .getMany(),
      this.albumRepository
        .createQueryBuilder('album')
        .innerJoin('favorites', 'favorites', 'favorites.albumId = album.id')
        .getMany(),
      this.trackRepository
        .createQueryBuilder('track')
        .innerJoin('favorites', 'favorites', 'favorites.trackId = track.id')
        .getMany(),
    ]);

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addArtist(id: string): Promise<Favorites> {
    try {
      const artist = await this.artistRepository.findOne({ where: { id } });
      if (!artist) {
        throw new HttpException(
          () => 'Artist not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const favorite = this.favoritesRepository.create({ artistId: id });
      await this.favoritesRepository.save(favorite);
      return favorite;
    } catch (error) {
      console.error('addArtist ERROR', error);
      throw new HttpException(
        () => 'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async removeArtist(id: string): Promise<boolean> {
    const result = await this.favoritesRepository.delete({ artistId: id });
    return result.affected ? result.affected > 0 : false;
  }

  async addAlbum(id: string): Promise<Favorites> {
    try {
      const album = await this.albumRepository.findOne({ where: { id } });
      if (!album) {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }

      const favorite = this.favoritesRepository.create({ albumId: id });
      await this.favoritesRepository.save(favorite);
      return favorite;
    } catch (error) {
      console.error('addAlbum ERROR', error);
      throw new HttpException(
        () => 'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async removeAlbum(id: string): Promise<boolean> {
    const result = await this.favoritesRepository.delete({ albumId: id });
    return result.affected ? result.affected > 0 : false;
  }

  async addTrack(id: string): Promise<Favorites> {
    try {
      const track = await this.trackRepository.findOne({ where: { id } });
      if (!track) {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      }

      const favorite = this.favoritesRepository.create({ trackId: id });
      await this.favoritesRepository.save(favorite);
      return favorite;
    } catch (error) {
      console.error('Add Track ERROR', error);
      throw new HttpException(
        () => 'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async removeTrack(id: string): Promise<boolean> {
    const result = await this.favoritesRepository.delete({ trackId: id });
    return result.affected ? result.affected > 0 : false;
  }
}
