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

        return {
            type: 'postgres',
            url: this.configService.get<string>('DATABASE_URL'),
            ssl: isProduction ? { rejectUnauthorized: false } : false, // SSL for production, disabled for local
            entities: [Company, User, State, Category, GstMaster, ImageEntity, Invoice],
            synchronize: false, // Always use migrations, never synchronize in production
            logging: !isProduction, // Disable logging in production for performance
            migrations: ['dist/migrations/*.js'],
            migrationsRun: false, // Let the application control when to run migrations
            autoLoadEntities: true,
        };
    }
}
