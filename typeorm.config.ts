import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'motominder',

  // Entities: All *.schema.ts files (development) and *.schema.js (production)
  entities: ['src/**/*.schema.{ts,js}', 'dist/**/*.schema.{ts,js}'],

  // Migrations: All migration files in the migrations folder
  migrations: ['src/shared/infrastructure/database/migrations/*.{ts,js}'],

  // Don't auto-sync in any environment (use migrations instead)
  synchronize: false,

  // Enable logging in development
  logging: process.env.NODE_ENV === 'development',
});
