import 'dotenv/config'; // Loads .env into process.env automatically
import { DataSource } from 'typeorm';

import { Company } from './company/entities/company.entity';
import { User } from './users/users.entity';
import { State } from './State/entities/state.entity';
import { Category } from './category/entities/category.entity';
import { GstMaster } from './gstmaster/entities/gstmaster.entity';
import { ImageEntity } from './image/image.entity';
import { Invoice } from './invoice/entities/invoice.entity';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: { rejectUnauthorized: false },
  entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
});
