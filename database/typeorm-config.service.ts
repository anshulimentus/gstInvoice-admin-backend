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
    console.log("Initializing TypeORM with DATABASE_URL:", process.env.DATABASE_URL);
    
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // More reliable entity path resolution:
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: ['query', 'error', 'schema'],
      extra: {
        // Recommended for production:
        poolSize: 10,
        connectionTimeoutMillis: 2000,
        query_timeout: 5000,
      },
      // Remove migrations if using synchronize
    };
  }
}


// import { Injectable } from '@nestjs/common';
// import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { Company } from 'src/company/entities/company.entity';
// import { User } from 'src/users/users.entity';
// import { State } from 'src/State/entities/state.entity';
// import { Category } from 'src/category/entities/category.entity';
// import { GstMaster } from 'src/gstmaster/entities/gstmaster.entity';
// import { ImageEntity } from 'src/image/image.entity';
// import { Invoice } from 'src/invoice/entities/invoice.entity';

// @Injectable()
// export class TypeOrmConfigService implements TypeOrmOptionsFactory {
//   createTypeOrmOptions(): TypeOrmModuleOptions {
//       console.log("🚀 ~ TypeOrmConfigService ~ createTypeOrmOptions ~ url:", process.env.DATABASE_URL)
//     return {
//       type: 'postgres',
//       url: process.env.DATABASE_URL, // ✅ Use DATABASE_URL directly
//       entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
//       synchronize: true,
//       logging: true,
//       // migrations: ['dist/migrations/*.js'],
//     };
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { Company } from 'src/company/entities/company.entity';
// import { User } from 'src/users/users.entity';
// import { State } from 'src/State/entities/state.entity';
// import { Category } from 'src/category/entities/category.entity';
// import { GstMaster } from 'src/gstmaster/entities/gstmaster.entity';
// import { ImageEntity } from 'src/image/image.entity';
// import { Invoice } from 'src/invoice/entities/invoice.entity';

// @Injectable()
// export class TypeOrmConfigService implements TypeOrmOptionsFactory {
//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {
//         type: "postgres",
//         host: process.env.DATABASE_HOST,
//         port: +(process.env.DATABASE_PORT || 5432),
//         username: process.env.DATABASE_USER,
//         password: process.env.DATABASE_PASSWORD,
//         database: process.env.DATABASE_NAME,
//         entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
//         synchronize: false,
//         logging: true,
//         migrations: ["dist/migrations/*.js"], 
//         };
//   }
// }


