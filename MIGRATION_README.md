# Database Migration Guide

This guide explains how to manage database migrations for both local development and production environments.

## Overview

The application uses TypeORM migrations to manage database schema changes. This ensures consistency between local development and production environments.

## Key Principles

- **Never use `synchronize: true`** in production - always use migrations
- **Migrations are environment-agnostic** - they work the same in local and production
- **Always test migrations locally** before deploying to production
- **Keep migration files** in version control

## Environment Configuration

### Local Development (.env)
```bash
DATABASE_URL=postgres://postgres:Imentus.%40123@localhost:5432/company_db
NODE_ENV=development
```

### Production (.env.production)
```bash
DATABASE_URL=postgres://username:password@production-host:5432/production_database
NODE_ENV=production
```

## Migration Commands

### Generate a Migration
Creates a new migration file based on entity changes:
```bash
npm run migration:generate -- -n MigrationName
```

### Create Empty Migration
Creates a blank migration file for manual SQL:
```bash
npm run migration:create -- -n MigrationName
```

### Run Migrations
Apply pending migrations to the database:

**Local:**
```bash
npm run db:migrate:local
```

**Production:**
```bash
npm run db:migrate:prod
```

### Show Migration Status
Check which migrations have been applied:
```bash
npm run migration:show
```

### Rollback Migration
Revert the last applied migration:

**Local:**
```bash
npm run db:rollback:local
```

**Production:**
```bash
npm run db:rollback:prod
```

## Development Workflow

1. **Make entity changes** in your TypeORM entities
2. **Generate migration:**
   ```bash
   npm run migration:generate -- -n AddNewFeature
   ```
3. **Review the generated migration** file in `src/migrations/`
4. **Test locally:**
   ```bash
   npm run db:migrate:local
   ```
5. **Commit migration files** to version control
6. **Deploy to production** and run:
   ```bash
   npm run db:migrate:prod
   ```

## Production Deployment

### Automated Migration (Recommended)
Add migration command to your deployment pipeline:

```bash
# In your deployment script
npm run build
npm run db:migrate:prod
npm run start:prod
```

### Manual Migration
If you need to run migrations manually in production:

```bash
# SSH into production server
cd /path/to/your/app
NODE_ENV=production npm run migration:run
```

## Best Practices

### Migration Naming
- Use descriptive names: `AddUserEmailIndex`, `CreateProductTable`
- Follow PascalCase convention
- Include timestamp automatically (handled by TypeORM)

### Migration Content
- Keep migrations simple and focused
- Test both `up` and `down` methods
- Use raw SQL when TypeORM doesn't support the operation
- Avoid data manipulation in schema migrations

### Environment Handling
- Migrations should work in all environments
- Use environment variables for environment-specific values
- Test migrations against production-like data

### Rollback Strategy
- Always implement proper `down` methods
- Test rollback functionality
- Have a backup strategy before running migrations in production

## Troubleshooting

### Migration Fails
1. Check database connection
2. Verify migration syntax
3. Check if tables already exist
4. Review migration dependencies

### Rollback Issues
1. Ensure `down` method is implemented
2. Check for foreign key constraints
3. Verify data dependencies

### Environment Differences
1. Compare local and production database versions
2. Check environment variables
3. Verify SSL configuration

## Migration File Structure

```
src/migrations/
├── 1749018658433-AddWalletAddressToUsers.ts
└── [timestamp]-[MigrationName].ts
```

Each migration file contains:
- `up()` method: Apply changes
- `down()` method: Revert changes
- Proper imports and class structure
