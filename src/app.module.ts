// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { StateModule } from './State/state.module';
// import { CategoryModule } from './category/category.module';
// import { CompanyModule } from './company/company.module';
// // import { UploadModule } from './upload/upload.module';
// import { DatabaseModule } from 'database/database.module';
// import { TypeOrmConfigService } from 'database/typeorm-config.service';
// import { GstMasterModule } from './gstmaster/gstmaster.module';
// import { ImageModule } from './image/image.module';
// import { InvoiceModule } from './invoice/invoice.module';
// import { AppDataSource } from './data-source';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal:true,
//       envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
//     }),
//     TypeOrmModule.forRootAsync({
//       // imports: [DatabaseModule],
//       // useClass: TypeOrmConfigService,
//      useFactory: async () => ({
//       ...AppDataSource.options,
//      })
//     }),
//     AuthModule,
//     UsersModule,
//     StateModule,
//     CategoryModule,
//     CompanyModule,
//     // UploadModule,
//     DatabaseModule,
//     GstMasterModule,
//     ImageModule,
//     InvoiceModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
//   exports: [TypeOrmModule], // Export TypeOrmModule for use in other modules
// })
// export class AppModule {}


import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StateModule } from './State/state.module';
import { CategoryModule } from './category/category.module';
import { CompanyModule } from './company/company.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseInitService } from './database/database-init.service';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { GstMasterModule } from './gstmaster/gstmaster.module';
import { ImageModule } from './image/image.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UsersModule,
    StateModule,
    CategoryModule,
    CompanyModule,
    DatabaseModule,
    GstMasterModule,
    ImageModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseInitService],
  exports: [TypeOrmModule], // Export TypeOrmModule for use in other modules
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly databaseInitService: DatabaseInitService) {}

  async onApplicationBootstrap() {
    await this.databaseInitService.initializeDatabase();
  }
}
