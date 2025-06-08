import { Injectable } from '@nestjs/common';

import { TrackService } from './track.service';
import { FavoritesResponse } from 'src/interfaces/favorites.interface';
import { FavoritesModel } from 'src/models/favorites.model';
import { AlbumService } from './album.service';
import { ArtistService } from './artist.service';

@Injectable()
export class FavoritesService {
  private favoritesModel = new FavoritesModel();

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  getAll(): FavoritesResponse {
    const favorites = this.favoritesModel.getAll();
    return {
      artists: favorites.artists
        .map((id) => this.artistService.getById(id))
        .filter(
          (artist): artist is NonNullable<typeof artist> =>
            artist !== undefined,
        ),
      albums: favorites.albums
        .map((id) => this.albumService.getById(id))
        .filter(
          (album): album is NonNullable<typeof album> => album !== undefined,
        ),
      tracks: favorites.tracks
        .map((id) => this.trackService.getById(id))
        .filter(
          (track): track is NonNullable<typeof track> => track !== undefined,
        ),
    };
  }

  addArtist(id: string): boolean {
    if (!this.artistService.getById(id)) return false;
    return this.favoritesModel.addArtist(id);
  }

  removeArtist(id: string): boolean {
    return this.favoritesModel.removeArtist(id);
  }

  addAlbum(id: string): boolean {
    if (!this.albumService.getById(id)) return false;
    return this.favoritesModel.addAlbum(id);
  }

  removeAlbum(id: string): boolean {
    return this.favoritesModel.removeAlbum(id);
  }

  addTrack(id: string): boolean {
    if (!this.trackService.getById(id)) return false;
    return this.favoritesModel.addTrack(id);
  }

  removeTrack(id: string): boolean {
    return this.favoritesModel.removeTrack(id);
  }
}
