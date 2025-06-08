import { Injectable } from '@nestjs/common';

import { Track } from 'src/interfaces/track.interface';
import { TrackModel } from 'src/models/track.model';


@Injectable()
export class TrackService {
  private trackModel = new TrackModel();

  getAll(): Track[] {
    return this.trackModel.getAll();
  }

  getById(id: string): Track | undefined {
    return this.trackModel.getById(id);
  }

  create(name: string, artistId: string | null, albumId: string | null, duration: number): Track {
    return this.trackModel.create(name, artistId, albumId, duration);
  }

  update(id: string, name: string, artistId: string | null, albumId: string | null, duration: number): Track | null {
    return this.trackModel.update(id, name, artistId, albumId, duration);
  }

  delete(id: string): boolean {
    return this.trackModel.delete(id);
  }

  removeArtistReferences(artistId: string): void {
    this.trackModel.removeArtistReferences(artistId);
  }

  removeAlbumReferences(albumId: string): void {
    this.trackModel.removeAlbumReferences(albumId);
  }
}