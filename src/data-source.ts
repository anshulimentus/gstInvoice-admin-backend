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
const nodeEnv = process.env.NODE_ENV || 'development';

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Environment-specific configuration
const isProduction = nodeEnv === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: isProduction ? { rejectUnauthorized: false } : false, // SSL for production, disabled for local
  entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // Always use migrations, never synchronize in production
  logging: !isProduction, // Disable logging in production for performance
  migrationsRun: false, // Let the application control when to run migrations
});
