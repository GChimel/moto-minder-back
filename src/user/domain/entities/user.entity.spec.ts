import { User } from './user.entity';
import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a user with valid data', () => {
      // Arrange
      const name = 'John Doe';
      const email = 'john@example.com';

      // Act
      const user = User.create(name, email);

      // Assert
      expect(user).toBeDefined();
      expect(user.getName()).toBe('John Doe');
      expect(user.getEmail().getValue()).toBe('john@example.com');
      expect(user.getId()).toBeInstanceOf(UserId);
      expect(user.getCreatedAt()).toBeInstanceOf(Date);
      expect(user.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should trim whitespace from name', () => {
      // Arrange & Act
      const user = User.create('  John Doe  ', 'john@example.com');

      // Assert
      expect(user.getName()).toBe('John Doe');
    });

    it('should throw error if name is empty', () => {
      // Act & Assert
      expect(() => User.create('', 'john@example.com')).toThrow(
        'Name is required and must be at least 2 characters long',
      );
    });

    it('should throw error if name is too short', () => {
      // Act & Assert
      expect(() => User.create('J', 'john@example.com')).toThrow(
        'Name is required and must be at least 2 characters long',
      );
    });

    it('should throw error if email is invalid', () => {
      // Act & Assert
      expect(() => User.create('John Doe', 'invalid-email')).toThrow(
        'Invalid email format',
      );
    });
  });

  describe('updateName', () => {
    it('should update name and updatedAt timestamp', () => {
      // Arrange
      const user = User.create('John Doe', 'john@example.com');
      const originalUpdatedAt = user.getUpdatedAt();

      // Wait a bit to ensure timestamp changes
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      // Act
      user.updateName('Jane Doe');

      // Assert
      expect(user.getName()).toBe('Jane Doe');
      expect(user.getUpdatedAt().getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );

      jest.useRealTimers();
    });

    it('should throw error if new name is invalid', () => {
      // Arrange
      const user = User.create('John Doe', 'john@example.com');

      // Act & Assert
      expect(() => user.updateName('')).toThrow(
        'Name is required and must be at least 2 characters long',
      );
    });
  });

  describe('updateEmail', () => {
    it('should update email and updatedAt timestamp', () => {
      // Arrange
      const user = User.create('John Doe', 'john@example.com');
      const originalUpdatedAt = user.getUpdatedAt();

      // Wait a bit to ensure timestamp changes
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      // Act
      user.updateEmail('jane@example.com');

      // Assert
      expect(user.getEmail().getValue()).toBe('jane@example.com');
      expect(user.getUpdatedAt().getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );

      jest.useRealTimers();
    });

    it('should throw error if new email is invalid', () => {
      // Arrange
      const user = User.create('John Doe', 'john@example.com');

      // Act & Assert
      expect(() => user.updateEmail('invalid')).toThrow('Invalid email format');
    });
  });

  describe('getAccountAge', () => {
    it('should return account age in days', () => {
      // Arrange
      const user = User.create('John Doe', 'john@example.com');

      // Mock date to be 5 days later
      jest.useFakeTimers();
      jest.setSystemTime(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));

      // Act
      const age = user.getAccoutAge();

      // Assert
      expect(age).toBe(5);

      jest.useRealTimers();
    });
  });
});
