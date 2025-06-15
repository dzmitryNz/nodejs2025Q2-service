import { randomUUID } from 'crypto';

import { Album } from 'src/interfaces/album.interface';

export class AlbumModel {
  private albums: Album[] = [
    {
      id: 'fcd86404-2f8e-4ff1-86c4-da6cc2629a7c',
      name: 'Some album',
      year: 2025,
      artistId: '2c4c957e-dafe-45d9-ae8f-f65bff4bb0f1',
    }
  ];

  getAll(): Album[] {
    return this.albums;
  }

  getById(id: string): Album | undefined {
    return this.albums.find((album) => album.id === id);
  }

  create(name: string, year: number, artistId: string | null): Album {
    const album: Album = {
      id: randomUUID(),
      name,
      year,
      artistId,
    };
    this.albums.push(album);
    return album;
  }

  update(id: string, name: string, year: number, artistId: string | null): Album | null {
    const album = this.getById(id);
    if (!album) return null;
    
    album.name = name;
    album.year = year;
    album.artistId = artistId;
    return album;
  }

  delete(id: string): boolean {
    const idx = this.albums.findIndex((album) => album.id === id);
    if (idx === -1) return false;
    this.albums.splice(idx, 1);

    return true;
  }

  removeArtistReferences(artistId: string): void {
    this.albums = this.albums.map(album => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
      return album;
    });
  }
}