import { MigrationInterface, QueryRunner } from "typeorm";

export class testMig11670152540421 implements MigrationInterface {
    name = 'testMig11670152540421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "test"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "test" integer`);
    }

}
