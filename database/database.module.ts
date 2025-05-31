// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService], // So AppModule can access it
})
export class DatabaseModule {}
