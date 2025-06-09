import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../models/artist.entity';
import { Album } from '../models/album.entity';
import { Track } from '../models/track.entity';
import { Favorites } from '../models/favorites.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  async getAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async getById(id: string): Promise<Artist | undefined> {
    return this.artistRepository.findOne({ where: { id } });
  }

  async create(name: string, grammy: boolean): Promise<Artist> {
    const artist = this.artistRepository.create({ name, grammy });
    return this.artistRepository.save(artist);
  }

  async update(
    id: string,
    name: string,
    grammy: boolean,
  ): Promise<Artist | null> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = name;
    artist.grammy = grammy;
    return this.artistRepository.save(artist);
  }

  async delete(id: string): Promise<boolean> {
    // Удаляем ссылки на артиста в альбомах
    await this.albumRepository
      .createQueryBuilder()
      .update(Album)
      .set({ artistId: null })
      .where('artistId = :id', { id })
      .execute();

    // Удаляем ссылки на артиста в треках
    await this.trackRepository
      .createQueryBuilder()
      .update(Track)
      .set({ artistId: null })
      .where('artistId = :id', { id })
      .execute();

    // Удаляем артиста из избранного
    await this.favoritesRepository
      .createQueryBuilder()
      .update(Favorites)
      .set({ artistId: null })
      .where('artistId = :id', { id })
      .execute();

    // Удаляем самого артиста
    const result = await this.artistRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
