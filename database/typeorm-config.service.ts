
import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/users/users.entity';
import { State } from 'src/State/entities/state.entity';
import { Category } from 'src/category/entities/category.entity';
import { GstMaster } from 'src/gstmaster/entities/gstmaster.entity';
import { ImageEntity } from 'src/image/image.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
        type: "postgres",
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
        synchronize: false,
        logging: true,
        migrations: ["dist/migrations/*.js"], 
        };
  }
}
