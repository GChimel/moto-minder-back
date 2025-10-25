import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './presentation/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.user-case';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { InMemoryUserRepository } from './infrastructure/adapters/in-memory-user.repository';

describe('UserController (Integration)', () => {
  let controller: UserController;
  let repository: InMemoryUserRepository;

  beforeEach(async () => {
    // Create a fresh repository for each test
    repository = new InMemoryUserRepository();

    // Create NestJS testing module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: repository, // Use in-memory repository for testing
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('createUser', () => {
    it('should create a user and return formatted response', async () => {
      // Arrange
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Act
      const response = await controller.createUser(dto);

      // Assert
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name', 'John Doe');
      expect(response).toHaveProperty('email', 'john@example.com');
      expect(response).toHaveProperty('createdAt');
      expect(response).toHaveProperty('updatedAt');
      expect(typeof response.id).toBe('string');
      expect(response.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Create first user
      await controller.createUser(dto);

      // Act & Assert
      await expect(
        controller.createUser({
          name: 'Jane Doe',
          email: 'john@example.com',
        }),
      ).rejects.toThrow('User with this email already exists');
    });

    it('should create multiple users with different emails', async () => {
      // Arrange & Act
      const user1 = await controller.createUser({
        name: 'John Doe',
        email: 'john@example.com',
      });
      const user2 = await controller.createUser({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });

      // Assert
      expect(user1.id).not.toBe(user2.id);
      expect(user1.email).toBe('john@example.com');
      expect(user2.email).toBe('jane@example.com');

      // Verify in repository
      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(2);
    });
  });
});
