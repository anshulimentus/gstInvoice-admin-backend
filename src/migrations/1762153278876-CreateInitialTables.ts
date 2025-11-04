import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1762153278876 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Check and create missing tables only

        // Create companybusinesstype table (Category) - if not exists
        const categoryTableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'companybusinesstype'
            )
        `);

        if (!categoryTableExists[0].exists) {
            await queryRunner.query(`
                CREATE TABLE "companybusinesstype" (
                    "id" SERIAL NOT NULL,
                    "name" character varying NOT NULL,
                    CONSTRAINT "PK_companybusinesstype" PRIMARY KEY ("id")
                )
            `);
        }

        // Create gst_master table - if not exists
        const gstMasterTableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'gst_master'
            )
        `);

        if (!gstMasterTableExists[0].exists) {
            await queryRunner.query(`
                CREATE TABLE "gst_master" (
                    "gst_number" character varying(20) NOT NULL,
                    "company_name" character varying(100),
                    "addressline1" character varying(255),
                    "addressline2" character varying(255),
                    "city" character varying(100),
                    "state" integer,
                    "first_name" character varying(50),
                    "last_name" character varying(50),
                    "email" character varying(100),
                    CONSTRAINT "PK_gst_master" PRIMARY KEY ("gst_number")
                )
            `);
        }

        // Handle image/images table migration
        const imageTableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'image'
            )
        `);

        const imagesTableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'images'
            )
        `);

        if (imageTableExists[0].exists && !imagesTableExists[0].exists) {
            // Rename image to images and update structure
            await queryRunner.query(`ALTER TABLE "image" RENAME TO "images"`);

            // Check if columns need to be updated
            const columns = await queryRunner.query(`
                SELECT column_name FROM information_schema.columns
                WHERE table_name = 'images' AND table_schema = 'public'
            `);

            const columnNames = columns.map(col => col.column_name);

            // Handle uploadedat column
            if (columnNames.includes('created_at') && !columnNames.includes('uploadedat')) {
                await queryRunner.query(`ALTER TABLE "images" RENAME COLUMN "created_at" TO "uploadedat"`);
            } else if (!columnNames.includes('uploadedat')) {
                await queryRunner.query(`ALTER TABLE "images" ADD COLUMN "uploadedat" TIMESTAMP DEFAULT now()`);
            }

            // Change id from integer to uuid if needed
            const idColumn = await queryRunner.query(`
                SELECT data_type FROM information_schema.columns
                WHERE table_name = 'images' AND column_name = 'id' AND table_schema = 'public'
            `);

            if (idColumn[0].data_type === 'integer') {
                // Drop existing primary key and sequence with CASCADE
                await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT IF EXISTS "PK_d6db1ab4ee9ad9dbe86c64e4cc3"`);
                await queryRunner.query(`DROP SEQUENCE IF EXISTS image_id_seq CASCADE`);

                // Change column type and set default
                await queryRunner.query(`ALTER TABLE "images" ALTER COLUMN "id" TYPE uuid USING uuid_generate_v4()`);
                await queryRunner.query(`ALTER TABLE "images" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
                await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "PK_images" PRIMARY KEY ("id")`);
            }

            // Add base64data column if it doesn't exist (rename from url or add new)
            if (!columnNames.includes('base64data')) {
                if (columnNames.includes('url')) {
                    await queryRunner.query(`ALTER TABLE "images" RENAME COLUMN "url" TO "base64data"`);
                    await queryRunner.query(`ALTER TABLE "images" ALTER COLUMN "base64data" TYPE text`);
                } else {
                    await queryRunner.query(`ALTER TABLE "images" ADD COLUMN "base64data" text`);
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "gst_master"`);
        await queryRunner.query(`DROP TABLE "companybusinesstype"`);
        await queryRunner.query(`DROP TABLE "State"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
