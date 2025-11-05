import 'dotenv/config'; // Loads .env into process.env automatically
import { DataSource } from 'typeorm';

import { Company } from './company/entities/company.entity';
import { User } from './users/users.entity';
import { State } from './State/entities/state.entity';
import { Category } from './category/entities/category.entity';
import { GstMaster } from './gstmaster/entities/gstmaster.entity';
import { ImageEntity } from './image/image.entity';
import { Invoice } from './invoice/entities/invoice.entity';

const nodeEnv = process.env.NODE_ENV || 'development';
const databaseType = process.env.DATABASE_TYPE || 'local';

// Environment-specific configuration
const isProduction = nodeEnv === 'production';

let databaseUrl: string;
let sslConfig: boolean | object;

if (databaseType === 'supabase') {
  // Use Supabase configuration - use DATABASE_URL directly (supports pooled connections)
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error('DATABASE_URL must be defined when using Supabase database');
  }

  databaseUrl = dbUrl;
  sslConfig = { rejectUnauthorized: false }; // Supabase requires SSL
} else {
  // Use local database configuration
  const localDatabaseUrl = process.env.DATABASE_URL;

  if (!localDatabaseUrl) {
    throw new Error('DATABASE_URL must be defined when using local database');
  }

  databaseUrl = localDatabaseUrl;
  sslConfig = isProduction ? { rejectUnauthorized: false } : false;
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: sslConfig,
  entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // Always use migrations, never synchronize in production
  logging: !isProduction, // Disable logging in production for performance
  migrationsRun: false, // Let the application control when to run migrations
});
