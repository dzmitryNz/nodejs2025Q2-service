import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Track } from './track.entity';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  artistId: string;

  @Column({ nullable: true })
  albumId: string;

  @Column({ nullable: true })
  trackId: string;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToOne(() => Album)
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @ManyToOne(() => Track)
  @JoinColumn({ name: 'trackId' })
  track: Track;
}
