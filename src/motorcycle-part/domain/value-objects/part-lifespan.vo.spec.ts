import { PartLifespan } from './part-lifespan.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

describe('PartLifespan Value Object', () => {
  describe('constructor', () => {
    it('should create PartLifespan with kilometers only', () => {
      const lifespan = new PartLifespan({ lifespanKm: 15000 });

      expect(lifespan.getLifespanKm()).toBe(15000);
      expect(lifespan.getLifespanMonths()).toBeUndefined();
    });

    it('should create PartLifespan with months only', () => {
      const lifespan = new PartLifespan({ lifespanMonths: 24 });

      expect(lifespan.getLifespanKm()).toBeUndefined();
      expect(lifespan.getLifespanMonths()).toBe(24);
    });

    it('should create PartLifespan with both kilometers and months', () => {
      const lifespan = new PartLifespan({
        lifespanKm: 15000,
        lifespanMonths: 24,
      });

      expect(lifespan.getLifespanKm()).toBe(15000);
      expect(lifespan.getLifespanMonths()).toBe(24);
    });

    it('should throw error when both values are undefined', () => {
      expect(() => new PartLifespan({})).toThrow(InvalidArgumentException);
    });

    it('should throw error when kilometers is below minimum', () => {
      expect(() => new PartLifespan({ lifespanKm: 0 })).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw error when kilometers exceeds maximum', () => {
      expect(() => new PartLifespan({ lifespanKm: 1000001 })).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw error when kilometers is not an integer', () => {
      expect(() => new PartLifespan({ lifespanKm: 15000.5 })).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw error when months is below minimum', () => {
      expect(() => new PartLifespan({ lifespanMonths: 0 })).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw error when months exceeds maximum', () => {
      expect(() => new PartLifespan({ lifespanMonths: 121 })).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw error when months is not an integer', () => {
      expect(() => new PartLifespan({ lifespanMonths: 24.5 })).toThrow(
        InvalidArgumentException,
      );
    });
  });

  describe('getValue', () => {
    it('should return object with both values', () => {
      const lifespan = new PartLifespan({
        lifespanKm: 15000,
        lifespanMonths: 24,
      });
      const value = lifespan.getValue();

      expect(value.lifespanKm).toBe(15000);
      expect(value.lifespanMonths).toBe(24);
    });

    it('should return object with undefined values where not set', () => {
      const lifespan = new PartLifespan({ lifespanKm: 15000 });
      const value = lifespan.getValue();

      expect(value.lifespanKm).toBe(15000);
      expect(value.lifespanMonths).toBeUndefined();
    });
  });

  describe('equals', () => {
    it('should return true for equal PartLifespans', () => {
      const lifespan1 = new PartLifespan({
        lifespanKm: 15000,
        lifespanMonths: 24,
      });
      const lifespan2 = new PartLifespan({
        lifespanKm: 15000,
        lifespanMonths: 24,
      });

      expect(lifespan1.equals(lifespan2)).toBe(true);
    });

    it('should return false for different kilometers', () => {
      const lifespan1 = new PartLifespan({ lifespanKm: 15000 });
      const lifespan2 = new PartLifespan({ lifespanKm: 20000 });

      expect(lifespan1.equals(lifespan2)).toBe(false);
    });

    it('should return false for different months', () => {
      const lifespan1 = new PartLifespan({ lifespanMonths: 24 });
      const lifespan2 = new PartLifespan({ lifespanMonths: 36 });

      expect(lifespan1.equals(lifespan2)).toBe(false);
    });

    it('should return false when only one has months defined', () => {
      const lifespan1 = new PartLifespan({
        lifespanKm: 15000,
        lifespanMonths: 24,
      });
      const lifespan2 = new PartLifespan({ lifespanKm: 15000 });

      expect(lifespan1.equals(lifespan2)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should accept minimum valid kilometers', () => {
      const lifespan = new PartLifespan({ lifespanKm: 1 });

      expect(lifespan.getLifespanKm()).toBe(1);
    });

    it('should accept maximum valid kilometers', () => {
      const lifespan = new PartLifespan({ lifespanKm: 1000000 });

      expect(lifespan.getLifespanKm()).toBe(1000000);
    });

    it('should accept minimum valid months', () => {
      const lifespan = new PartLifespan({ lifespanMonths: 1 });

      expect(lifespan.getLifespanMonths()).toBe(1);
    });

    it('should accept maximum valid months', () => {
      const lifespan = new PartLifespan({ lifespanMonths: 120 });

      expect(lifespan.getLifespanMonths()).toBe(120);
    });
  });
});
