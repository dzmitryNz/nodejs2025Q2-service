import { Injectable } from '@nestjs/common';

import { Album } from 'src/interfaces/album.interface';
import { AlbumModel } from 'src/models/album.model';
import { FavoritesModel } from 'src/models/favorites.model';
import { TrackModel } from 'src/models/track.model';

@Injectable()
export class AlbumService {
  private albumModel = new AlbumModel();
  private trackModel = new TrackModel();
  private favoritesModel = new FavoritesModel();

  getAll(): Album[] {
    return this.albumModel.getAll();
  }

  getById(id: string): Album | undefined {
    return this.albumModel.getById(id);
  }

  create(name: string, year: number, artistId: string | null): Album {
    return this.albumModel.create(name, year, artistId);
  }

  update(
    id: string,
    name: string,
    year: number,
    artistId: string | null,
  ): Album | null {
    return this.albumModel.update(id, name, year, artistId);
  }

  delete(id: string): boolean {
    this.trackModel.removeAlbumReferences(id);
    this.favoritesModel.removeAlbum(id);

    return this.albumModel.delete(id);
  }

  removeArtistReferences(artistId: string): void {
    this.albumModel.removeArtistReferences(artistId);
  }
}
