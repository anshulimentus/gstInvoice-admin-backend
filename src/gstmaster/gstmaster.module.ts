import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GstMaster } from './entities/gstmaster.entity';
import { GstMasterService } from './gstmaster.service';
import { GstMasterController } from './gstmaster.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GstMaster])],
  providers: [GstMasterService],
  controllers: [GstMasterController],
})
export class GstMasterModule {}
