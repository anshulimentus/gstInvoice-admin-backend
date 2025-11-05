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
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService, // should return config with `synchronize: true`
    }),
    DatabaseModule, // Add DatabaseModule to imports
    AuthModule,
    UsersModule,
    StateModule,
    CategoryModule,
    CompanyModule,
    GstMasterModule,
    ImageModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements OnApplicationBootstrap {
  constructor(private databaseInitService: DatabaseInitService) {}

  async onApplicationBootstrap() {
    await this.databaseInitService.initializeDatabase();
  }
}
