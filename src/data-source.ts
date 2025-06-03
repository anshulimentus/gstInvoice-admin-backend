// src/data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { Company } from './company/entities/company.entity';
import { User } from './users/users.entity';
import { State } from './State/entities/state.entity';
import { Category } from './category/entities/category.entity';
import { GstMaster } from './gstmaster/entities/gstmaster.entity';
import { ImageEntity } from './image/image.entity';
import { Invoice } from './invoice/entities/invoice.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_HOST_SUPABASE, // from .env file
  entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
//   migrations: ['src/migrations/*.ts'],
migrations: ['dist/migrations/*.js'],

  synchronize: false,
  migrationsRun: true,
  logging: true,
});
