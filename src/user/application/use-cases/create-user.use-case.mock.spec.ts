import { CreateUserUseCase } from './create-user.user-case';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';

describe('CreateUserUseCase (with Mocks)', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    // Create a mock repository using Jest
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should create a new user when email does not exist', async () => {
      // Arrange
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Mock: Email doesn't exist yet
      mockRepository.findByEmail.mockResolvedValue(null);

      // Mock: Save returns the user
      mockRepository.save.mockImplementation(async (user) => user);

      // Act
      const user = await useCase.execute(dto);

      // Assert
      expect(user).toBeDefined();
      expect(user.getName()).toBe('John Doe');
      expect(user.getEmail().getValue()).toBe('john@example.com');

      // Verify repository methods were called
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Mock: Email already exists
      const existingUser = User.create('Existing User', 'john@example.com');
      mockRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(
        'User with this email already exists',
      );

      // Verify save was NOT called
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should check email before saving', async () => {
      // Arrange
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.save.mockImplementation(async (user) => user);

      // Act
      await useCase.execute(dto);

      // Assert - Verify order of calls
      const findEmailCall = mockRepository.findByEmail.mock.invocationCallOrder[0];
      const saveCall = mockRepository.save.mock.invocationCallOrder[0];

      expect(findEmailCall).toBeLessThan(saveCall);
    });
  });
});
