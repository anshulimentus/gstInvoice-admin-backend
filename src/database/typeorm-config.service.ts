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
      type: 'postgres',
    //   host: process.env.DATABASE_HOST || 'localhost',
    //   port: +(process.env.DATABASE_PORT || 5432),
    //   username: process.env.DATABASE_USER || 'postgres',
    //   password: process.env.DATABASE_PASSWORD || 'password',
    //   database: process.env.DATABASE_NAME || 'default_database',
      url: process.env.DATABASE_URL,
    //   ssl: {
    //     rejectUnauthorized: false, // This allows connecting to Render-hosted Postgres over SSL
    //   },
      entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
      synchronize: false, // Disable auto-sync; handled by DatabaseInitService
      logging: true,
      migrations: ['dist/migrations/*.js'],
    };
  }
}