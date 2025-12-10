/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('User API (E2E - Real Database)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
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

      const result = await dataSource.query(
        'SELECT * FROM users WHERE email = $1',
        ['john@example.com'],
      );
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John Doe');
    });

    it('should enforce unique email constraint', async () => {
      await request(app.getHttpServer()).post('/users').send({
        name: 'John Doe',
        email: 'john@example.com',
      });

      await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Jane Doe',
          email: 'john@example.com',
        })
        .expect(500);
    });

    it('should persist data across requests', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });

      const userId = createResponse.body.id;

      const dbUser = await dataSource.query(
        'SELECT * FROM users WHERE id = $1',
        [userId],
      );

      expect(dbUser).toHaveLength(1);
      expect(dbUser[0].id).toBe(userId);
      expect(dbUser[0].name).toBe('John Doe');
    });

    it('should set timestamps automatically', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        name: 'John Doe',
        email: 'john@example.com',
      });

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
