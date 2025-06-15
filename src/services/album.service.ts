import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getById(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async create(
    name: string,
    year: number,
    artistId: string | null,
  ): Promise<Album> {
    try {
      const album = this.albumRepository.create({
        name,
        year,
        artistId,
      });
      return this.albumRepository.save(album);
    } catch (error) {
      console.error('Create Album ERROR', error);
      throw new HttpException(
        'Failed to create album',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async update(
    id: string,
    name: string,
    year: number,
    artistId: string | null,
  ): Promise<Album | null> {
    try {
      const album = await this.albumRepository.findOne({ where: { id } });
      if (!album) throw new NotFoundException('Album not found');

      album.name = name;
      album.year = year;
      album.artistId = artistId;

      return this.albumRepository.save(album);
    } catch (error) {
      console.error('Update Album ERROR', error);
      throw new HttpException(
        'Failed to create album',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
  
  async delete(id: string): Promise<boolean> {
    await this.trackRepository
      .createQueryBuilder()
      .update(Track)
      .set({ albumId: null })
      .where('albumId = :id', { id })
      .execute();

    await this.favoritesRepository.delete({ albumId: id });

    const result = await this.albumRepository.delete(id);
    if (result.affected <= 0) {
      throw new NotFoundException('Album not found');
    }
    return true;
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
