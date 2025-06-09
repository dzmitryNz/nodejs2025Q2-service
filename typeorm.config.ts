import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/models/user.entity';
import { Artist } from './src/models/artist.entity';
import { Album } from './src/models/album.entity';
import { Track } from './src/models/track.entity';
import { Favorites } from './src/models/favorites.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Artist, Album, Track, Favorites],
  migrations: ['./migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
});
