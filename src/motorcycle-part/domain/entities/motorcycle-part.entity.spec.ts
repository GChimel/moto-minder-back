import { MotorcyclePart } from './motorcycle-part.entity';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';
import { PartType } from '../enums/part-type.enum';
import { PartCategory } from '../enums/part-category.enum';
import { PartLifespan } from '../value-objects/part-lifespan.vo';

describe('MotorcyclePart Entity', () => {
  const validInput = {
    userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
    partType: PartType.REAR_TIRE,
    partCategory: PartCategory.TIRES,
    name: 'Michelin Pilot Street',
    manufacturer: 'Michelin',
    model: 'Pilot Street',
    installationDate: new Date('2024-01-15'),
    installationOdometer: 5000,
    expectedLifespanKm: 15000,
    expectedLifespanMonths: 24,
    wearRatePerKm: 0.00005,
    replacementThreshold: 70,
    notes: 'Original equipment',
  };

  describe('create', () => {
    it('should create a valid MotorcyclePart entity', () => {
      const part = MotorcyclePart.create(validInput);

      expect(part.getId()).toBeDefined();
      expect(part.getUserMotocycleId().getValue()).toBe(
        validInput.userMotocycleId,
      );
      expect(part.getPartType()).toBe(PartType.REAR_TIRE);
      expect(part.getPartCategory()).toBe(PartCategory.TIRES);
      expect(part.getName()).toBe(validInput.name);
      expect(part.getManufacturer()).toBe(validInput.manufacturer);
      expect(part.getModel()).toBe(validInput.model);
      expect(part.getInstallationOdometer().getValue()).toBe(5000);
      expect(part.getReplacementThreshold()).toBe(70);
      expect(part.getIsActive()).toBe(true);
    });

    it('should set creation timestamps', () => {
      const beforeCreation = new Date();
      const part = MotorcyclePart.create(validInput);
      const afterCreation = new Date();

      expect(part.getCreatedAt().getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(part.getCreatedAt().getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should have equal created and updated timestamps on creation', () => {
      const part = MotorcyclePart.create(validInput);

      expect(part.getCreatedAt().getTime()).toBe(part.getUpdatedAt().getTime());
    });

    it('should use default replacement threshold when not provided', () => {
      const inputWithoutThreshold = {
        ...validInput,
        replacementThreshold: undefined,
      };
      const part = MotorcyclePart.create(inputWithoutThreshold);

      expect(part.getReplacementThreshold()).toBe(70);
    });

    it('should handle optional fields correctly', () => {
      const minimalInput = {
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.ENGINE_OIL,
        partCategory: PartCategory.ENGINE,
        name: 'Shell Helix',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 0,
        expectedLifespanKm: 5000,
      };
      const part = MotorcyclePart.create(minimalInput);

      expect(part.getManufacturer()).toBeUndefined();
      expect(part.getModel()).toBeUndefined();
      expect(part.getNotes()).toBeUndefined();
      expect(part.getWearRatePerKm()).toBeUndefined();
    });

    it('should throw error when part name is empty', () => {
      const invalidInput = { ...validInput, name: '' };

      expect(() => MotorcyclePart.create(invalidInput)).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw error when part name exceeds max length', () => {
      const longName = 'a'.repeat(201);
      const invalidInput = { ...validInput, name: longName };

      expect(() => MotorcyclePart.create(invalidInput)).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw error when replacement threshold is negative', () => {
      const invalidInput = { ...validInput, replacementThreshold: -1 };

      expect(() => MotorcyclePart.create(invalidInput)).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw error when replacement threshold exceeds 100', () => {
      const invalidInput = { ...validInput, replacementThreshold: 101 };

      expect(() => MotorcyclePart.create(invalidInput)).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw error when installation date is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const invalidInput = { ...validInput, installationDate: futureDate };

      expect(() => MotorcyclePart.create(invalidInput)).toThrow(
        InvalidArgumentException,
      );
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a MotorcyclePart from database data', () => {
      const id = '770e8400-e29b-41d4-a716-446655440002';
      const now = new Date();
      const part = MotorcyclePart.reconstitute(
        id,
        validInput.userMotocycleId,
        PartType.FRONT_TIRE,
        PartCategory.TIRES,
        'Bridgestone Battlax',
        'Bridgestone',
        'Battlax',
        validInput.installationDate,
        validInput.installationOdometer,
        15000,
        24,
        0.00005,
        70,
        'Original tire',
        true,
        now,
        now,
      );

      expect(part.getId().getValue()).toBe(id);
      expect(part.getUserMotocycleId().getValue()).toBe(
        validInput.userMotocycleId,
      );
      expect(part.getPartType()).toBe(PartType.FRONT_TIRE);
      expect(part.getIsActive()).toBe(true);
    });
  });

  describe('markAsReplaced', () => {
    it('should mark part as inactive', () => {
      const part = MotorcyclePart.create(validInput);
      const beforeUpdate = part.getUpdatedAt();

      part.markAsReplaced();

      expect(part.getIsActive()).toBe(false);
      expect(part.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });
  });

  describe('updateNotes', () => {
    it('should update part notes', () => {
      const part = MotorcyclePart.create(validInput);
      const newNotes = 'Recently replaced due to wear';

      part.updateNotes(newNotes);

      expect(part.getNotes()).toBe(newNotes);
    });

    it('should update part notes to undefined', () => {
      const partWithNotes = MotorcyclePart.create(validInput);

      partWithNotes.updateNotes(undefined);

      expect(partWithNotes.getNotes()).toBeUndefined();
    });
  });

  describe('updateExpectedLifespan', () => {
    it('should update expected lifespan', () => {
      const part = MotorcyclePart.create(validInput);
      const newLifespan = new PartLifespan({ lifespanKm: 20000 });

      part.updateExpectedLifespan(newLifespan);

      expect(part.getExpectedLifespanKm()?.getLifespanKm()).toBe(20000);
    });
  });

  describe('getters', () => {
    it('should return all entity properties correctly', () => {
      const part = MotorcyclePart.create(validInput);

      expect(part.getId()).toBeDefined();
      expect(part.getUserMotocycleId()).toBeDefined();
      expect(part.getPartType()).toBe(PartType.REAR_TIRE);
      expect(part.getPartCategory()).toBe(PartCategory.TIRES);
      expect(part.getName()).toBe(validInput.name);
      expect(part.getManufacturer()).toBe(validInput.manufacturer);
      expect(part.getModel()).toBe(validInput.model);
      expect(part.getInstallationDate()).toBe(validInput.installationDate);
      expect(part.getInstallationOdometer()).toBeDefined();
      expect(part.getExpectedLifespanKm()).toBeDefined();
      expect(part.getWearRatePerKm()).toBeDefined();
      expect(part.getReplacementThreshold()).toBe(70);
      expect(part.getNotes()).toBe(validInput.notes);
      expect(part.getIsActive()).toBe(true);
      expect(part.getCreatedAt()).toBeDefined();
      expect(part.getUpdatedAt()).toBeDefined();
    });
  });
});
