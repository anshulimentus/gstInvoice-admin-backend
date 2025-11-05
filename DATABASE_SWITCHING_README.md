# Database Switching Configuration

This application now supports switching between local PostgreSQL database and Supabase database.

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Choose database type: 'local' or 'supabase'
DATABASE_TYPE=local

# Local Database Configuration
DATABASE_URL=postgres://username:password@localhost:5432/database_name

# Supabase Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Switching Databases

1. **To use Local Database:**
   ```bash
   DATABASE_TYPE=local
   ```
   Make sure `DATABASE_URL` is properly configured.

2. **To use Supabase Database:**
   ```bash
   DATABASE_TYPE=supabase
   ```
   Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are properly configured.

### Current Configuration

- **Local Database (Development)**: `postgres://postgres:Imentus.%40123@localhost:5432/company_db`
- **Production Database (Supabase)**: `postgresql://postgres.wsnjzqsqlbghdjbtyiok:***@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres` (Connection Pooling)

## Usage

1. Set the `DATABASE_TYPE` environment variable to either `local` or `supabase`
2. Ensure the corresponding database credentials are configured
3. Restart the application
4. The application will automatically connect to the selected database

## Migrations

Migrations work with both database types. The `data-source.ts` file automatically uses the configured database for running migrations.

To run migrations:
```bash
npm run migration:run
```

## Database Seeding

The application includes seeding scripts to populate initial data:

### Categories (Business Types)
```bash
# Seed categories locally
npm run db:seed:categories

# Seed categories for production
npm run db:seed:categories:prod
```

**Categories included:**
- Sole Proprietorship
- Partnership Firm
- Limited Liability Partnership (LLP)
- One Person Company (OPC)
- Private Limited Company (Pvt. Ltd.)
- Public Limited Company
- Section 8 Company (Non-Profit Organization)
- Cooperative Society
- Joint Venture
- Subsidiary of a Foreign Company
- Producer Company
- Trust
- Society

### States (Indian States & Union Territories)
```bash
# Seed states locally
npm run db:seed:states

# Seed states for production
npm run db:seed:states:prod
```

**States included:** All 28 Indian states and 8 union territories

### Seed All Data
```bash
# Seed both categories and states locally
npm run db:seed:all

# Seed both categories and states for production
npm run db:seed:all:prod
```

## Notes

- SSL is automatically configured based on the database type
- Supabase requires SSL connection
- Local database uses SSL only in production environment
- All existing functionality remains the same, only the database connection changes
