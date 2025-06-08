import { Injectable } from '@nestjs/common';
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
  ) {}

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

  async addArtist(id: string): Promise<boolean> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) return false;

    const favorite = this.favoritesRepository.create({ artistId: id });
    await this.favoritesRepository.save(favorite);
    return true;
  }

  async removeArtist(id: string): Promise<boolean> {
    const result = await this.favoritesRepository.delete({ artistId: id });
    return result.affected ? result.affected > 0 : false;
  }

  async addAlbum(id: string): Promise<boolean> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) return false;

    const favorite = this.favoritesRepository.create({ albumId: id });
    await this.favoritesRepository.save(favorite);
    return true;
  }

  async removeAlbum(id: string): Promise<boolean> {
    const result = await this.favoritesRepository.delete({ albumId: id });
    return result.affected ? result.affected > 0 : false;
  }

  async addTrack(id: string): Promise<boolean> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) return false;

    const favorite = this.favoritesRepository.create({ trackId: id });
    await this.favoritesRepository.save(favorite);
    return true;
  }

  async removeTrack(id: string): Promise<boolean> {
    const result = await this.favoritesRepository.delete({ trackId: id });
    return result.affected ? result.affected > 0 : false;
  }
}
