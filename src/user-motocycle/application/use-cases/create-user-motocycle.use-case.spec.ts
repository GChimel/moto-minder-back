import { ConflictException } from '@nestjs/common';
import {
  CreateUserMotocycleUseCase,
  CreateUserMotocycleDto,
} from './create-user-motocycle.use-case';
import { UserMotocycleRepositoryPort } from '../ports/user-motocycle.repository.port';
import { UserRepositoryPort } from '../../../user/application/ports/user.repository.port';
import { MotocycleModelRepositoryPort } from '../../../motocycle-model/application/ports/motocycle-model.repository.port';
import { EntityNotFoundException } from '../../../shared/domain/exceptions/entity-not-found.exception';
import { User } from '../../../user/domain/entities/user.entity';
import { MotocycleModel } from '../../../motocycle-model/domain/entities/motocycle-model.entity';
import { UserMotocycle } from '../../domain/entities/user-motocycle.entity';

describe('CreateUserMotocycleUseCase', () => {
  let useCase: CreateUserMotocycleUseCase;
  let userMotocycleRepository: jest.Mocked<UserMotocycleRepositoryPort>;
  let userRepository: jest.Mocked<UserRepositoryPort>;
  let motocycleModelRepository: jest.Mocked<MotocycleModelRepositoryPort>;

  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockMotocycleModelId = '660e8400-e29b-41d4-a716-446655440000';
  const mockManufacturerId = '770e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    // Create mock repositories
    userMotocycleRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    motocycleModelRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByManufacturerId: jest.fn(),
      findByNameAndManufacturer: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    // Create use case with mocked dependencies
    useCase = new CreateUserMotocycleUseCase(
      userMotocycleRepository,
      userRepository,
      motocycleModelRepository,
    );
  });

  describe('execute', () => {
    const validDto: CreateUserMotocycleDto = {
      userId: mockUserId,
      motocycleModelId: mockMotocycleModelId,
      nickname: 'My Harley',
      manufacturingYear: 2020,
      currentOdometer: 5000,
    };

    it('should create a user motorcycle successfully', async () => {
      // Arrange
      const mockUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      });

      const mockMotocycleModel = MotocycleModel.create({
        manufacturerId: mockManufacturerId,
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

      const expectedUserMotocycle = UserMotocycle.create(validDto);

      userRepository.findById.mockResolvedValue(mockUser);
      motocycleModelRepository.findById.mockResolvedValue(mockMotocycleModel);
      userMotocycleRepository.save.mockResolvedValue(expectedUserMotocycle);

      // Act
      const result = await useCase.execute(validDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.getNickname().getValue()).toBe(validDto.nickname);
      expect(result.getCurrentOdometer().getValue()).toBe(
        validDto.currentOdometer,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(motocycleModelRepository.findById).toHaveBeenCalledWith(
        mockMotocycleModelId,
      );
      expect(userMotocycleRepository.save).toHaveBeenCalled();
    });

    it('should throw EntityNotFoundException when user does not exist', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(
        EntityNotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(motocycleModelRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw EntityNotFoundException when motorcycle model does not exist', async () => {
      // Arrange
      const mockUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      });

      userRepository.findById.mockResolvedValue(mockUser);
      motocycleModelRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(validDto)).rejects.toThrow(
        EntityNotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(motocycleModelRepository.findById).toHaveBeenCalledWith(
        mockMotocycleModelId,
      );
    });

    it('should throw ConflictException when manufacturing year is before model year start', async () => {
      // Arrange
      const mockUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      });

      const mockMotocycleModel = MotocycleModel.create({
        manufacturerId: mockManufacturerId,
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

      userRepository.findById.mockResolvedValue(mockUser);
      motocycleModelRepository.findById.mockResolvedValue(mockMotocycleModel);

      // Act & Assert
      await expect(
        useCase.execute({
          ...validDto,
          manufacturingYear: 2013, // Before 2014
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when manufacturing year is after model year end', async () => {
      // Arrange
      const mockUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      });

      const mockMotocycleModel = MotocycleModel.create({
        manufacturerId: mockManufacturerId,
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

      userRepository.findById.mockResolvedValue(mockUser);
      motocycleModelRepository.findById.mockResolvedValue(mockMotocycleModel);

      // Act & Assert
      await expect(
        useCase.execute({
          ...validDto,
          manufacturingYear: 2025, // After 2024
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should accept manufacturing year at model year start boundary', async () => {
      // Arrange
      const mockUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      });

      const mockMotocycleModel = MotocycleModel.create({
        manufacturerId: mockManufacturerId,
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

      const expectedUserMotocycle = UserMotocycle.create({
        ...validDto,
        manufacturingYear: 2014,
      });

      userRepository.findById.mockResolvedValue(mockUser);
      motocycleModelRepository.findById.mockResolvedValue(mockMotocycleModel);
      userMotocycleRepository.save.mockResolvedValue(expectedUserMotocycle);

      // Act
      const result = await useCase.execute({
        ...validDto,
        manufacturingYear: 2014,
      });

      // Assert
      expect(result).toBeDefined();
      expect(result.getManufacturingYear().getValue()).toBe(2014);
    });

    it('should accept manufacturing year at model year end boundary', async () => {
      // Arrange
      const mockUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      });

      const mockMotocycleModel = MotocycleModel.create({
        manufacturerId: mockManufacturerId,
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

      const expectedUserMotocycle = UserMotocycle.create({
        ...validDto,
        manufacturingYear: 2024,
      });

      userRepository.findById.mockResolvedValue(mockUser);
      motocycleModelRepository.findById.mockResolvedValue(mockMotocycleModel);
      userMotocycleRepository.save.mockResolvedValue(expectedUserMotocycle);

      // Act
      const result = await useCase.execute({
        ...validDto,
        manufacturingYear: 2024,
      });

      // Assert
      expect(result).toBeDefined();
      expect(result.getManufacturingYear().getValue()).toBe(2024);
    });

    it('should validate all three dependencies before creating motorcycle', async () => {
      // Arrange
      const mockUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      });

      userRepository.findById.mockResolvedValue(mockUser);
      motocycleModelRepository.findById.mockResolvedValue(null);

      // Act & Assert - Should fail on second validation (model not found)
      await expect(useCase.execute(validDto)).rejects.toThrow(
        EntityNotFoundException,
      );

      // Verify save was never called since validation failed
      expect(userMotocycleRepository.save).not.toHaveBeenCalled();
    });

    it('should handle multiple users creating motorcycles independently', async () => {
      // Arrange
      const user1Id = '550e8400-e29b-41d4-a716-446655440001';
      const user2Id = '550e8400-e29b-41d4-a716-446655440002';

      const mockUser1 = await User.create({
        name: 'User One',
        email: 'user1@example.com',
        password: 'securePassword123',
      });

      const mockUser2 = await User.create({
        name: 'User Two',
        email: 'user2@example.com',
        password: 'securePassword123',
      });

      const mockMotocycleModel = MotocycleModel.create({
        manufacturerId: mockManufacturerId,
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

      userRepository.findById.mockImplementation((id: string) => {
        if (id === user1Id) return Promise.resolve(mockUser1);
        if (id === user2Id) return Promise.resolve(mockUser2);
        return Promise.resolve(null);
      });

      motocycleModelRepository.findById.mockResolvedValue(mockMotocycleModel);

      const moto1 = UserMotocycle.create({
        userId: user1Id,
        motocycleModelId: mockMotocycleModelId,
        nickname: 'User 1 Harley',
        manufacturingYear: 2020,
        currentOdometer: 5000,
      });

      const moto2 = UserMotocycle.create({
        userId: user2Id,
        motocycleModelId: mockMotocycleModelId,
        nickname: 'User 2 Harley',
        manufacturingYear: 2021,
        currentOdometer: 3000,
      });

      userMotocycleRepository.save.mockImplementation((moto: UserMotocycle) =>
        Promise.resolve(moto),
      );

      // Act
      const result1 = await useCase.execute({
        userId: user1Id,
        motocycleModelId: mockMotocycleModelId,
        nickname: 'User 1 Harley',
        manufacturingYear: 2020,
        currentOdometer: 5000,
      });

      const result2 = await useCase.execute({
        userId: user2Id,
        motocycleModelId: mockMotocycleModelId,
        nickname: 'User 2 Harley',
        manufacturingYear: 2021,
        currentOdometer: 3000,
      });

      // Assert
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1.getNickname().getValue()).toBe('User 1 Harley');
      expect(result2.getNickname().getValue()).toBe('User 2 Harley');
    });
  });

  describe('repository interactions', () => {
    it('should call save with the created user motorcycle', async () => {
      // Arrange
      const mockUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      });

      const mockMotocycleModel = MotocycleModel.create({
        manufacturerId: mockManufacturerId,
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

      const validDto: CreateUserMotocycleDto = {
        userId: mockUserId,
        motocycleModelId: mockMotocycleModelId,
        nickname: 'My Harley',
        manufacturingYear: 2020,
        currentOdometer: 5000,
      };

      const expectedUserMotocycle = UserMotocycle.create(validDto);

      userRepository.findById.mockResolvedValue(mockUser);
      motocycleModelRepository.findById.mockResolvedValue(mockMotocycleModel);
      userMotocycleRepository.save.mockResolvedValue(expectedUserMotocycle);

      // Act
      await useCase.execute(validDto);

      // Assert
      expect(userMotocycleRepository.save).toHaveBeenCalledTimes(1);
      expect(userMotocycleRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: expect.any(Object),
          nickname: expect.any(Object),
          manufacturingYear: expect.any(Object),
          currentOdometer: expect.any(Object),
        }),
      );
    });
  });
});
