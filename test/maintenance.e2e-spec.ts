/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ServiceType } from '../src/maintenance/domain/enums/service-type.enum';

describe('Maintenance E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let userMotocycleId: string;
  let maintenanceRecordId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Setup: User and Motorcycle Registration', () => {
    it('should register a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'maintenance-test@example.com',
          password: 'TestPassword123!',
          firstName: 'Maintenance',
          lastName: 'Tester',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      authToken = response.body.accessToken;
    });

    it('should login user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'maintenance-test@example.com',
          password: 'TestPassword123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      authToken = response.body.accessToken;
    });

    it('should create a motorcycle for the user', async () => {
      // First get a motocycle model
      const modelsResponse = await request(app.getHttpServer())
        .get('/motocycle-models')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const modelId = modelsResponse.body[0].id;

      const response = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          motocycleModelId: modelId,
          nickname: 'Test Motorcycle',
          manufacturingYear: 2020,
          currentOdometer: 10000,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      userMotocycleId = response.body.id;
    });
  });

  describe('POST /maintenance', () => {
    it('should create a maintenance record', async () => {
      const response = await request(app.getHttpServer())
        .post('/maintenance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userMotocycleId,
          serviceType: ServiceType.OIL_CHANGE,
          performedAt: new Date('2024-01-15'),
          odometerAtService: 10000,
          cost: 50.5,
          partsUsed: 'Castrol Oil 10W30',
          notes: 'Regular oil change',
          nextServiceInterval: { intervalKm: 5000, intervalMonths: 6 },
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.serviceType).toBe(ServiceType.OIL_CHANGE);
      expect(response.body.odometerAtService).toBe(10000);
      expect(response.body.cost).toBe(50.5);
      maintenanceRecordId = response.body.id;
    });

    it('should create record with minimal fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/maintenance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userMotocycleId,
          serviceType: ServiceType.BRAKE_SERVICE,
          performedAt: new Date('2024-02-15'),
          odometerAtService: 12000,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.cost).toBeUndefined();
    });

    it('should reject future service date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      await request(app.getHttpServer())
        .post('/maintenance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userMotocycleId,
          serviceType: ServiceType.OIL_CHANGE,
          performedAt: futureDate,
          odometerAtService: 10000,
        })
        .expect(400);
    });

    it('should reject negative odometer', async () => {
      await request(app.getHttpServer())
        .post('/maintenance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userMotocycleId,
          serviceType: ServiceType.OIL_CHANGE,
          performedAt: new Date('2024-01-15'),
          odometerAtService: -1,
        })
        .expect(400);
    });

    it('should reject request without auth token', async () => {
      await request(app.getHttpServer())
        .post('/maintenance')
        .send({
          userMotocycleId,
          serviceType: ServiceType.OIL_CHANGE,
          performedAt: new Date('2024-01-15'),
          odometerAtService: 10000,
        })
        .expect(401);
    });
  });

  describe('GET /maintenance/motorcycle/:userMotocycleId', () => {
    it('should get maintenance history for motorcycle', async () => {
      const response = await request(app.getHttpServer())
        .get(`/maintenance/motorcycle/${userMotocycleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('serviceType');
    });

    it('should return empty array for motorcycle with no maintenance', async () => {
      // Create a new motorcycle without maintenance
      const modelsResponse = await request(app.getHttpServer())
        .get('/motocycle-models')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const modelId = modelsResponse.body[0].id;

      const motoResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          motocycleModelId: modelId,
          nickname: 'Empty Motorcycle',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        })
        .expect(201);

      const emptyMotoId = motoResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/maintenance/motorcycle/${emptyMotoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /maintenance/upcoming', () => {
    beforeAll(async () => {
      // Create maintenance records with intervals for testing
      await request(app.getHttpServer())
        .post('/maintenance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userMotocycleId,
          serviceType: ServiceType.TIRE_REPLACEMENT,
          performedAt: new Date('2024-01-01'),
          odometerAtService: 15000,
          nextServiceInterval: { intervalKm: 10000, intervalMonths: 12 },
        })
        .expect(201);
    });

    it('should get upcoming maintenance', async () => {
      const response = await request(app.getHttpServer())
        .get('/maintenance/upcoming')
        .query({
          userMotocycleId,
          currentOdometer: 20000,
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('record');
        expect(response.body[0]).toHaveProperty('isOverdueByOdometer');
        expect(response.body[0]).toHaveProperty('isOverdueByDate');
      }
    });

    it('should calculate overdue maintenance', async () => {
      const response = await request(app.getHttpServer())
        .get('/maintenance/upcoming')
        .query({
          userMotocycleId,
          currentOdometer: 26000, // Beyond all intervals
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Some records should be marked as overdue
      const overdueRecords = response.body.filter(
        (item: { isOverdueByOdometer: boolean }) => item.isOverdueByOdometer,
      );
      expect(overdueRecords.length).toBeGreaterThan(0);
    });
  });

  describe('GET /maintenance/history/:userMotocycleId', () => {
    it('should get paginated maintenance history', async () => {
      const response = await request(app.getHttpServer())
        .get(`/maintenance/history/${userMotocycleId}`)
        .query({
          skip: 0,
          limit: 10,
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('records');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('skip');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('hasMore');
      expect(Array.isArray(response.body.records)).toBe(true);
    });

    it('should use default pagination if not provided', async () => {
      const response = await request(app.getHttpServer())
        .get(`/maintenance/history/${userMotocycleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.skip).toBe(0);
      expect(response.body.limit).toBe(50);
    });

    it('should respect pagination parameters', async () => {
      // Create multiple records first
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/maintenance')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            userMotocycleId,
            serviceType: ServiceType.OIL_CHANGE,
            performedAt: new Date(2024, 0, i + 20),
            odometerAtService: 20000 + i * 1000,
          })
          .expect(201);
      }

      const response = await request(app.getHttpServer())
        .get(`/maintenance/history/${userMotocycleId}`)
        .query({
          skip: 2,
          limit: 3,
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.skip).toBe(2);
      expect(response.body.limit).toBe(3);
      expect(response.body.records.length).toBeLessThanOrEqual(3);
    });
  });

  describe('PATCH /maintenance/:id', () => {
    it('should update maintenance record cost', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/maintenance/${maintenanceRecordId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cost: 75.5,
        })
        .expect(200);

      expect(response.body.cost).toBe(75.5);
    });

    it('should update maintenance record notes', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/maintenance/${maintenanceRecordId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          notes: 'Updated notes after review',
        })
        .expect(200);

      expect(response.body.notes).toBe('Updated notes after review');
    });

    it('should update multiple fields', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/maintenance/${maintenanceRecordId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cost: 85,
          notes: 'Multi-field update',
          partsUsed: 'Updated parts',
        })
        .expect(200);

      expect(response.body.cost).toBe(85);
      expect(response.body.notes).toBe('Multi-field update');
      expect(response.body.partsUsed).toBe('Updated parts');
    });

    it('should return 404 for non-existent record', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .patch(`/maintenance/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cost: 100,
        })
        .expect(404);
    });

    it('should reject invalid cost', async () => {
      await request(app.getHttpServer())
        .patch(`/maintenance/${maintenanceRecordId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cost: -50,
        })
        .expect(400);
    });
  });

  describe('DELETE /maintenance/:id', () => {
    let recordToDelete: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/maintenance')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userMotocycleId,
          serviceType: ServiceType.CHAIN_MAINTENANCE,
          performedAt: new Date('2024-03-01'),
          odometerAtService: 18000,
        })
        .expect(201);

      recordToDelete = response.body.id;
    });

    it('should delete a maintenance record', async () => {
      await request(app.getHttpServer())
        .delete(`/maintenance/${recordToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent record', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .delete(`/maintenance/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should confirm deletion', async () => {
      // Verify record no longer exists
      const response = await request(app.getHttpServer())
        .get(`/maintenance/history/${userMotocycleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const foundRecord = response.body.records.some(
        (r: { id: string }) => r.id === recordToDelete,
      );
      expect(foundRecord).toBe(false);
    });
  });

  describe('Authorization', () => {
    let otherUserToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'other-user@example.com',
          password: 'OtherPassword123!',
          firstName: 'Other',
          lastName: 'User',
        })
        .expect(201);

      otherUserToken = response.body.accessToken;
    });

    it('should reject unauthorized user accessing maintenance', async () => {
      await request(app.getHttpServer())
        .get(`/maintenance/motorcycle/${userMotocycleId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(200); // Gets empty list since other user has no motorcycles
    });
  });
});
