// import { Injectable } from '@nestjs/common';
// import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { Company } from 'src/company/entities/company.entity';
// import { User } from 'src/users/users.entity';
// import { State } from 'src/State/entities/state.entity';
// import { Category } from 'src/category/entities/category.entity';
// import { GstMaster } from 'src/gstmaster/entities/gstmaster.entity';
// import { ImageEntity } from 'src/image/image.entity';
// import { Invoice } from 'src/invoice/entities/invoice.entity';
// import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';
// dotenv.config();

// @Injectable()
// export class TypeOrmConfigService implements TypeOrmOptionsFactory {
//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {
//       type: 'postgres',
//       url: process.env.DATABASE_HOST_SUPABASE,
//       entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
//       // entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       synchronize: false,
//       logging: true,
//       migrations: ['src/migrations/*.ts'],
//       migrationsRun: true, // Automatically run migrations on startup (optional)
//     };
//   }
// }

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   url: process.env.DATABASE_HOST_SUPABASE,
//   entities: [Company], // add other entities here
//   migrations: ['src/migrations/*.ts'],
//   synchronize: false,
//   logging: true,
// });


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
        port: +(process.env.DATABASE_PORT || 5432),
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


