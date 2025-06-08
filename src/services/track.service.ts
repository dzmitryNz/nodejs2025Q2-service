import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../models/track.entity';
import { Favorites } from '../models/favorites.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  async getAll(): Promise<Track[]> {
    return this.trackRepository.find({
      relations: ['artist', 'album'],
    });
  }

  async getById(id: string): Promise<Track | undefined> {
    return this.trackRepository.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
  }

  async create(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Promise<Track> {
    const track = this.trackRepository.create({
      name,
      artistId,
      albumId,
      duration,
    });
    return this.trackRepository.save(track);
  }

  async update(
    id: string,
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Promise<Track | null> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) return null;

    track.name = name;
    track.artistId = artistId;
    track.albumId = albumId;
    track.duration = duration;

    return this.trackRepository.save(track);
  }

  async delete(id: string): Promise<boolean> {
    // Удаляем трек из избранного
    await this.favoritesRepository.delete({ trackId: id });

    // Удаляем сам трек
    const result = await this.trackRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async removeArtistReferences(artistId: string): Promise<void> {
    await this.trackRepository
      .createQueryBuilder()
      .update(Track)
      .set({ artistId: null })
      .where('artistId = :artistId', { artistId })
      .execute();
  }

  async removeAlbumReferences(albumId: string): Promise<void> {
    await this.trackRepository
      .createQueryBuilder()
      .update(Track)
      .set({ albumId: null })
      .where('albumId = :albumId', { albumId })
      .execute();
  }
}
