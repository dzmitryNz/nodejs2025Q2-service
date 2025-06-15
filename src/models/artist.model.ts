import { randomUUID } from 'crypto';

import { Artist } from 'src/interfaces/artist.interface';

export class ArtistModel {
  private artists: Artist[] = [
    {
      id: '2c4c957e-dafe-45d9-ae8f-f65bff4bb0f1',
      name: 'Some artist',
      grammy: false,
    },
  ];

  getAll(): Artist[] {
    return this.artists;
  }

  getById(id: string): Artist | undefined {
    return this.artists.find((artist) => artist.id === id);
  }

  create(name: string, grammy: boolean): Artist {
    const artist: Artist = {
      id: randomUUID(),
      name,
      grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  update(id: string, name: string, grammy: boolean): Artist | null {
    const artist = this.getById(id);
    if (!artist) return null;

    artist.name = name;
    artist.grammy = grammy;
    return artist;
  }

  delete(id: string): boolean {
    const idx = this.artists.findIndex((artist) => artist.id === id);
    if (idx === -1) return false;
    this.artists.splice(idx, 1);
    return true;
  }
}
