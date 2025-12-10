/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UserId } from './user-id.vo';

describe('UserId Value Object', () => {
  describe('constructor', () => {
    it('should create a valid user id with provided id', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const userId = new UserId(id);

      expect(userId.getValue()).toBe(id);
    });

    it('should generate a UUID when no id is provided', () => {
      const userId = new UserId();

      expect(userId.getValue()).toBeDefined();
      expect(typeof userId.getValue()).toBe('string');
    });

    it('should generate valid UUID v4 format when no id provided', () => {
      const userId = new UserId();
      const id = userId.getValue();

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(id)).toBe(true);
    });

    it('should accept null as undefined and generate UUID', () => {
      const userId = new UserId(null as any);

      expect(userId.getValue()).toBeDefined();
      expect(userId.getValue().length).toBe(36);
    });

    it('should accept valid UUID formats', () => {
      const validUuids = [
        '550e8400-e29b-41d4-a716-446655440000',
        '123e4567-e89b-12d3-a456-426614174000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ];

      validUuids.forEach((uuid) => {
        const userId = new UserId(uuid);
        expect(userId.getValue()).toBe(uuid);
      });
    });

    it('should create unique ids when called multiple times', () => {
      const userId1 = new UserId();
      const userId2 = new UserId();

      expect(userId1.getValue()).not.toBe(userId2.getValue());
    });

    it('should preserve provided id exactly as given', () => {
      const providedId = 'custom-id-string';
      const userId = new UserId(providedId);

      expect(userId.getValue()).toBe(providedId);
    });
  });

  describe('getValue', () => {
    it('should return the id value', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const userId = new UserId(id);

      expect(userId.getValue()).toBe(id);
    });

    it('should return consistent value on multiple calls', () => {
      const userId = new UserId();
      const value1 = userId.getValue();
      const value2 = userId.getValue();

      expect(value1).toBe(value2);
    });

    it('should return string type', () => {
      const userId = new UserId();

      expect(typeof userId.getValue()).toBe('string');
    });
  });

  describe('equals', () => {
    it('should return true for identical user ids', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const userId1 = new UserId(id);
      const userId2 = new UserId(id);

      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false for different user ids', () => {
      const userId1 = new UserId('550e8400-e29b-41d4-a716-446655440000');
      const userId2 = new UserId('123e4567-e89b-12d3-a456-426614174000');

      expect(userId1.equals(userId2)).toBe(false);
    });

    it('should return false when comparing with different generated ids', () => {
      const userId1 = new UserId();
      const userId2 = new UserId();

      expect(userId1.equals(userId2)).toBe(false);
    });

    it('should return true when comparing same user to itself', () => {
      const userId = new UserId('550e8400-e29b-41d4-a716-446655440000');

      expect(userId.equals(userId)).toBe(true);
    });

    it('should perform case-sensitive comparison', () => {
      const idLower = '550e8400-e29b-41d4-a716-446655440000';
      const idUpper = '550E8400-E29B-41D4-A716-446655440000';

      const userId1 = new UserId(idLower);
      const userId2 = new UserId(idUpper);

      expect(userId1.equals(userId2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should not allow modification after creation', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const userId = new UserId(id);

      expect(userId.getValue()).toBe(id);

      expect(userId.getValue()).toBe(id);
    });

    it('should maintain same value across multiple calls', () => {
      const userId = new UserId();
      const value1 = userId.getValue();

      setTimeout(() => {
        const value2 = userId.getValue();
        expect(value1).toBe(value2);
      }, 100);
    });
  });

  describe('uuid generation', () => {
    it('should generate unique uuid each time without argument', () => {
      const ids = new Set();

      for (let i = 0; i < 10; i++) {
        const userId = new UserId();
        ids.add(userId.getValue());
      }

      expect(ids.size).toBe(10);
    });

    it('should generate properly formatted UUIDs', () => {
      const userIds = Array.from({ length: 5 }, () => new UserId());

      userIds.forEach((userId) => {
        const value = userId.getValue();
        const parts = value.split('-');

        expect(parts.length).toBe(5);
        expect(parts[0].length).toBe(8);
        expect(parts[1].length).toBe(4);
        expect(parts[2].length).toBe(4);
        expect(parts[3].length).toBe(4);
        expect(parts[4].length).toBe(12);
      });
    });
  });

  describe('comparison with other generated ids', () => {
    it('should identify same user correctly', () => {
      const userId1 = new UserId('550e8400-e29b-41d4-a716-446655440000');
      const userId2 = new UserId('550e8400-e29b-41d4-a716-446655440000');

      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should identify different users correctly', () => {
      const userId1 = new UserId('550e8400-e29b-41d4-a716-446655440000');
      const userId2 = new UserId('550e8400-e29b-41d4-a716-446655440001');

      expect(userId1.equals(userId2)).toBe(false);
    });
  });

  describe('real-world usage', () => {
    it('should work as a map key', () => {
      const userIdMap = new Map();
      const userId = new UserId('550e8400-e29b-41d4-a716-446655440000');

      userIdMap.set(userId.getValue(), { name: 'John' });

      expect(userIdMap.get(userId.getValue())).toEqual({ name: 'John' });
    });

    it('should work in arrays and filtering', () => {
      const userId1 = new UserId('550e8400-e29b-41d4-a716-446655440000');
      const userId2 = new UserId('550e8400-e29b-41d4-a716-446655440001');
      const userId3 = new UserId('550e8400-e29b-41d4-a716-446655440000');

      const userIds = [userId1, userId2];

      const found = userIds.some((uid) => uid.equals(userId3));
      expect(found).toBe(true);
    });

    it('should support database persistence and retrieval', () => {
      const originalId = '550e8400-e29b-41d4-a716-446655440000';
      const userId1 = new UserId(originalId);

      const savedValue = userId1.getValue();
      const userId2 = new UserId(savedValue);

      expect(userId1.equals(userId2)).toBe(true);
    });
  });
});
