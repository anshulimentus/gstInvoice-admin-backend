import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GstMaster } from './entities/gstmaster.entity';

@Injectable()
export class GstMasterService {
  constructor(
    @InjectRepository(GstMaster)
    private readonly gstMasterRepository: Repository<GstMaster>,
  ) {}

  async findAll(): Promise<GstMaster[]> {
    return this.gstMasterRepository.find();
  }

  async findOne(gstNumber: string): Promise<GstMaster | null> {
    return this.gstMasterRepository.findOne({ where: { gstNumber } });
  }
}
