import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/users/users.entity';
import { State } from 'src/State/entities/state.entity';
import { Category } from 'src/category/entities/category.entity';
import { GstMaster } from 'src/gstmaster/entities/gstmaster.entity';
import { ImageEntity } from 'src/image/image.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
        const isProduction = nodeEnv === 'production';
        const databaseType = this.configService.get<string>('DATABASE_TYPE') || 'local';

        let databaseUrl: string;
        let sslConfig: boolean | object;
        let extraOptions: any = {};

        if (databaseType === 'supabase') {
            // Use Supabase configuration
            const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
            const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

            if (!supabaseUrl || !supabaseKey) {
                throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be defined when using Supabase database');
            }

            // Construct Supabase PostgreSQL connection URL
            const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
            const dbPassword = this.configService.get<string>('SUPABASE_DB_PASSWORD');
            if (!dbPassword) {
                throw new Error('SUPABASE_DB_PASSWORD must be defined when using Supabase database');
            }
            // Use the DATABASE_URL directly for Supabase (supports both direct and pooled connections)
            const dbUrl = this.configService.get<string>('DATABASE_URL');
            if (!dbUrl) {
                throw new Error('DATABASE_URL must be defined when using Supabase database');
            }
            databaseUrl = dbUrl;
            sslConfig = { rejectUnauthorized: false }; // Supabase requires SSL
            // Force IPv4 to avoid IPv6 connectivity issues
            extraOptions = { family: 4 };
        } else {
            // Use local database configuration
            const localDatabaseUrl = this.configService.get<string>('DATABASE_URL');

            if (!localDatabaseUrl) {
                throw new Error('DATABASE_URL must be defined when using local database');
            }

            databaseUrl = localDatabaseUrl;
            sslConfig = isProduction ? { rejectUnauthorized: false } : false;
        }

        return {
            type: 'postgres',
            url: databaseUrl,
            ssl: sslConfig,
            entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
            synchronize: false, // Always use migrations, never synchronize in production
            logging: !isProduction, // Disable logging in production for performance
            migrations: ['dist/migrations/*.js'],
            migrationsRun: false, // Let the application control when to run migrations
            autoLoadEntities: true,
            extra: extraOptions,
        };
    }
}
