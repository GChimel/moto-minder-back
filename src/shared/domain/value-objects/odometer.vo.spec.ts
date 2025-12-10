import { Odometer } from './odometer.vo';

describe('Odometer Value Object', () => {
  describe('constructor', () => {
    it('should create a valid odometer', () => {
      const odometer = new Odometer(5000);
      expect(odometer.getValue()).toBe(5000);
    });

    it('should accept zero kilometers', () => {
      const odometer = new Odometer(0);
      expect(odometer.getValue()).toBe(0);
    });

    it('should accept maximum valid value (1 million km)', () => {
      const odometer = new Odometer(1000000);
      expect(odometer.getValue()).toBe(1000000);
    });

    it('should reject negative kilometers', () => {
      expect(() => new Odometer(-1)).toThrow();
      expect(() => new Odometer(-100)).toThrow();
    });

    it('should reject value exceeding 1 million km', () => {
      expect(() => new Odometer(1000001)).toThrow();
      expect(() => new Odometer(2000000)).toThrow();
    });

    it('should reject non-integer values', () => {
      expect(() => new Odometer(5000.5)).toThrow();
      expect(() => new Odometer(100.1)).toThrow();
    });

    it('should accept integer values only', () => {
      const odometer = new Odometer(5000);
      expect(Number.isInteger(odometer.getValue())).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for identical odometer values', () => {
      const odometer1 = new Odometer(5000);
      const odometer2 = new Odometer(5000);
      expect(odometer1.equals(odometer2)).toBe(true);
    });

    it('should return false for different odometer values', () => {
      const odometer1 = new Odometer(5000);
      const odometer2 = new Odometer(6000);
      expect(odometer1.equals(odometer2)).toBe(false);
    });

    it('should return true for zero values', () => {
      const odometer1 = new Odometer(0);
      const odometer2 = new Odometer(0);
      expect(odometer1.equals(odometer2)).toBe(true);
    });
  });

  describe('isGreaterThan', () => {
    it('should return true when odometer is greater', () => {
      const odometer1 = new Odometer(6000);
      const odometer2 = new Odometer(5000);
      expect(odometer1.isGreaterThan(odometer2)).toBe(true);
    });

    it('should return false when odometer is not greater', () => {
      const odometer1 = new Odometer(5000);
      const odometer2 = new Odometer(6000);
      expect(odometer1.isGreaterThan(odometer2)).toBe(false);
    });

    it('should return false when odometer is equal', () => {
      const odometer1 = new Odometer(5000);
      const odometer2 = new Odometer(5000);
      expect(odometer1.isGreaterThan(odometer2)).toBe(false);
    });
  });

  describe('isLessThan', () => {
    it('should return true when odometer is less', () => {
      const odometer1 = new Odometer(4000);
      const odometer2 = new Odometer(5000);
      expect(odometer1.isLessThan(odometer2)).toBe(true);
    });

    it('should return false when odometer is not less', () => {
      const odometer1 = new Odometer(6000);
      const odometer2 = new Odometer(5000);
      expect(odometer1.isLessThan(odometer2)).toBe(false);
    });

    it('should return false when odometer is equal', () => {
      const odometer1 = new Odometer(5000);
      const odometer2 = new Odometer(5000);
      expect(odometer1.isLessThan(odometer2)).toBe(false);
    });

    it('should prevent odometer from decreasing', () => {
      const currentOdometer = new Odometer(5000);
      const newOdometer = new Odometer(4999);

      expect(newOdometer.isLessThan(currentOdometer)).toBe(true);
    });
  });

  describe('boundary testing', () => {
    it('should handle zero to maximum range', () => {
      const minOdometer = new Odometer(0);
      const maxOdometer = new Odometer(1000000);

      expect(minOdometer.isLessThan(maxOdometer)).toBe(true);
      expect(maxOdometer.isGreaterThan(minOdometer)).toBe(true);
    });

    it('should work correctly for typical usage', () => {
      const odometer1 = new Odometer(45000);
      const odometer2 = new Odometer(46000);

      expect(odometer2.isGreaterThan(odometer1)).toBe(true);
      expect(odometer1.isLessThan(odometer2)).toBe(true);
    });
  });
});
