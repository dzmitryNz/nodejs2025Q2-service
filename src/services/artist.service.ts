import { Injectable } from '@nestjs/common';

import { Artist } from 'src/interfaces/artist.interface';
import { ArtistModel } from 'src/models/artist.model';

@Injectable()
export class ArtistService {
  private artistModel = new ArtistModel();

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
    return this.artistModel.delete(id);
  }
}