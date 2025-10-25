import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

/**
 * E2E Test with Real Database
 *
 * This test uses the actual PostgreSQL database.
 * Run this ONLY when you want to test with real database.
 *
 * Before running:
 * 1. Ensure Docker is running: docker compose up -d
 * 2. Run migrations: npm run migration:run
 * 3. Set TEST_DATABASE_URL in .env.test
 */
describe('User API (E2E - Real Database)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Uses real TypeOrmUserRepository
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get database connection for cleanup
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await dataSource.query('DELETE FROM users');
  });

  describe('POST /users', () => {
    it('should create a new user in database', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');

      // Verify in database
      const result = await dataSource.query(
        'SELECT * FROM users WHERE email = $1',
        ['john@example.com'],
      );
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John Doe');
    });

    it('should enforce unique email constraint', async () => {
      // Create first user
      await request(app.getHttpServer()).post('/users').send({
        name: 'John Doe',
        email: 'john@example.com',
      });

      // Try to create duplicate
      await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Jane Doe',
          email: 'john@example.com',
        })
        .expect(500); // Error from use case or database constraint
    });

    it('should persist data across requests', async () => {
      // Create user
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });

      const userId = createResponse.body.id;

      // Verify it's in database by querying directly
      const dbUser = await dataSource.query(
        'SELECT * FROM users WHERE id = $1',
        [userId],
      );

      expect(dbUser).toHaveLength(1);
      expect(dbUser[0].id).toBe(userId);
      expect(dbUser[0].name).toBe('John Doe');
    });

    it('should set timestamps automatically', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });

      // Check database for timestamps
      const result = await dataSource.query(
        'SELECT created_at, updated_at FROM users WHERE id = $1',
        [response.body.id],
      );

      expect(result[0].created_at).toBeDefined();
      expect(result[0].updated_at).toBeDefined();
      expect(new Date(result[0].created_at).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
    });
  });
});
