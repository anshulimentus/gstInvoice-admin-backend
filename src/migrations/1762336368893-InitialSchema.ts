import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762336368893 implements MigrationInterface {
    name = 'InitialSchema1762336368893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Only create tables that don't exist

        // Create company table if not exists
        const companyTableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'company'
            )
        `);
        if (!companyTableExists[0].exists) {
            await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "Company_Name" character varying NOT NULL, "GST_Number" character varying NOT NULL, "Transaction_Hash" character varying, "Legal_Representative" character varying NOT NULL, "image_url" text NOT NULL, "image_id" character varying(255) NOT NULL, "First_name" character varying NOT NULL, "Last_name" character varying NOT NULL, "Email" character varying NOT NULL, "Password" character varying, "categoryID" bigint, "address" character varying, "stateID" bigint, "tenant_id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "UQ_60791ec4cd0cb572a4eab33322d" UNIQUE ("Legal_Representative"), CONSTRAINT "UQ_1725ed3890e9683ed1d3a18e3dd" UNIQUE ("Email"), CONSTRAINT "UQ_d37ba2ef0271f80021e0b6ef926" UNIQUE ("tenant_id"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        }

        // Create users table if not exists
        const usersTableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'users'
            )
        `);
        if (!usersTableExists[0].exists) {
            await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "wallet_address" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'admin', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_196ef3e52525d3cd9e203bdb1de" UNIQUE ("wallet_address"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        }

        // Create State table if not exists
        const stateTableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'State'
            )
        `);
        if (!stateTableExists[0].exists) {
            await queryRunner.query(`CREATE TABLE "State" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_2f896ea8815d952f289ac9a562c" UNIQUE ("name"), CONSTRAINT "PK_ba7801fef9aabc0a35a0110c896" PRIMARY KEY ("id"))`);
        }

        // Create images table if not exists
        const imagesTableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'images'
            )
        `);
        if (!imagesTableExists[0].exists) {
            await queryRunner.query(`CREATE TABLE "images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "base64data" text NOT NULL, "mimetype" character varying NOT NULL, "uploadedat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        }

        // Create invoice table if not exists
        const invoiceTableExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'invoice'
            )
        `);
        if (!invoiceTableExists[0].exists) {
            await queryRunner.query(`CREATE TABLE "invoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoicenumber" character varying NOT NULL, "invoicedate" date NOT NULL, "supplyType" character varying NOT NULL, "totalamount" numeric(10,2) NOT NULL, "gstamount" numeric(10,2) NOT NULL, "grandtotal" numeric(10,2) NOT NULL, "paymentTerms" character varying NOT NULL, "transactionHash" character varying, "isFinal" boolean NOT NULL, "items" json NOT NULL, "createdat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "gst_master"`);
        await queryRunner.query(`DROP TABLE "companybusinesstype"`);
        await queryRunner.query(`DROP TABLE "State"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}
