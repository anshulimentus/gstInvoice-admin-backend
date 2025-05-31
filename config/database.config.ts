import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";
import { User } from "src/users/users.entity";
import { State } from 'src/State/entities/state.entity';
import { Category } from 'src/category/entities/category.entity';
import { Company } from 'src/company/entities/company.entity';
import { ImageEntity } from "src/image/image.entity";
import { Invoice } from "src/invoice/entities/invoice.entity";


config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '774803',
    database: process.env.DATABASE_NAME || 'employee-invoice-portal',
    entities: [Company, User, State, Category, ImageEntity, Invoice],
    synchronize: false,
    logging: true,
    migrations: ["dist/migrations/*.js"], 
}