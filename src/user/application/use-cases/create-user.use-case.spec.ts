import { CreateUserUseCase } from './create-user.user-case';
import { InMemoryUserRepository } from '../../infrastructure/adapters/in-memory-user.repository';
import { User } from '../../domain/entities/user.entity';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    // Create a fresh in-memory repository for each test
    repository = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(repository);
  });

  describe('execute', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Act
      const user = await useCase.execute(dto);

      // Assert
      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(User);
      expect(user.getName()).toBe('John Doe');
      expect(user.getEmail().getValue()).toBe('john@example.com');
      expect(user.getId()).toBeDefined();
    });

    it('should save user to repository', async () => {
      // Arrange
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Act
      const user = await useCase.execute(dto);

      // Assert - Verify it was saved by retrieving it
      const savedUser = await repository.findById(user.getId().getValue());
      expect(savedUser).toBeDefined();
      expect(savedUser?.getName()).toBe('John Doe');
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Create first user
      await useCase.execute(dto);

      // Act & Assert - Try to create another user with same email
      await expect(
        useCase.execute({
          name: 'Jane Doe',
          email: 'john@example.com', // Same email!
        }),
      ).rejects.toThrow('User with this email already exists');
    });

    it('should allow different emails', async () => {
      // Arrange
      const user1Dto = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const user2Dto = {
        name: 'Jane Doe',
        email: 'jane@example.com', // Different email
      };

      // Act
      const user1 = await useCase.execute(user1Dto);
      const user2 = await useCase.execute(user2Dto);

      // Assert
      expect(user1.getEmail().getValue()).toBe('john@example.com');
      expect(user2.getEmail().getValue()).toBe('jane@example.com');

      // Verify both are in repository
      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(2);
    });

    it('should throw error for invalid email format', async () => {
      // Arrange
      const dto = {
        name: 'John Doe',
        email: 'invalid-email', // No @
      };

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow('Invalid email format');
    });

    it('should throw error for invalid name', async () => {
      // Arrange
      const dto = {
        name: 'J', // Too short
        email: 'john@example.com',
      };

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Name is required and must be at least 2 characters long',
      );
    });
  });
});
