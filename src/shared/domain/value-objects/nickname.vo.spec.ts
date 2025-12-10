import { Nickname } from './nickname.vo';

describe('Nickname Value Object', () => {
  describe('constructor', () => {
    it('should create a valid nickname', () => {
      const nickname = new Nickname('My Harley');
      expect(nickname.getValue()).toBe('My Harley');
    });

    it('should trim whitespace', () => {
      const nickname = new Nickname('  Trimmed  ');
      expect(nickname.getValue()).toBe('Trimmed');
    });

    it('should reject empty nickname', () => {
      expect(() => new Nickname('')).toThrow();
      expect(() => new Nickname('  ')).toThrow();
    });

    it('should reject nickname shorter than 2 characters', () => {
      expect(() => new Nickname('A')).toThrow();
    });

    it('should reject nickname longer than 100 characters', () => {
      const longNickname = 'a'.repeat(101);
      expect(() => new Nickname(longNickname)).toThrow();
    });

    it('should accept nickname with exactly 2 characters', () => {
      const nickname = new Nickname('AB');
      expect(nickname.getValue()).toBe('AB');
    });

    it('should accept nickname with exactly 100 characters', () => {
      const longNickname = 'a'.repeat(100);
      const nickname = new Nickname(longNickname);
      expect(nickname.getValue()).toBe(longNickname);
    });

    it('should accept nickname with special characters', () => {
      const nickname = new Nickname("Joe's Harley-Davidson");
      expect(nickname.getValue()).toBe("Joe's Harley-Davidson");
    });

    it('should accept nickname with numbers', () => {
      const nickname = new Nickname('Bike123');
      expect(nickname.getValue()).toBe('Bike123');
    });
  });

  describe('equals', () => {
    it('should return true for identical nicknames', () => {
      const nickname1 = new Nickname('My Harley');
      const nickname2 = new Nickname('My Harley');
      expect(nickname1.equals(nickname2)).toBe(true);
    });

    it('should return false for different nicknames', () => {
      const nickname1 = new Nickname('My Harley');
      const nickname2 = new Nickname('Your Harley');
      expect(nickname1.equals(nickname2)).toBe(false);
    });

    it('should compare trimmed values', () => {
      const nickname1 = new Nickname('My Harley');
      const nickname2 = new Nickname('  My Harley  ');
      expect(nickname1.equals(nickname2)).toBe(true);
    });
  });

  describe('immutability', () => {
    it('should not be able to modify nickname after creation', () => {
      const nickname = new Nickname('My Harley');
      const originalValue = nickname.getValue();

      expect(nickname.getValue()).toBe(originalValue);
    });
  });
});
