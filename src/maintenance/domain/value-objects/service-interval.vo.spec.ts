import { ServiceInterval } from './service-interval.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

describe('ServiceInterval Value Object', () => {
  describe('Constructor', () => {
    it('should create a service interval with only km', () => {
      const interval = new ServiceInterval({ intervalKm: 5000 });
      expect(interval.getIntervalKm()).toBe(5000);
      expect(interval.getIntervalMonths()).toBeUndefined();
    });

    it('should create a service interval with only months', () => {
      const interval = new ServiceInterval({ intervalMonths: 6 });
      expect(interval.getIntervalKm()).toBeUndefined();
      expect(interval.getIntervalMonths()).toBe(6);
    });

    it('should create a service interval with both km and months', () => {
      const interval = new ServiceInterval({
        intervalKm: 10000,
        intervalMonths: 12,
      });
      expect(interval.getIntervalKm()).toBe(10000);
      expect(interval.getIntervalMonths()).toBe(12);
    });

    it('should throw if neither km nor months is provided', () => {
      expect(() => new ServiceInterval({})).toThrow(InvalidArgumentException);
    });

    it('should throw if intervalKm is zero', () => {
      expect(() => new ServiceInterval({ intervalKm: 0 })).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw if intervalKm is negative', () => {
      expect(() => new ServiceInterval({ intervalKm: -100 })).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw if intervalMonths is zero', () => {
      expect(() => new ServiceInterval({ intervalMonths: 0 })).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw if intervalMonths is negative', () => {
      expect(() => new ServiceInterval({ intervalMonths: -1 })).toThrow(
        InvalidArgumentException,
      );
    });
  });

  describe('calculateNextServiceDueOdometer', () => {
    it('should calculate next service odometer based on interval', () => {
      const interval = new ServiceInterval({ intervalKm: 5000 });
      const nextDue = interval.calculateNextServiceDueOdometer(10000);
      expect(nextDue).toBe(15000);
    });

    it('should return undefined if no interval km is set', () => {
      const interval = new ServiceInterval({ intervalMonths: 6 });
      const nextDue = interval.calculateNextServiceDueOdometer(10000);
      expect(nextDue).toBeUndefined();
    });

    it('should handle large odometer values', () => {
      const interval = new ServiceInterval({ intervalKm: 1000 });
      const nextDue = interval.calculateNextServiceDueOdometer(999000);
      expect(nextDue).toBe(1000000);
    });

    it('should work with odometer at zero', () => {
      const interval = new ServiceInterval({ intervalKm: 5000 });
      const nextDue = interval.calculateNextServiceDueOdometer(0);
      expect(nextDue).toBe(5000);
    });
  });

  describe('calculateNextServiceDueDate', () => {
    it('should calculate next service date based on interval', () => {
      const interval = new ServiceInterval({ intervalMonths: 6 });
      const now = new Date();
      const nextDue = interval.calculateNextServiceDueDate();

      expect(nextDue).toBeDefined();
      if (nextDue) {
        const expectedDate = new Date();
        expectedDate.setMonth(expectedDate.getMonth() + 6);

        expect(nextDue.getMonth()).toBe(expectedDate.getMonth());
        expect(nextDue.getFullYear()).toBe(expectedDate.getFullYear());
      }
    });

    it('should return undefined if no interval months is set', () => {
      const interval = new ServiceInterval({ intervalKm: 5000 });
      const nextDue = interval.calculateNextServiceDueDate();
      expect(nextDue).toBeUndefined();
    });

    it('should handle month rollover to next year', () => {
      const interval = new ServiceInterval({ intervalMonths: 6 });
      const now = new Date(2024, 10, 15);

      jest.useFakeTimers();
      jest.setSystemTime(now);

      const nextDue = interval.calculateNextServiceDueDate();
      expect(nextDue?.getFullYear()).toBe(2025);
      expect(nextDue?.getMonth()).toBe(4);

      jest.useRealTimers();
    });

    it('should handle 12-month interval', () => {
      const interval = new ServiceInterval({ intervalMonths: 12 });
      const now = new Date(2024, 3, 10);

      jest.useFakeTimers();
      jest.setSystemTime(now);

      const nextDue = interval.calculateNextServiceDueDate();
      expect(nextDue?.getFullYear()).toBe(2025);
      expect(nextDue?.getMonth()).toBe(3);

      jest.useRealTimers();
    });

    it('should handle 1-month interval', () => {
      const interval = new ServiceInterval({ intervalMonths: 1 });
      const now = new Date(2024, 0, 15);

      jest.useFakeTimers();
      jest.setSystemTime(now);

      const nextDue = interval.calculateNextServiceDueDate();
      expect(nextDue?.getMonth()).toBe(1);
      expect(nextDue?.getFullYear()).toBe(2024);

      jest.useRealTimers();
    });
  });

  describe('equals', () => {
    it('should return true for intervals with same values', () => {
      const interval1 = new ServiceInterval({
        intervalKm: 5000,
        intervalMonths: 6,
      });
      const interval2 = new ServiceInterval({
        intervalKm: 5000,
        intervalMonths: 6,
      });
      expect(interval1.equals(interval2)).toBe(true);
    });

    it('should return false for intervals with different km', () => {
      const interval1 = new ServiceInterval({ intervalKm: 5000 });
      const interval2 = new ServiceInterval({ intervalKm: 10000 });
      expect(interval1.equals(interval2)).toBe(false);
    });

    it('should return false for intervals with different months', () => {
      const interval1 = new ServiceInterval({ intervalMonths: 6 });
      const interval2 = new ServiceInterval({ intervalMonths: 12 });
      expect(interval1.equals(interval2)).toBe(false);
    });

    it('should return false for intervals with different combination of values', () => {
      const interval1 = new ServiceInterval({
        intervalKm: 5000,
        intervalMonths: 6,
      });
      const interval2 = new ServiceInterval({
        intervalKm: 5000,
        intervalMonths: 12,
      });
      expect(interval1.equals(interval2)).toBe(false);
    });

    it('should handle undefined values correctly', () => {
      const interval1 = new ServiceInterval({ intervalKm: 5000 });
      const interval2 = new ServiceInterval({ intervalMonths: 6 });
      expect(interval1.equals(interval2)).toBe(false);
    });
  });
});
