import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../models/album.entity';
import { Track } from '../models/track.entity';
import { Favorites } from '../models/favorites.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  async getAll(): Promise<Album[]> {
    return this.albumRepository.find({
      relations: ['artist'],
    });
  }

  async getById(id: string): Promise<Album | undefined> {
    return this.albumRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
  }

  async create(
    name: string,
    year: number,
    artistId: string | null,
  ): Promise<Album> {
    const album = this.albumRepository.create({
      name,
      year,
      artistId,
    });
    return this.albumRepository.save(album);
  }

  async update(
    id: string,
    name: string,
    year: number,
    artistId: string | null,
  ): Promise<Album | null> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) return null;

    album.name = name;
    album.year = year;
    album.artistId = artistId;

    return this.albumRepository.save(album);
  }

  async delete(id: string): Promise<boolean> {
    // Удаляем ссылки на альбом в треках
    await this.trackRepository
      .createQueryBuilder()
      .update(Track)
      .set({ albumId: null })
      .where('albumId = :id', { id })
      .execute();

    // Удаляем альбом из избранного
    await this.favoritesRepository.delete({ albumId: id });

    // Удаляем сам альбом
    const result = await this.albumRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async removeArtistReferences(artistId: string): Promise<void> {
    await this.albumRepository
      .createQueryBuilder()
      .update(Album)
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId })
      .execute();
  }
}
