import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1709913600000 implements MigrationInterface {
  name = 'CreateDatabase1709913600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаем расширение для UUID
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Создаем базу данных, если она не существует
    await queryRunner.query(`CREATE DATABASE home_library`);

    // Подключаемся к созданной базе данных
    await queryRunner.query(`\c home_library`);

    // Создаем схему public, если она не существует
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS public`);

    // Устанавливаем права на схему
    await queryRunner.query(`GRANT ALL ON SCHEMA public TO postgres`);
    await queryRunner.query(`GRANT ALL ON SCHEMA public TO public`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем базу данных
    await queryRunner.query(`DROP DATABASE IF EXISTS home_library`);
  }
}
