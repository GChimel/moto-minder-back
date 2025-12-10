import { Year } from './year.vo';

describe('Year Value Object', () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const minYear = 1900;

  describe('constructor', () => {
    it('should create a valid year', () => {
      const year = new Year(2020);
      expect(year.getValue()).toBe(2020);
    });

    it('should accept current year', () => {
      const year = new Year(currentYear);
      expect(year.getValue()).toBe(currentYear);
    });

    it('should accept next year', () => {
      const year = new Year(nextYear);
      expect(year.getValue()).toBe(nextYear);
    });

    it('should accept minimum valid year (1900)', () => {
      const year = new Year(minYear);
      expect(year.getValue()).toBe(minYear);
    });

    it('should reject year before 1900', () => {
      expect(() => new Year(1899)).toThrow();
      expect(() => new Year(1800)).toThrow();
      expect(() => new Year(1)).toThrow();
    });

    it('should reject year beyond next year', () => {
      expect(() => new Year(nextYear + 1)).toThrow();
      expect(() => new Year(2100)).toThrow();
    });

    it('should reject non-integer values', () => {
      expect(() => new Year(2020.5)).toThrow();
      expect(() => new Year(2020.1)).toThrow();
    });

    it('should only accept integer values', () => {
      const year = new Year(2020);
      expect(Number.isInteger(year.getValue())).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for identical years', () => {
      const year1 = new Year(2020);
      const year2 = new Year(2020);
      expect(year1.equals(year2)).toBe(true);
    });

    it('should return false for different years', () => {
      const year1 = new Year(2020);
      const year2 = new Year(2021);
      expect(year1.equals(year2)).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('should return true when year is after another', () => {
      const year1 = new Year(2021);
      const year2 = new Year(2020);
      expect(year1.isAfter(year2)).toBe(true);
    });

    it('should return false when year is not after another', () => {
      const year1 = new Year(2020);
      const year2 = new Year(2021);
      expect(year1.isAfter(year2)).toBe(false);
    });

    it('should return false when years are equal', () => {
      const year1 = new Year(2020);
      const year2 = new Year(2020);
      expect(year1.isAfter(year2)).toBe(false);
    });
  });

  describe('isBefore', () => {
    it('should return true when year is before another', () => {
      const year1 = new Year(2020);
      const year2 = new Year(2021);
      expect(year1.isBefore(year2)).toBe(true);
    });

    it('should return false when year is not before another', () => {
      const year1 = new Year(2021);
      const year2 = new Year(2020);
      expect(year1.isBefore(year2)).toBe(false);
    });

    it('should return false when years are equal', () => {
      const year1 = new Year(2020);
      const year2 = new Year(2020);
      expect(year1.isBefore(year2)).toBe(false);
    });
  });

  describe('year range validation for motorcycles', () => {
    it('should accept motorcycle years within valid range', () => {

      expect(() => new Year(1950)).not.toThrow();
      expect(() => new Year(2000)).not.toThrow();
      expect(() => new Year(currentYear)).not.toThrow();
    });

    it('should validate year ranges for motorcycle production', () => {
      const year1 = new Year(2000);
      const year2 = new Year(2020);

      expect(year1.isBefore(year2)).toBe(true);
      expect(year2.isAfter(year1)).toBe(true);
    });
  });

  describe('boundary testing', () => {
    it('should handle minimum valid year', () => {
      const minYear = new Year(1900);
      const year2020 = new Year(2020);

      expect(minYear.isBefore(year2020)).toBe(true);
      expect(year2020.isAfter(minYear)).toBe(true);
    });

    it('should handle current and next year', () => {
      const current = new Year(currentYear);
      const next = new Year(nextYear);

      expect(current.isBefore(next)).toBe(true);
      expect(next.isAfter(current)).toBe(true);
    });
  });
});
