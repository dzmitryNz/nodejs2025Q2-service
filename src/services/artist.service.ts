import { Injectable } from '@nestjs/common';

import { Artist } from 'src/interfaces/artist.interface';
import { AlbumModel } from 'src/models/album.model';
import { ArtistModel } from 'src/models/artist.model';
import { FavoritesModel } from 'src/models/favorites.model';
import { TrackModel } from 'src/models/track.model';

@Injectable()
export class ArtistService {
  private artistModel = new ArtistModel();
  private albumModel = new AlbumModel();
  private trackModel = new TrackModel();
  private favoritesModel = new FavoritesModel();

  getAll(): Artist[] {
    return this.artistModel.getAll();
  }

  getById(id: string): Artist | undefined {
    return this.artistModel.getById(id);
  }

  create(name: string, grammy: boolean): Artist {
    return this.artistModel.create(name, grammy);
  }

  update(id: string, name: string, grammy: boolean): Artist | null {
    return this.artistModel.update(id, name, grammy);
  }

  delete(id: string): boolean {
    this.albumModel.removeArtistReferences(id);
    this.trackModel.removeArtistReferences(id);
    this.favoritesModel.removeArtist(id);

    return this.artistModel.delete(id);
  }
}
