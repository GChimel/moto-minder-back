import { UserMotocycle } from './user-motocycle.entity';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

describe('UserMotocycle Entity', () => {
  const validInput = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    motocycleModelId: '660e8400-e29b-41d4-a716-446655440001',
    nickname: 'My Harley',
    manufacturingYear: 2020,
    currentOdometer: 5000,
  };

  describe('create', () => {
    it('should create a valid UserMotocycle entity', () => {
      const userMotocycle = UserMotocycle.create(validInput);

      expect(userMotocycle.getId()).toBeDefined();
      expect(userMotocycle.getUserId().getValue()).toBe(validInput.userId);
      expect(userMotocycle.getMotocycleModelId().getValue()).toBe(
        validInput.motocycleModelId,
      );
      expect(userMotocycle.getNickname().getValue()).toBe(validInput.nickname);
      expect(userMotocycle.getManufacturingYear().getValue()).toBe(
        validInput.manufacturingYear,
      );
      expect(userMotocycle.getCurrentOdometer().getValue()).toBe(
        validInput.currentOdometer,
      );
    });

    it('should set creation timestamps', () => {
      const beforeCreation = new Date();
      const userMotocycle = UserMotocycle.create(validInput);
      const afterCreation = new Date();

      expect(userMotocycle.getCreatedAt().getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(userMotocycle.getCreatedAt().getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should have equal created and updated timestamps on creation', () => {
      const userMotocycle = UserMotocycle.create(validInput);

      expect(userMotocycle.getCreatedAt().getTime()).toBe(
        userMotocycle.getUpdatedAt().getTime(),
      );
    });

    it('should reject nickname that is too short', () => {
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          nickname: 'A',
        }),
      ).toThrow();
    });

    it('should reject nickname that is too long', () => {
      const longNickname = 'a'.repeat(101);
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          nickname: longNickname,
        }),
      ).toThrow();
    });

    it('should reject negative odometer', () => {
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          currentOdometer: -1,
        }),
      ).toThrow();
    });

    it('should reject odometer exceeding maximum', () => {
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          currentOdometer: 1000001,
        }),
      ).toThrow();
    });

    it('should reject non-integer odometer', () => {
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          currentOdometer: 5000.5,
        }),
      ).toThrow();
    });

    it('should reject year before 1900', () => {
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          manufacturingYear: 1899,
        }),
      ).toThrow();
    });

    it('should reject year in future', () => {
      const nextYear = new Date().getFullYear() + 2;
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          manufacturingYear: nextYear,
        }),
      ).toThrow();
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a UserMotocycle from database values', () => {
      const id = '770e8400-e29b-41d4-a716-446655440002';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const userMotocycle = UserMotocycle.reconstitute(
        id,
        validInput.userId,
        validInput.motocycleModelId,
        validInput.nickname,
        validInput.manufacturingYear,
        validInput.currentOdometer,
        createdAt,
        updatedAt,
      );

      expect(userMotocycle.getId().getValue()).toBe(id);
      expect(userMotocycle.getUserId().getValue()).toBe(validInput.userId);
      expect(userMotocycle.getMotocycleModelId().getValue()).toBe(
        validInput.motocycleModelId,
      );
      expect(userMotocycle.getNickname().getValue()).toBe(validInput.nickname);
      expect(userMotocycle.getManufacturingYear().getValue()).toBe(
        validInput.manufacturingYear,
      );
      expect(userMotocycle.getCurrentOdometer().getValue()).toBe(
        validInput.currentOdometer,
      );
      expect(userMotocycle.getCreatedAt()).toBe(createdAt);
      expect(userMotocycle.getUpdatedAt()).toBe(updatedAt);
    });

    it('should allow reconstituting with specifications override', () => {
      const overrides = { fuelTankCapacityL: 20 };
      const userMotocycle = UserMotocycle.reconstitute(
        '880e8400-e29b-41d4-a716-446655440003',
        validInput.userId,
        validInput.motocycleModelId,
        validInput.nickname,
        validInput.manufacturingYear,
        validInput.currentOdometer,
        new Date(),
        new Date(),
        overrides,
      );

      expect(userMotocycle.getSpecificationsOverride()).toEqual(overrides);
    });
  });

  describe('updateNickname', () => {
    it('should update nickname successfully', () => {
      const userMotocycle = UserMotocycle.create(validInput);
      const originalUpdatedAt = userMotocycle.getUpdatedAt();

      userMotocycle.updateNickname('New Nickname');

      expect(userMotocycle.getNickname().getValue()).toBe('New Nickname');
      expect(userMotocycle.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should reject invalid nickname during update', () => {
      const userMotocycle = UserMotocycle.create(validInput);

      expect(() => userMotocycle.updateNickname('A')).toThrow();
    });

    it('should trim whitespace from nickname', () => {
      const userMotocycle = UserMotocycle.create(validInput);

      userMotocycle.updateNickname('  Trimmed Nickname  ');

      expect(userMotocycle.getNickname().getValue()).toBe('Trimmed Nickname');
    });
  });

  describe('updateManufacturingYear', () => {
    it('should update manufacturing year successfully', () => {
      const userMotocycle = UserMotocycle.create(validInput);
      const originalUpdatedAt = userMotocycle.getUpdatedAt();

      userMotocycle.updateManufacturingYear(2021);

      expect(userMotocycle.getManufacturingYear().getValue()).toBe(2021);
      expect(userMotocycle.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should reject invalid year during update', () => {
      const userMotocycle = UserMotocycle.create(validInput);

      expect(() => userMotocycle.updateManufacturingYear(1800)).toThrow();
    });
  });

  describe('updateOdometer', () => {
    it('should increase odometer successfully', () => {
      const userMotocycle = UserMotocycle.create(validInput);
      const originalUpdatedAt = userMotocycle.getUpdatedAt();

      userMotocycle.updateOdometer(6000);

      expect(userMotocycle.getCurrentOdometer().getValue()).toBe(6000);
      expect(userMotocycle.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should reject decreasing odometer', () => {
      const userMotocycle = UserMotocycle.create({
        ...validInput,
        currentOdometer: 5000,
      });

      expect(() => userMotocycle.updateOdometer(4999)).toThrow(
        InvalidArgumentException,
      );
    });

    it('should allow odometer to stay the same', () => {
      const userMotocycle = UserMotocycle.create({
        ...validInput,
        currentOdometer: 5000,
      });

      expect(() => userMotocycle.updateOdometer(5000)).not.toThrow();
      expect(userMotocycle.getCurrentOdometer().getValue()).toBe(5000);
    });

    it('should reject invalid odometer value', () => {
      const userMotocycle = UserMotocycle.create(validInput);

      expect(() => userMotocycle.updateOdometer(-100)).toThrow();
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', () => {
      const userMotocycle = UserMotocycle.create(validInput);

      expect(userMotocycle.getId()).toBeDefined();
      expect(userMotocycle.getUserId()).toBeDefined();
      expect(userMotocycle.getMotocycleModelId()).toBeDefined();
      expect(userMotocycle.getNickname()).toBeDefined();
      expect(userMotocycle.getManufacturingYear()).toBeDefined();
      expect(userMotocycle.getCurrentOdometer()).toBeDefined();
      expect(userMotocycle.getCreatedAt()).toBeDefined();
      expect(userMotocycle.getUpdatedAt()).toBeDefined();
      expect(userMotocycle.getSpecificationsOverride()).toBeNull();
    });
  });

  describe('value object integration', () => {
    it('should validate nickname via Nickname VO', () => {
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          nickname: '',
        }),
      ).toThrow();
    });

    it('should validate odometer via Odometer VO', () => {
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          currentOdometer: 1000001,
        }),
      ).toThrow();
    });

    it('should validate year via Year VO', () => {
      expect(() =>
        UserMotocycle.create({
          ...validInput,
          manufacturingYear: 2050,
        }),
      ).toThrow();
    });
  });
});
