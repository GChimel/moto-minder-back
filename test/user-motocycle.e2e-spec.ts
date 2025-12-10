import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/domain/entities/user.entity';
import { MotocycleModel } from '../src/motocycle-model/domain/entities/motocycle-model.entity';
import { UserRepositoryPort } from '../src/user/application/ports/user.repository.port';
import { MotocycleModelRepositoryPort } from '../src/motocycle-model/application/ports/motocycle-model.repository.port';
import { UserMotocycleRepositoryPort } from '../src/user-motocycle/application/ports/user-motocycle.repository.port';

describe('UserMotocycle API (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepositoryPort;
  let motocycleModelRepository: MotocycleModelRepositoryPort;
  let userMotocycleRepository: UserMotocycleRepositoryPort;
  let testUser: User;
  let testMotocycleModel: MotocycleModel;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Get repository instances
    userRepository = moduleFixture.get<UserRepositoryPort>('USER_REPOSITORY');
    motocycleModelRepository = moduleFixture.get<MotocycleModelRepositoryPort>(
      'MOTOCYCLE_MODEL_REPOSITORY',
    );
    userMotocycleRepository = moduleFixture.get<UserMotocycleRepositoryPort>(
      'USER_MOTOCYCLE_REPOSITORY',
    );
  });

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'securePassword123',
    });
    await userRepository.save(testUser);

    // Create test motorcycle model
    testMotocycleModel = MotocycleModel.create({
      manufacturerId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Harley-Davidson Street 750',
      yearStart: 2014,
      yearEnd: 2024,
      displacementCc: 750,
      engineCycle: '4-STROKE',
      engineType: 'V-Twin',
      valvesPerCylinder: 2,
      coolingSystem: 'AIR',
      fuelSystem: 'Fuel Injection',
      sparkPlugDefault: 'NGK D8EA',
      batteryDefault: '12V 19Ah',
      finalDrive: 'Belt',
      gears: 5,
      clutchType: 'Wet Single-Plate',
      engineOilCapacityL: 3.8,
      recommendedOilViscosity: '20W-40',
      recommendedOilSpec: 'Mineral or Synthetic Blend',
      fuelTankCapacityL: 13.5,
      coolantCapacityL: null,
    });
    await motocycleModelRepository.save(testMotocycleModel);

    // Login to get JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.getEmail().getValue(),
        password: 'securePassword123',
      });

    jwtToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /user-motocycles', () => {
    it('should create a user motorcycle successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nickname).toBe('My Harley');
      expect(response.body.currentOdometer).toBe(5000);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/user-motocycles')
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent motorcycle model', async () => {
      const response = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: '00000000-0000-0000-0000-000000000000',
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      expect(response.status).toBe(404);
    });

    it('should validate manufacturing year within model range', async () => {
      const response = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2025, // Outside model range (2014-2024)
          currentOdometer: 5000,
        });

      expect(response.status).toBe(409);
    });

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          // Missing motocycleModelId
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      expect(response.status).toBe(400);
    });

    it('should validate nickname is between 2-100 characters', async () => {
      const tooShortResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'A', // Too short
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      expect(tooShortResponse.status).toBe(400);

      const tooLongResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'a'.repeat(101), // Too long
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      expect(tooLongResponse.status).toBe(400);
    });

    it('should validate odometer is non-negative', async () => {
      const response = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: -100, // Negative odometer
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /user-motocycles/me', () => {
    it('should return user motorcycles for authenticated user', async () => {
      // Create a motorcycle first
      await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      const response = await request(app.getHttpServer())
        .get('/user-motocycles/me')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('nickname');
      expect(response.body[0]).toHaveProperty('currentOdometer');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer()).get(
        '/user-motocycles/me',
      );

      expect(response.status).toBe(401);
    });

    it('should return empty array for user with no motorcycles', async () => {
      const newUser = await User.create({
        name: 'New User',
        email: `newuser_${Date.now()}@example.com`,
        password: 'securePassword123',
      });
      await userRepository.save(newUser);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: newUser.getEmail().getValue(),
          password: 'securePassword123',
        });

      const response = await request(app.getHttpServer())
        .get('/user-motocycles/me')
        .set('Authorization', `Bearer ${loginResponse.body.access_token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /user-motocycles/:id', () => {
    it('should return a specific user motorcycle', async () => {
      // Create a motorcycle first
      const createResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      const motorcycleId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(motorcycleId);
      expect(response.body.nickname).toBe('My Harley');
    });

    it('should return 404 for non-existent motorcycle', async () => {
      const response = await request(app.getHttpServer())
        .get('/user-motocycles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer()).get(
        '/user-motocycles/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /user-motocycles/:id', () => {
    it('should update motorcycle nickname', async () => {
      // Create a motorcycle first
      const createResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      const motorcycleId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          nickname: 'Updated Nickname',
        });

      expect(response.status).toBe(200);
      expect(response.body.nickname).toBe('Updated Nickname');
    });

    it('should update motorcycle odometer', async () => {
      // Create a motorcycle first
      const createResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      const motorcycleId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          currentOdometer: 6000,
        });

      expect(response.status).toBe(200);
      expect(response.body.currentOdometer).toBe(6000);
    });

    it('should update manufacturing year', async () => {
      // Create a motorcycle first
      const createResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      const motorcycleId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          manufacturingYear: 2021,
        });

      expect(response.status).toBe(200);
      expect(response.body.manufacturingYear).toBe(2021);
    });

    it('should update multiple fields at once', async () => {
      // Create a motorcycle first
      const createResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      const motorcycleId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          nickname: 'New Name',
          currentOdometer: 7000,
          manufacturingYear: 2022,
        });

      expect(response.status).toBe(200);
      expect(response.body.nickname).toBe('New Name');
      expect(response.body.currentOdometer).toBe(7000);
      expect(response.body.manufacturingYear).toBe(2022);
    });

    it('should return 404 for non-existent motorcycle', async () => {
      const response = await request(app.getHttpServer())
        .patch('/user-motocycles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          nickname: 'New Name',
        });

      expect(response.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer())
        .patch('/user-motocycles/00000000-0000-0000-0000-000000000000')
        .send({
          nickname: 'New Name',
        });

      expect(response.status).toBe(401);
    });

    it('should reject invalid manufacturing year', async () => {
      // Create a motorcycle first
      const createResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      const motorcycleId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          manufacturingYear: 2025, // Outside model range
        });

      expect(response.status).toBe(400);
    });

    it('should reject decreasing odometer', async () => {
      // Create a motorcycle first
      const createResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      const motorcycleId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          currentOdometer: 4000, // Decrease
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /user-motocycles/:id', () => {
    it('should delete a user motorcycle', async () => {
      // Create a motorcycle first
      const createResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      const motorcycleId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .delete(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(200);

      // Verify it was deleted
      const getResponse = await request(app.getHttpServer())
        .get(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent motorcycle', async () => {
      const response = await request(app.getHttpServer())
        .delete('/user-motocycles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/user-motocycles/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(401);
    });
  });

  describe('Complete CRUD workflow', () => {
    it('should execute full lifecycle: create, read, update, delete', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/user-motocycles')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          motocycleModelId: testMotocycleModel.getId().getValue(),
          nickname: 'My Harley',
          manufacturingYear: 2020,
          currentOdometer: 5000,
        });

      expect(createResponse.status).toBe(201);
      const motorcycleId = createResponse.body.id;

      // Read
      const readResponse = await request(app.getHttpServer())
        .get(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(readResponse.status).toBe(200);
      expect(readResponse.body.nickname).toBe('My Harley');

      // Update
      const updateResponse = await request(app.getHttpServer())
        .patch(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          nickname: 'Updated Harley',
          currentOdometer: 6000,
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.nickname).toBe('Updated Harley');
      expect(updateResponse.body.currentOdometer).toBe(6000);

      // Delete
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(deleteResponse.status).toBe(200);

      // Verify deletion
      const verifyResponse = await request(app.getHttpServer())
        .get(`/user-motocycles/${motorcycleId}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(verifyResponse.status).toBe(404);
    });
  });
});
