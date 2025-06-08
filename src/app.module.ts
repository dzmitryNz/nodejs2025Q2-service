import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Album } from './models/album.entity';
import { Artist } from './models/artist.entity';
import { Favorites } from './models/favorites.entity';
import { Track } from './models/track.entity';
import { User } from './models/user.entity';
import { AlbumController } from 'src/controllers/album.controller';
import { ArtistController } from './controllers/artist.controller';
import { FavoritesController } from './controllers/favorites.controller';
import { TrackController } from './controllers/track.controller';
import { UserController } from './controllers/user.controller';
import { AlbumService } from './services/album.service';
import { ArtistService } from './services/artist.service';
import { FavoritesService } from './services/favorites.service';
import { TrackService } from './services/track.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Artist, Album, Track, Favorites],
      synchronize: false,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User, Artist, Album, Track, Favorites]),
  ],
  controllers: [
    UserController,
    ArtistController,
    AlbumController,
    TrackController,
    FavoritesController,
  ],
  providers: [
    UserService,
    ArtistService,
    AlbumService,
    TrackService,
    FavoritesService,
  ],
})
export class AppModule {}
