import { UserId } from './user-id.vo';

describe('UserId Value Object', () => {
  describe('constructor', () => {
    it('should generate UUID when no id provided', () => {
      // Arrange & Act
      const userId = new UserId();

      // Assert
      expect(userId.getValue()).toBeDefined();
      expect(userId.getValue()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should use provided id when given', () => {
      // Arrange
      const customId = '550e8400-e29b-41d4-a716-446655440000';

      // Act
      const userId = new UserId(customId);

      // Assert
      expect(userId.getValue()).toBe(customId);
    });

    it('should generate different UUIDs for different instances', () => {
      // Arrange & Act
      const userId1 = new UserId();
      const userId2 = new UserId();

      // Assert
      expect(userId1.getValue()).not.toBe(userId2.getValue());
    });
  });

  describe('equals', () => {
    it('should return true for same id values', () => {
      // Arrange
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const userId1 = new UserId(id);
      const userId2 = new UserId(id);

      // Act & Assert
      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false for different id values', () => {
      // Arrange
      const userId1 = new UserId();
      const userId2 = new UserId();

      // Act & Assert
      expect(userId1.equals(userId2)).toBe(false);
    });
  });
});
