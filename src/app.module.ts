import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { ArtistController } from './controllers/artist.controller';
import { ArtistService } from './services/artist.service';
import { AlbumController } from './controllers/album.controller';
import { AlbumService } from './services/album.service';
import { TrackController } from './controllers/track.controller';
import { TrackService } from './services/track.service';
import { FavoritesController } from './controllers/favorites.controller';
import { FavoritesService } from './services/favorites.service';

@Module({
  imports: [ConfigModule.forRoot()],
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