import { randomUUID } from 'crypto';

import { Track } from 'src/interfaces/track.interface';

export class TrackModel {
  private tracks: Track[] = [
    {
      id: '77ea6e2d-a539-4a93-aa1d-ab2e764996d0',
      name: 'Some track',
      artistId: '2c4c957e-dafe-45d9-ae8f-f65bff4bb0f1',
      albumId: 'fcd86404-2f8e-4ff1-86c4-da6cc2629a7c',
      duration: 3,
    },
  ];

  getAll(): Track[] {
    return this.tracks;
  }

  getById(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  create(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Track {
    const track: Track = {
      id: randomUUID(),
      name,
      artistId,
      albumId,
      duration,
    };
    this.tracks.push(track);
    return track;
  }

  update(
    id: string,
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Track | null {
    const track = this.getById(id);
    if (!track) return null;

    track.name = name;
    track.artistId = artistId;
    track.albumId = albumId;
    track.duration = duration;
    return track;
  }

  delete(id: string): boolean {
    const idx = this.tracks.findIndex((track) => track.id === id);
    if (idx === -1) return false;
    this.tracks.splice(idx, 1);
    return true;
  }

  removeArtistReferences(artistId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
      return track;
    });
  }

  removeAlbumReferences(albumId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
      return track;
    });
  }
}
