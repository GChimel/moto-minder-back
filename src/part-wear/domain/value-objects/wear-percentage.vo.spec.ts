import { WearPercentage } from './wear-percentage.vo';

describe('WearPercentage Value Object', () => {
  describe('create', () => {
    it('should create a wear percentage with valid value', () => {
      const wear = WearPercentage.create(50);
      expect(wear.getValue()).toBe(50);
    });

    it('should create with minimum value (0)', () => {
      const wear = WearPercentage.create(0);
      expect(wear.getValue()).toBe(0);
    });

    it('should create with maximum value (100)', () => {
      const wear = WearPercentage.create(100);
      expect(wear.getValue()).toBe(100);
    });

    it('should create with decimal values', () => {
      const wear = WearPercentage.create(50.5);
      expect(wear.getValue()).toBe(50.5);
    });

    it('should throw error for negative values', () => {
      expect(() => WearPercentage.create(-1)).toThrow(
        'Wear percentage must be between 0 and 100',
      );
    });

    it('should throw error for values above 100', () => {
      expect(() => WearPercentage.create(101)).toThrow(
        'Wear percentage must be between 0 and 100',
      );
    });

    it('should throw error for infinity', () => {
      expect(() => WearPercentage.create(Infinity)).toThrow(
        'Wear percentage must be a finite number',
      );
    });

    it('should throw error for NaN', () => {
      expect(() => WearPercentage.create(NaN)).toThrow(
        'Wear percentage must be a finite number',
      );
    });
  });

  describe('factory methods', () => {
    it('should create zero wear percentage', () => {
      const wear = WearPercentage.zero();
      expect(wear.getValue()).toBe(0);
    });

    it('should create full wear percentage', () => {
      const wear = WearPercentage.full();
      expect(wear.getValue()).toBe(100);
    });
  });

  describe('isAboveThreshold', () => {
    it('should return true when wear is above threshold', () => {
      const wear = WearPercentage.create(75);
      expect(wear.isAboveThreshold(70)).toBe(true);
    });

    it('should return true when wear equals threshold', () => {
      const wear = WearPercentage.create(70);
      expect(wear.isAboveThreshold(70)).toBe(true);
    });

    it('should return false when wear is below threshold', () => {
      const wear = WearPercentage.create(65);
      expect(wear.isAboveThreshold(70)).toBe(false);
    });

    it('should return false for zero wear with non-zero threshold', () => {
      const wear = WearPercentage.create(0);
      expect(wear.isAboveThreshold(1)).toBe(false);
    });
  });

  describe('isMaintenanceDue', () => {
    it('should use 70% as default threshold', () => {
      const wear = WearPercentage.create(70);
      expect(wear.isMaintenanceDue()).toBe(true);
    });

    it('should use custom threshold when provided', () => {
      const wear = WearPercentage.create(80);
      expect(wear.isMaintenanceDue(75)).toBe(true);
      expect(wear.isMaintenanceDue(85)).toBe(false);
    });

    it('should return false for wear below default threshold', () => {
      const wear = WearPercentage.create(65);
      expect(wear.isMaintenanceDue()).toBe(false);
    });

    it('should return true for full wear', () => {
      const wear = WearPercentage.create(100);
      expect(wear.isMaintenanceDue()).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for equal wear percentages', () => {
      const wear1 = WearPercentage.create(50);
      const wear2 = WearPercentage.create(50);
      expect(wear1.equals(wear2)).toBe(true);
    });

    it('should return false for different wear percentages', () => {
      const wear1 = WearPercentage.create(50);
      const wear2 = WearPercentage.create(51);
      expect(wear1.equals(wear2)).toBe(false);
    });

    it('should return true for equal decimal values', () => {
      const wear1 = WearPercentage.create(50.5);
      const wear2 = WearPercentage.create(50.5);
      expect(wear1.equals(wear2)).toBe(true);
    });

    it('should return false for slightly different decimal values', () => {
      const wear1 = WearPercentage.create(50.5);
      const wear2 = WearPercentage.create(50.50001);
      expect(wear1.equals(wear2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should format as percentage string', () => {
      const wear = WearPercentage.create(50);
      expect(wear.toString()).toBe('50.00%');
    });

    it('should format decimal values correctly', () => {
      const wear = WearPercentage.create(50.5);
      expect(wear.toString()).toBe('50.50%');
    });

    it('should format zero correctly', () => {
      const wear = WearPercentage.zero();
      expect(wear.toString()).toBe('0.00%');
    });

    it('should format full wear correctly', () => {
      const wear = WearPercentage.full();
      expect(wear.toString()).toBe('100.00%');
    });
  });
});
