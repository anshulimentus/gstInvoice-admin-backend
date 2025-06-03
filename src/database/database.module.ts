import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './typeorm-config.service';
import { DatabaseInitService } from './database-init.service';

@Module({
  providers: [TypeOrmConfigService, DatabaseInitService],
  exports: [TypeOrmConfigService, DatabaseInitService], // Export services for use in AppModule
})
export class DatabaseModule {}