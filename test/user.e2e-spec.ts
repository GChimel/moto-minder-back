import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { USER_REPOSITORY } from '../src/user/application/ports/user.repository.port';
import { InMemoryUserRepository } from '../src/user/infrastructure/adapters/in-memory-user.repository';

describe('User API (E2E)', () => {
  let app: INestApplication;
  let repository: InMemoryUserRepository;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(USER_REPOSITORY)
      .useValue(repository) // Override with in-memory for E2E tests
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', 'John Doe');
          expect(res.body).toHaveProperty('email', 'john@example.com');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should return 500 for duplicate email', async () => {
      // Create first user
      await request(app.getHttpServer()).post('/users').send({
        name: 'John Doe',
        email: 'john@example.com',
      });

      // Try to create duplicate
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Jane Doe',
          email: 'john@example.com', // Same email
        })
        .expect(500); // Will throw error (you can add exception filter to return 400/409)
    });

    it('should return 500 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'invalid-email', // No @
        })
        .expect(500); // Will throw error
    });

    it('should return 500 for invalid name', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'J', // Too short
          email: 'john@example.com',
        })
        .expect(500); // Will throw error
    });

    it('should create multiple users', async () => {
      // Create first user
      const user1Response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });

      // Create second user
      const user2Response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
        });

      expect(user1Response.body.id).not.toBe(user2Response.body.id);

      // Verify in repository
      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(2);
    });
  });
});
