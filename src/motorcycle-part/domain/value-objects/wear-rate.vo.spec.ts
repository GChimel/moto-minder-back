import { WearRate } from './wear-rate.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

describe('WearRate Value Object', () => {
  describe('constructor', () => {
    it('should create WearRate with valid value', () => {
      const wearRate = new WearRate(0.00005);

      expect(wearRate.getValue()).toBe(0.00005);
    });

    it('should create WearRate with minimum valid value', () => {
      const wearRate = new WearRate(0.00001);

      expect(wearRate.getValue()).toBe(0.00001);
    });

    it('should create WearRate with maximum valid value', () => {
      const wearRate = new WearRate(1);

      expect(wearRate.getValue()).toBe(1);
    });

    it('should throw error when wear rate is below minimum', () => {
      expect(() => new WearRate(0.000009)).toThrow(InvalidArgumentException);
    });

    it('should throw error when wear rate exceeds maximum', () => {
      expect(() => new WearRate(1.1)).toThrow(InvalidArgumentException);
    });

    it('should throw error when wear rate is zero', () => {
      expect(() => new WearRate(0)).toThrow(InvalidArgumentException);
    });

    it('should throw error when wear rate is negative', () => {
      expect(() => new WearRate(-0.00005)).toThrow(InvalidArgumentException);
    });
  });

  describe('getValue', () => {
    it('should return the wear rate value', () => {
      const wearRate = new WearRate(0.0001);

      expect(wearRate.getValue()).toBe(0.0001);
    });
  });

  describe('equals', () => {
    it('should return true for equal wear rates', () => {
      const wearRate1 = new WearRate(0.00005);
      const wearRate2 = new WearRate(0.00005);

      expect(wearRate1.equals(wearRate2)).toBe(true);
    });

    it('should return false for different wear rates', () => {
      const wearRate1 = new WearRate(0.00005);
      const wearRate2 = new WearRate(0.0001);

      expect(wearRate1.equals(wearRate2)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle very small wear rates', () => {
      const wearRate = new WearRate(0.00001);

      expect(wearRate.getValue()).toBe(0.00001);
    });

    it('should handle large wear rates close to 1', () => {
      const wearRate = new WearRate(0.999999);

      expect(wearRate.getValue()).toBeCloseTo(0.999999, 6);
    });

    it('should handle percentage wear rates', () => {
      const wearRate = new WearRate(0.01);

      expect(wearRate.getValue()).toBe(0.01);
    });
  });
});
