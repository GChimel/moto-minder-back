/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('User API (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
      await request(app.getHttpServer()).post('/users').send({
        name: 'John Doe',
        email: 'john@example.com',
      });

      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Jane Doe',
          email: 'john@example.com',
        })
        .expect(500);
    });

    it('should return 500 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
        })
        .expect(500);
    });

    it('should return 500 for invalid name', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'J',
          email: 'john@example.com',
        })
        .expect(500);
    });

    it('should create multiple users', async () => {
      const user1Response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        });

      const user2Response = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
        });

      expect(user1Response.body.id).not.toBe(user2Response.body.id);
    });
  });
});
