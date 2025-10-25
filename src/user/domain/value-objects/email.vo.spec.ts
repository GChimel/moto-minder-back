import { Email } from './email.vo';

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create email with valid format', () => {
      // Arrange & Act
      const email = new Email('test@example.com');

      // Assert
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw error for email without @', () => {
      // Act & Assert
      expect(() => new Email('invalid-email')).toThrow('Invalid email format');
    });

    it('should throw error for empty email', () => {
      // Act & Assert
      expect(() => new Email('')).toThrow('Invalid email format');
    });

    it('should accept email with subdomain', () => {
      // Arrange & Act
      const email = new Email('user@mail.example.com');

      // Assert
      expect(email.getValue()).toBe('user@mail.example.com');
    });
  });

  describe('equals', () => {
    it('should return true for same email values', () => {
      // Arrange
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different email values', () => {
      // Arrange
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');

      // Act & Assert
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
