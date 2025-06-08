import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1709913600001 implements MigrationInterface {
  name = 'CreateTables1709913600001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying NOT NULL,
        "password" character varying NOT NULL,
        "version" integer NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_login" UNIQUE ("login"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create artists table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "artists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "grammy" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_artists" PRIMARY KEY ("id")
      )
    `);

    // Create albums table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "albums" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_albums" PRIMARY KEY ("id"),
        CONSTRAINT "FK_albums_artists" FOREIGN KEY ("artistId") 
          REFERENCES "artists"("id") ON DELETE SET NULL
      )
    `);

    // Create tracks table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tracks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        "duration" integer NOT NULL,
        CONSTRAINT "PK_tracks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tracks_artists" FOREIGN KEY ("artistId") 
          REFERENCES "artists"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_tracks_albums" FOREIGN KEY ("albumId") 
          REFERENCES "albums"("id") ON DELETE SET NULL
      )
    `);

    // Create favorites table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "favorites" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "artistId" uuid,
        "albumId" uuid,
        "trackId" uuid,
        CONSTRAINT "PK_favorites" PRIMARY KEY ("id"),
        CONSTRAINT "FK_favorites_artists" FOREIGN KEY ("artistId") 
          REFERENCES "artists"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_favorites_albums" FOREIGN KEY ("albumId") 
          REFERENCES "albums"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_favorites_tracks" FOREIGN KEY ("trackId") 
          REFERENCES "tracks"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "favorites"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tracks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "albums"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "artists"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
