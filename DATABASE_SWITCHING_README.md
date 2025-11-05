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

## Notes

- SSL is automatically configured based on the database type
- Supabase requires SSL connection
- Local database uses SSL only in production environment
- All existing functionality remains the same, only the database connection changes
