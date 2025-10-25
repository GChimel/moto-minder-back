# Database Migrations

This folder contains TypeORM database migrations for the Moto-Minder application.

## Commands

### Generate a new migration (auto-detects schema changes)
```bash
npm run migration:generate MigrationName
```

### Create an empty migration (manual)
```bash
npm run migration:create MigrationName
```

### Run pending migrations
```bash
npm run migration:run
```

### Revert the last migration
```bash
npm run migration:revert
```

### Show migration status
```bash
npm run migration:show
```

## Important Notes

- Always test migrations in development before running in production
- Keep migrations small and focused on a single change
- Never modify an existing migration that has been run in production
- Use descriptive names for migrations (e.g., CreateUsersTable, AddEmailIndexToUsers)
