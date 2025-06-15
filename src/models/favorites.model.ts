import { Favorites } from 'src/interfaces/favorites.interface';

export class FavoritesModel {
  private favorites: Favorites = {
    artists: ['2c4c957e-dafe-45d9-ae8f-f65bff4bb0f1'],
    albums: ['fcd86404-2f8e-4ff1-86c4-da6cc2629a7c'],
    tracks: ['77ea6e2d-a539-4a93-aa1d-ab2e764996d0'],
  };

  getAll(): Favorites {
    return this.favorites;
  }

  addArtist(id: string): boolean {
    if (this.favorites.artists.includes(id)) return false;
    this.favorites.artists.push(id);
    return true;
  }

  removeArtist(id: string): boolean {
    const idx = this.favorites.artists.indexOf(id);
    if (idx === -1) return false;
    this.favorites.artists.splice(idx, 1);
    return true;
  }

  addAlbum(id: string): boolean {
    if (this.favorites.albums.includes(id)) return false;
    this.favorites.albums.push(id);
    return true;
  }

  removeAlbum(id: string): boolean {
    const idx = this.favorites.albums.indexOf(id);
    if (idx === -1) return false;
    this.favorites.albums.splice(idx, 1);
    return true;
  }

  addTrack(id: string): boolean {
    if (this.favorites.tracks.includes(id)) return false;
    this.favorites.tracks.push(id);
    return true;
  }

  removeTrack(id: string): boolean {
    const idx = this.favorites.tracks.indexOf(id);
    if (idx === -1) return false;
    this.favorites.tracks.splice(idx, 1);
    return true;
  }
}
