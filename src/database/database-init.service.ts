import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Client } from 'pg';

@Injectable()
export class DatabaseInitService {
    private readonly logger = new Logger(DatabaseInitService.name);

    constructor(private dataSource: DataSource) {}

    async initializeDatabase() {
        try {
            await this.checkAndCreateDatabase();
            await this.checkAndCreateTables();
        } catch (error) {
            this.logger.error('Error during database initialization:', error);
        }
    }

    private async checkAndCreateDatabase() {
        const databaseName = process.env.DATABASE_NAME || 'default_database';
        const host = process.env.DATABASE_HOST || 'localhost';
        const port = +(process.env.DATABASE_PORT || 5432);
        const user = process.env.DATABASE_USER || 'postgres';
        const password = process.env.DATABASE_PASSWORD || 'password';

        const client = new Client({
            host,
            port,
            user,
            password,
            database: 'postgres', // Connect to the default 'postgres' database to check/create the target database
        });

        try {
            await client.connect();
            const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${databaseName}'`);
            if (result.rowCount === 0) {
                this.logger.log(`Database "${databaseName}" does not exist. Creating database...`);
                await client.query(`CREATE DATABASE "${databaseName}"`);
                this.logger.log(`Database "${databaseName}" created successfully.`);
            } else {
                this.logger.log(`Database "${databaseName}" already exists.`);
            }
        } catch (error) {
            if (error.code === '3D000') {
                this.logger.error(`Database "${databaseName}" does not exist and could not be created.`, error);
            } else {
                this.logger.error('Error checking/creating database:', error);
            }
        } finally {
            await client.end();
        }
    }

    private async checkAndCreateTables() {
        try {
            await this.dataSource.initialize(); // Ensure the DataSource is initialized
            await this.dataSource.synchronize(); // Automatically creates tables based on entities
            this.logger.log('Tables checked/created successfully.');
        } catch (error) {
            this.logger.error('Error creating tables:', error);
        } finally {
            await this.dataSource.destroy(); // Clean up the DataSource connection
        }
    }
}