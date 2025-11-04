import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStateTable1762171688697 implements MigrationInterface {
    name = 'CreateStateTable1762171688697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_8900c9dd86b637d32174a965fa1"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_ec771041a9248416f3062013973"`);
        await queryRunner.query(`CREATE TABLE "State" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_2f896ea8815d952f289ac9a562c" UNIQUE ("name"), CONSTRAINT "PK_ba7801fef9aabc0a35a0110c896" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "originalname"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "sellerId"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "buyerId"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "buyerApprovalDate"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "approvedBy"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "is_claimed_for_itc"`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "tenant_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "tenant_id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "tenant_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "tenant_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "is_claimed_for_itc" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "approvedBy" character varying`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "buyerApprovalDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "buyerId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "sellerId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "images" ADD "size" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "images" ADD "originalname" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "State"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_ec771041a9248416f3062013973" FOREIGN KEY ("buyerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_8900c9dd86b637d32174a965fa1" FOREIGN KEY ("sellerId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
