import { Controller, Get, Param } from '@nestjs/common';
import { GstMasterService } from './gstmaster.service';
import { GstMaster } from './entities/gstmaster.entity';
import { NotFoundException } from '@nestjs/common';
import chalk from 'chalk';

@Controller('gst-master')
export class GstMasterController {
  constructor(private readonly gstMasterService: GstMasterService) {}

  @Get()
  async getAll(): Promise<GstMaster[]> {
    console.log(chalk.bgRedBright("🚀 Fetching all GST Masters..."));
    return this.gstMasterService.findAll();
  }

  @Get(':gstNumber')
  async getByGstNumber(@Param('gstNumber') gstNumber: string): Promise<GstMaster> {
    console.log(chalk.bgRedBright("🚀 Fetching GST Master with GST Number:", gstNumber));
    const gstMaster = await this.gstMasterService.findOne(gstNumber);
    if (!gstMaster) {
      throw new NotFoundException(`GST Master with GST Number ${gstNumber} not found`);
    }
    return gstMaster;
  }
}
